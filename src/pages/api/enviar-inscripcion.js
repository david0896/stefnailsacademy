// src/pages/api/enviar-inscripcion.js
import { createTransporter } from '@/utils/emailConfig';
import { createInscripcionEmailHTML } from '@/utils/emailTemplatesInscriptionCourse';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { 
      nombre,
      apellido,
      cedula,
      email,
      telefono,
      bancoEmisor,
      referencia,
      monto,
      nombreCurso,
      precio
    } = req.body;

    // Validación básica
    const requiredFields = [
      'nombre', 'apellido', 'cedula', 'email', 
      'telefono', 'bancoEmisor', 'referencia', 'monto'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Campos requeridos faltantes',
        missing: missingFields
      });
    }

    const transporter = await createTransporter();

    await transporter.sendMail({
      from: `"Inscripciones Cursos" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECIPIENT,
      subject: `Nueva inscripción de ${nombre} ${apellido}`,
      html: createInscripcionEmailHTML(req.body, nombreCurso, precio),
      text: `
        Datos del participante:
        Nombre: ${nombre} ${apellido}
        Cédula: ${cedula}
        Email: ${email}
        Teléfono: ${telefono}

        Detalles de pago:
        Banco emisor: ${bancoEmisor}
        Referencia: ${referencia}
        Monto transferido: ${monto}
        Curso: ${nombreCurso}
        Precio del curso: ${precio}
      `
    });

    return res.status(200).json({ success: true, message: 'Inscripción enviada con éxito' });
    
  } catch (error) {
    console.error('Error en API:', error);
    return res.status(500).json({ 
      error: 'Error al procesar la inscripción',
      details: error.message 
    });
  }
}