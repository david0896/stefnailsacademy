// utils/emailTemplates.js
const createInscripcionEmailHTML = (formData, nombreCurso, precioCurso) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #1a365d;">Nueva inscripción al curso ${nombreCurso}</h2>
    
    <div style="background: #f7fafc; padding: 20px; border-radius: 8px;">
      <h3 style="color: #2d3748; margin-bottom: 15px;">Datos del participante</h3>
      <p><strong>Nombre completo:</strong> ${formData.nombre} ${formData.apellido}</p>
      <p><strong>Cédula:</strong> ${formData.cedula}</p>
      <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
      <p><strong>Teléfono:</strong> ${formData.telefono}</p>
      
      <h3 style="color: #2d3748; margin: 20px 0 15px;">Detalles de pago</h3>
      <p><strong>Banco emisor:</strong> ${formData.bancoEmisor}</p>
      <p><strong>Referencia:</strong> ${formData.referencia}</p>
      <p><strong>Monto transferido: </strong>${formData.monto} Bs.</p>
      <p><strong>Precio del curso: </strong>${precioCurso} Bs.</p>
    </div>

    <hr style="border: 1px solid #e2e8f0; margin: 20px 0;">
    
    <p style="color: #718096; font-size: 0.9em;">
      Inscripción realizada el ${new Date().toLocaleDateString('es-VE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })}
    </p>
  </div>
`;

module.exports = {createInscripcionEmailHTML };