import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { wrapTemplate } from './emailTemplates';

/**
 * emailService — envío de emails con Gmail OAuth2 y plantillas de marca.
 *
 * Diseño:
 * - sendEmail NUNCA lanza excepción. Si Gmail falla, devuelve { ok: false, error }
 *   y loguea a consola. Las acciones de negocio (crear/confirmar/cancelar
 *   inscripción) no deben fallar porque el SMTP esté caído.
 * - sendBoth({ studentEmail, subject, studentHtml, adminHtml }) envía en paralelo
 *   al alumno y al admin (EMAIL_RECIPIENT). Devuelve los resultados de cada uno.
 * - Los helpers de alto nivel (sendEnrollmentConfirmed, sendEnrollmentCancelled)
 *   usan wrapTemplate para tener look & feel consistente con la marca.
 */

const createTransporter = async () => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
  const accessToken = await oAuth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type:         'OAuth2',
      user:         process.env.EMAIL_USER,
      clientId:     process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken:  accessToken.token,
    },
  });
};

/**
 * Envía un correo. NUNCA lanza — captura cualquier error y lo devuelve en el
 * objeto resultado. Esto permite que los use cases sigan adelante si el envío
 * falla (la inscripción no debe romperse porque Gmail no responda).
 *
 * @returns {Promise<{ ok: boolean, messageId?: string, error?: string }>}
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  if (!to) {
    return { ok: false, error: 'sendEmail: destinatario vacío' };
  }
  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({
      from: `"Stef Nails Academy" <${process.env.EMAIL_USER}>`,
      to, subject, html, text,
    });
    return { ok: true, messageId: info.messageId };
  } catch (error) {
    console.error('[emailService] sendEmail failed:', {
      to,
      subject,
      error: error?.message || String(error),
    });
    return { ok: false, error: error?.message || String(error) };
  }
};

/**
 * Envía el mismo evento al alumno y al admin (EMAIL_RECIPIENT) en paralelo.
 * Si EMAIL_RECIPIENT no está configurado, el admin se omite con un warning
 * (no rompe el envío al alumno).
 *
 * @param {object} args
 * @param {string} args.studentEmail
 * @param {string} args.subject       - Subject para el alumno
 * @param {string} args.studentHtml
 * @param {string} args.studentText
 * @param {string} args.adminHtml
 * @param {string} args.adminText
 * @param {string} [args.adminSubject] - Override; si no se pasa, se prefija "[Admin]" al subject del alumno
 * @returns {Promise<{ student: object, admin: object }>}
 */
export const sendBoth = async ({
  studentEmail,
  subject,
  studentHtml,
  studentText,
  adminHtml,
  adminText,
  adminSubject,
}) => {
  const adminEmail = process.env.EMAIL_RECIPIENT;

  const studentPromise = sendEmail({
    to:      studentEmail,
    subject,
    html:    studentHtml,
    text:    studentText,
  });

  const adminPromise = adminEmail
    ? sendEmail({
        to:      adminEmail,
        subject: adminSubject || `[Admin] ${subject}`,
        html:    adminHtml,
        text:    adminText,
      })
    : Promise.resolve({ ok: false, error: 'EMAIL_RECIPIENT no configurado — copia admin omitida' });

  if (!adminEmail) {
    console.warn('[emailService] EMAIL_RECIPIENT vacío — no se envía copia al admin');
  }

  const [student, admin] = await Promise.all([studentPromise, adminPromise]);
  return { student, admin };
};

// ─── Helpers de alto nivel ─────────────────────────────────────────────────

const boUrl = (path = '') => {
  const base = process.env.BASE_URL || 'https://www.stefnailsacademy.com';
  return `${base.replace(/\/+$/, '')}${path}`;
};

/**
 * Inscripción CONFIRMADA — envía al alumno + copia al admin.
 */
export const sendEnrollmentConfirmed = async ({
  studentEmail,
  studentName,
  courseName,
  enrollmentId,
}) => {
  // Correo al alumno — voz cercana
  const studentTpl = wrapTemplate({
    greeting:  `Hola ${studentName},`,
    title:     '¡Tu inscripción está confirmada! 🎉',
    bodyHtml: `
      <p>Recibimos y verificamos tu pago para el curso
        <strong>${courseName}</strong>. Ya quedaste oficialmente inscrita.</p>
      <p>Si el curso es presencial, te confirmamos lugar y horario por aquí
        unos días antes. Si es online, te compartimos el acceso al contenido
        cuando esté listo.</p>
      <p>¡Cualquier cosa, escríbenos!</p>`,
    ctaLabel: 'Ver mis inscripciones',
    ctaUrl:   boUrl('/mi-perfil'),
  });

  // Correo al admin — con link al detalle en el BO
  const adminTpl = wrapTemplate({
    title:     'Inscripción confirmada',
    bodyHtml: `
      <p>Se acaba de confirmar una inscripción:</p>
      <ul style="margin:8px 0 0 0; padding-left:18px;">
        <li><strong>Alumno:</strong> ${studentName}</li>
        <li><strong>Email:</strong> ${studentEmail}</li>
        <li><strong>Curso:</strong> ${courseName}</li>
      </ul>`,
    ctaLabel: enrollmentId ? 'Ver detalle en el BO' : undefined,
    ctaUrl:   enrollmentId ? boUrl(`/backoffice/inscripciones/${enrollmentId}`) : undefined,
  });

  return sendBoth({
    studentEmail,
    subject:       `✅ Inscripción confirmada — ${courseName}`,
    studentHtml:   studentTpl.html,
    studentText:   studentTpl.text,
    adminHtml:     adminTpl.html,
    adminText:     adminTpl.text,
    adminSubject: `[Admin] Inscripción confirmada — ${studentName}`,
  });
};

/**
 * Inscripción CANCELADA — envía al alumno + copia al admin.
 */
export const sendEnrollmentCancelled = async ({
  studentEmail,
  studentName,
  courseName,
  enrollmentId,
}) => {
  const studentTpl = wrapTemplate({
    greeting:  `Hola ${studentName},`,
    title:     'Tu inscripción fue cancelada',
    bodyHtml: `
      <p>Lamentamos avisarte que tu inscripción al curso
        <strong>${courseName}</strong> no pudo confirmarse y fue cancelada.</p>
      <p>Esto suele pasar cuando no podemos verificar el pago de la
        transferencia. Si crees que es un error, escríbenos respondiendo este
        correo y lo revisamos juntos.</p>
      <p>¡Gracias por entender!</p>`,
    ctaLabel: 'Volver al sitio',
    ctaUrl:   boUrl('/Courses'),
  });

  const adminTpl = wrapTemplate({
    title:     'Inscripción cancelada',
    bodyHtml: `
      <p>Se canceló una inscripción:</p>
      <ul style="margin:8px 0 0 0; padding-left:18px;">
        <li><strong>Alumno:</strong> ${studentName}</li>
        <li><strong>Email:</strong> ${studentEmail}</li>
        <li><strong>Curso:</strong> ${courseName}</li>
      </ul>`,
    ctaLabel: enrollmentId ? 'Ver detalle en el BO' : undefined,
    ctaUrl:   enrollmentId ? boUrl(`/backoffice/inscripciones/${enrollmentId}`) : undefined,
  });

  return sendBoth({
    studentEmail,
    subject:       `❌ Inscripción cancelada — ${courseName}`,
    studentHtml:   studentTpl.html,
    studentText:   studentTpl.text,
    adminHtml:     adminTpl.html,
    adminText:     adminTpl.text,
    adminSubject: `[Admin] Inscripción cancelada — ${studentName}`,
  });
};
