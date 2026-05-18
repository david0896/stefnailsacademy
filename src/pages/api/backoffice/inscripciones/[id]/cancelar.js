import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { cancelEnrollment } from '@/application/enrollments/cancelEnrollment';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'No autorizado' });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { id } = req.query;

  try {
    const enrollment = await cancelEnrollment(id);
    return res.status(200).json(enrollment);
  } catch (error) {
    return res.status(422).json({ error: error.message });
  }
}
