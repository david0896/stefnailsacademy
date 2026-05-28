import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { wrapTemplate } from './emailTemplates';
import { getSignedUrl } from './supabaseStorage';

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
  // Si BASE_URL no está seteada en el env, usamos el dominio funcional de Vercel
  // (www.stefnails.com queda solo como display en el footer del template).
  const base = process.env.BASE_URL || 'https://stefnails.vercel.app';
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

/**
 * Bienvenida al alumno tras registro (no notifica al admin, por decisión).
 */
export const sendStudentWelcome = async ({ studentEmail, studentName }) => {
  const tpl = wrapTemplate({
    greeting:  `Hola ${studentName},`,
    title:     '¡Bienvenida a Stef Nails Academy! 💖',
    bodyHtml: `
      <p>Tu cuenta quedó creada. Ya puedes entrar y reservar tu cupo
        en cualquiera de nuestros cursos.</p>
      <p>Si tienes alguna duda, escríbenos respondiendo este correo
        — te respondemos personalmente.</p>
      <p>¡Nos vemos pronto!</p>`,
    ctaLabel: 'Ver cursos disponibles',
    ctaUrl:   boUrl('/Courses'),
  });

  return sendEmail({
    to:      studentEmail,
    subject: '¡Bienvenida a Stef Nails Academy!',
    html:    tpl.html,
    text:    tpl.text,
  });
};

/**
 * Nueva inscripción creada (estado PENDING) — alumno + admin.
 *
 * - Al alumno: "recibimos tu pago, lo estamos verificando".
 * - Al admin: resumen de transferencia + signed URL del comprobante (24h)
 *   + CTA al detalle en el BO para confirmar/cancelar.
 */
export const sendEnrollmentCreated = async ({
  studentEmail,
  studentName,
  courseName,
  enrollmentId,
  amountEUR,
  bankName,
  referenceNumber,
  paymentProofVariants, // shape: { base, sizes: { "400": path, ... } } o null
}) => {
  // Generar signed URL del comprobante para el admin (24h porque el correo
  // puede leerse varias horas después). Si falla, seguimos sin imagen.
  let proofUrl = null;
  if (paymentProofVariants?.sizes) {
    try {
      const sizes = paymentProofVariants.sizes;
      const path =
        sizes['1200'] || sizes['1600'] || sizes['800'] ||
        sizes['400']  || paymentProofVariants.base;
      proofUrl = await getSignedUrl(path, 86400); // 24h
    } catch (err) {
      console.error('[emailService] No se pudo generar signed URL del comprobante:', err?.message);
    }
  }

  // Correo al alumno
  const studentTpl = wrapTemplate({
    greeting:  `Hola ${studentName},`,
    title:     'Recibimos tu inscripción 🙌',
    bodyHtml: `
      <p>Ya tenemos tu inscripción al curso
        <strong>${courseName}</strong> y estamos verificando tu pago.</p>
      <p>En cuanto confirmemos la transferencia te avisamos por aquí
        — generalmente en menos de 24 horas hábiles.</p>
      <p>Mientras tanto, puedes ver el estado en tu perfil.</p>`,
    ctaLabel: 'Ver mis inscripciones',
    ctaUrl:   boUrl('/mi-perfil'),
    footerNote: 'Si no fuiste tú quien hizo esta inscripción, respondé este correo y la cancelamos.',
  });

  // Correo al admin — incluye datos del pago para verificar y link al comprobante
  const adminTpl = wrapTemplate({
    title:     'Nueva inscripción por verificar',
    bodyHtml: `
      <p>Una alumna acaba de inscribirse y subió su comprobante. Verificá
        los datos de la transferencia y confirmá la inscripción desde el BO:</p>
      <ul style="margin:8px 0 0 0; padding-left:18px;">
        <li><strong>Alumno:</strong> ${studentName}</li>
        <li><strong>Email:</strong> ${studentEmail}</li>
        <li><strong>Curso:</strong> ${courseName}</li>
        <li><strong>Monto:</strong> €${Number(amountEUR ?? 0).toFixed(2)}</li>
        <li><strong>Banco:</strong> ${bankName || '—'}</li>
        <li><strong>Referencia:</strong> ${referenceNumber || '—'}</li>
      </ul>
      ${proofUrl
        ? `<p style="margin-top:14px;">
             <a href="${proofUrl}" target="_blank"
                style="color:#ff5a5f; font-weight:500; text-decoration:underline;">
               Ver comprobante de pago ↗
             </a>
             <span style="color:#6b7280; font-size:12px;"> (link válido 24h)</span>
           </p>`
        : `<p style="margin-top:14px; color:#9ca3af; font-size:13px;">Sin comprobante adjunto.</p>`}`,
    ctaLabel: enrollmentId ? 'Ir al detalle en el BO' : undefined,
    ctaUrl:   enrollmentId ? boUrl(`/backoffice/inscripciones/${enrollmentId}`) : undefined,
  });

  return sendBoth({
    studentEmail,
    subject:       `Recibimos tu inscripción — ${courseName}`,
    studentHtml:   studentTpl.html,
    studentText:   studentTpl.text,
    adminHtml:     adminTpl.html,
    adminText:     adminTpl.text,
    adminSubject: `[Admin] Nueva inscripción por verificar — ${studentName}`,
  });
};
