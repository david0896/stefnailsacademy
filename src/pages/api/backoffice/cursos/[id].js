import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { z } from 'zod';
import { getCourseById } from '@/application/courses/getCourseById';
import { updateCourse } from '@/application/courses/updateCourse';
import { deleteCourse } from '@/application/courses/deleteCourse';

const updateCourseSchema = z.object({
  title:           z.string().min(3).optional(),
  description:     z.string().min(10).optional(),
  type:            z.enum(['PRESENCIAL', 'ONLINE']).optional(),
  status:          z.enum(['DRAFT', 'ACTIVE', 'INACTIVE']).optional(),
  priceEUR:        z.number().positive().optional(),
  duration:        z.string().optional(),
  instructor:      z.string().optional().nullable(),
  nivel:           z.enum(['PRINCIPIANTE', 'MEDIO', 'AVANZADO', 'MASTER']).optional().nullable(),
  horasAcademicas: z.number().int().positive().optional().nullable(),
  diasDeClases:    z.number().int().positive().optional().nullable(),
  maxSpots:        z.number().int().positive().optional().nullable(),
  date:            z.string().optional().nullable(),
  imageUrl:        z.string().url().optional().or(z.literal('')).nullable(),
});

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'No autorizado' });

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const course = await getCourseById(id);
      return res.status(200).json(course);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    const parsed = updateCourseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    try {
      const d = parsed.data;
      const course = await updateCourse(id, {
        ...d,
        date:       d.date      ? new Date(d.date) : null,
        imageUrl:   d.imageUrl  || null,
        instructor: d.instructor || null,
      });
      return res.status(200).json(course);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await deleteCourse(id);
      return res.status(200).json({ message: 'Curso eliminado correctamente' });
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
