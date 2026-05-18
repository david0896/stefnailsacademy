import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { z } from 'zod';
import { getStudentById } from '@/application/students/getStudentById';
import { updateStudent } from '@/application/students/updateStudent';
import { deleteStudent } from '@/application/students/deleteStudent';

const updateStudentSchema = z.object({
  firstName:       z.string().min(2).optional(),
  lastName:        z.string().min(2).optional(),
  email:           z.string().email().optional(),
  phone:           z.string().min(7).optional(),
  idNumber:        z.string().min(4).optional(),
  city:            z.string().min(2).optional(),
  state:           z.string().min(2).optional(),
  country:         z.string().optional(),
  experienceLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
});

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'No autorizado' });

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const student = await getStudentById(id);
      return res.status(200).json(student);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    const parsed = updateStudentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    try {
      const student = await updateStudent(id, parsed.data);
      return res.status(200).json(student);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await deleteStudent(id);
      return res.status(200).json({ message: 'Alumno eliminado correctamente' });
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
