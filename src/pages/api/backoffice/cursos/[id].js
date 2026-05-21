import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { z } from 'zod';
import { getCourseById } from '@/application/courses/getCourseById';
import { updateCourse } from '@/application/courses/updateCourse';
import { deleteCourse } from '@/application/courses/deleteCourse';

const nullToUndef = (v) => (v === null || v === undefined ? undefined : v);
const nullOrEmpty = (v) => (v === null || v === '' || v === undefined ? undefined : v);
const nullableIntApi = z.preprocess(
  (v) => (v === null || v === undefined || v === '') ? undefined : Number(v),
  z.number().int().positive().optional(),
);

// null → "borrar variantes"; objeto válido → setear; undefined → no tocar
const imageVariantsUpdate = z.preprocess(
  (v) => (v === '' || v === undefined ? undefined : v),
  z.object({
    base:   z.string().url(),
    width:  z.number().optional(),
    height: z.number().optional(),
    sizes:  z.record(z.string()),
  }).nullable().optional(),
);

const updateCourseSchema = z.object({
  title:           z.string().min(3).optional(),
  description:     z.string().min(10).optional(),
  type:            z.enum(['PRESENCIAL', 'ONLINE']).optional(),
  status:          z.enum(['DRAFT', 'ACTIVE', 'INACTIVE']).optional(),
  priceEUR:        z.preprocess(nullToUndef, z.number().positive().optional()),
  instructor:      z.preprocess(nullToUndef, z.string().optional()),
  sede:            z.preprocess(nullToUndef, z.string().optional()),
  nivel:           z.preprocess(nullOrEmpty, z.enum(['PRINCIPIANTE', 'MEDIO', 'AVANZADO', 'MASTER']).optional()),
  horasAcademicas: nullableIntApi,
  diasDeClases:    nullableIntApi,
  maxSpots:        nullableIntApi,
  date:            z.preprocess(nullToUndef, z.string().optional()),
  imageUrl:        z.preprocess(nullOrEmpty, z.string().url().optional()),
  imageVariants:   imageVariantsUpdate,
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
        date:       d.date       ? new Date(d.date) : null,
        imageUrl:   d.imageUrl   ?? null,
        instructor: d.instructor ?? null,
        sede:       d.sede       ?? null,
        // imageVariants: si vino (objeto o null) se aplica; si es undefined
        // el spread lo incluye como undefined → Prisma lo ignora
        imageVariants: d.imageVariants === undefined ? undefined : d.imageVariants,
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
