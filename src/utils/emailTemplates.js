// utils/emailTemplates.js
const createContactEmailHTML = (name, email, subject, message) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #1a365d;">Nuevo mensaje de contacto</h2>
    
    <div style="background: #f7fafc; padding: 20px; border-radius: 8px;">
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Asunto:</strong> ${subject}</p>
      <p><strong>Mensaje:</strong></p>
      <div style="white-space: pre-wrap; margin-top: 10px;">${message}</div>
    </div>

    <hr style="border: 1px solid #e2e8f0; margin: 20px 0;">
    
    <p style="color: #718096; font-size: 0.9em;">
      Mensaje enviado desde el formulario de contacto - ${new Date().toLocaleDateString()}
    </p>
  </div>
`;

module.exports = { createContactEmailHTML };