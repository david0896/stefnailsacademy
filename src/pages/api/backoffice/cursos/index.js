import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { z } from 'zod';
import { getCourses } from '@/application/courses/getCourses';
import { createCourse } from '@/application/courses/createCourse';

const nullToUndef = (v) => (v === null || v === undefined ? undefined : v);
const nullOrEmpty = (v) => (v === null || v === '' || v === undefined ? undefined : v);
const nullableIntApi = z.preprocess(
  (v) => (v === null || v === undefined || v === '') ? undefined : Number(v),
  z.number().int().positive().optional(),
);

const createCourseSchema = z.object({
  title:           z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description:     z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  type:            z.enum(['PRESENCIAL', 'ONLINE']),
  status:          z.enum(['DRAFT', 'ACTIVE', 'INACTIVE']).default('DRAFT'),
  priceEUR:        z.preprocess(nullToUndef, z.number().positive('El precio debe ser mayor a 0')),
  instructor:      z.preprocess(nullToUndef, z.string().optional()),
  sede:            z.preprocess(nullToUndef, z.string().optional()),
  nivel:           z.preprocess(nullOrEmpty, z.enum(['PRINCIPIANTE', 'MEDIO', 'AVANZADO', 'MASTER']).optional()),
  horasAcademicas: nullableIntApi,
  diasDeClases:    nullableIntApi,
  maxSpots:        nullableIntApi,
  date:            z.preprocess(nullToUndef, z.string().optional()),
  imageUrl:        z.preprocess(nullOrEmpty, z.string().url('URL inválida').optional()),
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
      const d = parsed.data;
      const course = await createCourse({
        ...d,
        date:       d.date       ? new Date(d.date) : null,
        imageUrl:   d.imageUrl   ?? null,
        instructor: d.instructor ?? null,
        sede:       d.sede       ?? null,
      });
      return res.status(201).json(course);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
