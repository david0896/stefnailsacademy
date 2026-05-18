import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getEnrollmentById } from '@/application/enrollments/getEnrollmentById';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'No autorizado' });

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const enrollment = await getEnrollmentById(id);
      return res.status(200).json(enrollment);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
