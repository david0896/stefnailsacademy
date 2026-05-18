import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { z } from 'zod';
import { getStudents } from '@/application/students/getStudents';
import { createStudent } from '@/application/students/createStudent';

const createStudentSchema = z.object({
  firstName:       z.string().min(2, 'Mínimo 2 caracteres'),
  lastName:        z.string().min(2, 'Mínimo 2 caracteres'),
  email:           z.string().email('Email inválido'),
  phone:           z.string().min(7, 'Teléfono inválido'),
  idNumber:        z.string().min(4, 'Cédula inválida'),
  city:            z.string().min(2, 'Ciudad requerida'),
  state:           z.string().min(2, 'Estado requerido'),
  country:         z.string().default('Venezuela'),
  experienceLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
});

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'No autorizado' });

  if (req.method === 'GET') {
    try {
      const students = await getStudents();
      return res.status(200).json(students);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    const parsed = createStudentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    try {
      const student = await createStudent(parsed.data);
      return res.status(201).json(student);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
