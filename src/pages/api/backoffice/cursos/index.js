import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { z } from 'zod';
import { getCourses } from '@/application/courses/getCourses';
import { createCourse } from '@/application/courses/createCourse';

const createCourseSchema = z.object({
  title:       z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  type:        z.enum(['PRESENCIAL', 'ONLINE']),
  status:      z.enum(['DRAFT', 'ACTIVE', 'INACTIVE']).default('DRAFT'),
  priceEUR:    z.number().positive('El precio debe ser mayor a 0'),
  duration:    z.string().min(1, 'La duración es requerida'),
  maxSpots:    z.number().int().positive().optional().nullable(),
  date:        z.string().optional().nullable(),
  imageUrl:    z.string().url().optional().nullable(),
});

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'No autorizado' });

  if (req.method === 'GET') {
    try {
      const courses = await getCourses();
      return res.status(200).json(courses);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    const parsed = createCourseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    try {
      const course = await createCourse({
        ...parsed.data,
        date: parsed.data.date ? new Date(parsed.data.date) : null,
      });
      return res.status(201).json(course);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
