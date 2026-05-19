import { z } from 'zod';
import { registerStudent } from '@/application/students/registerStudent';

const registroSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName:  z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email:     z.string().email('Correo inválido'),
  password:  z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const parsed = registroSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const student = await registerStudent(parsed.data);
    return res.status(201).json({
      id:        student.id,
      email:     student.email,
      firstName: student.firstName,
      lastName:  student.lastName,
    });
  } catch (error) {
    return res.status(422).json({ error: error.message });
  }
}
