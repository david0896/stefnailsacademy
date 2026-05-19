import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { getStudentById } from '@/application/students/getStudentById';
import { updateStudent } from '@/application/students/updateStudent';
import { deleteStudent } from '@/application/students/deleteStudent';

// Tratar null / "" del form como undefined para que .optional() los acepte
const nullishToUndef = (v) => (v === null || v === '' || v === undefined ? undefined : v);

const updateStudentSchema = z.object({
  firstName:       z.preprocess(nullishToUndef, z.string().min(2).optional()),
  lastName:        z.preprocess(nullishToUndef, z.string().min(2).optional()),
  email:           z.preprocess(nullishToUndef, z.string().email().optional()),
  phone:           z.preprocess(nullishToUndef, z.string().min(7).optional()),
  idNumber:        z.preprocess(nullishToUndef, z.string().min(4).optional()),
  city:            z.preprocess(nullishToUndef, z.string().min(2).optional()),
  state:           z.preprocess(nullishToUndef, z.string().min(2).optional()),
  country:         z.preprocess(nullishToUndef, z.string().optional()),
  experienceLevel: z.preprocess(nullishToUndef, z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional()),
  password:        z.preprocess(nullishToUndef, z.string().min(8, 'Mínimo 8 caracteres').optional()),
});

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'No autorizado' });

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const student = await getStudentById(id);
      if (student && student.password) delete student.password;
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
      const data = { ...parsed.data };
      // Si vino password, la hasheamos antes de guardar
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      } else {
        delete data.password;
      }
      const student = await updateStudent(id, data);
      // Nunca devolvemos el hash de la contraseña al cliente
      if (student && student.password) delete student.password;
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
