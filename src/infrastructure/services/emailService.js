import nodemailer from 'nodemailer';
import { google } from 'googleapis';

/**
 * emailService — Servicio de envío de emails via Gmail OAuth2
 * Refactorización de src/utils/emailConfig.js para la arquitectura limpia
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
      type: 'OAuth2',
      user: process.env.EMAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = await createTransporter();
  return transporter.sendMail({
    from: `"Stef Nails Academy" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text,
  });
};

export const sendEnrollmentConfirmed = async ({ studentEmail, studentName, courseName }) => {
  return sendEmail({
    to: studentEmail,
    subject: `✅ Inscripción confirmada — ${courseName}`,
    html: `<p>Hola ${studentName}, tu inscripción al curso <strong>${courseName}</strong> ha sido confirmada.</p>`,
    text: `Hola ${studentName}, tu inscripción al curso ${courseName} ha sido confirmada.`,
  });
};

export const sendEnrollmentCancelled = async ({ studentEmail, studentName, courseName }) => {
  return sendEmail({
    to: studentEmail,
    subject: `❌ Inscripción cancelada — ${courseName}`,
    html: `<p>Hola ${studentName}, tu inscripción al curso <strong>${courseName}</strong> ha sido cancelada.</p>`,
    text: `Hola ${studentName}, tu inscripción al curso ${courseName} ha sido cancelada.`,
  });
};
