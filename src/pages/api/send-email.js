// src/pages/api/send-email.js
import { createTransporter } from '@/utils/emailConfig';
import { createContactEmailHTML } from '@/utils/emailTemplates';

// Cambiar a export default
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { name, email, subject, message } = req.body;

    // Validación
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const transporter = await createTransporter();

    await transporter.sendMail({
      from: `"Formulario de Contacto" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECIPIENT || 'davidvasquez0896@gmail.com',
      subject: `Nuevo mensaje: ${subject}`,
      html: createContactEmailHTML(name, email, subject, message),
      text: `
        Nombre: ${name}
        Email: ${email}
        Asunto: ${subject}
        Mensaje: ${message}
      `
    });

    return res.status(200).json({ success: true, message: 'Mensaje enviado con éxito' });
    
  } catch (error) {
    console.error('Error en API:', error);
    return res.status(500).json({ 
      error: 'Error al enviar el mensaje',
      details: error.message 
    });
  }
}