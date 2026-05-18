import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { z } from 'zod';
import { getEnrollments } from '@/application/enrollments/getEnrollments';
import { createEnrollment } from '@/application/enrollments/createEnrollment';

const createEnrollmentSchema = z.object({
  studentId:       z.string().min(1, 'Alumno requerido'),
  courseId:        z.string().min(1, 'Curso requerido'),
  paymentMethod:   z.enum(['TRANSFER', 'GATEWAY']),
  bankName:        z.string().optional().nullable(),
  referenceNumber: z.string().optional().nullable(),
  notes:           z.string().optional().nullable(),
});

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'No autorizado' });

  if (req.method === 'GET') {
    try {
      const { status, courseId } = req.query;
      const enrollments = await getEnrollments({
        ...(status   ? { status }   : {}),
        ...(courseId ? { courseId } : {}),
      });
      return res.status(200).json(enrollments);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    const parsed = createEnrollmentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    try {
      const enrollment = await createEnrollment(parsed.data);
      return res.status(201).json(enrollment);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
