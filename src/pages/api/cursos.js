import { getActiveCourses } from '@/application/courses/getCourses';
import { getEuroRate } from '@/infrastructure/services/exchangeRateService';
import { formatCurso } from '@/utils/formatCurso';

/**
 * GET /api/cursos
 * Retorna cursos ACTIVE con precios convertidos a Bs.
 * Shape compatible con useCursos / useCursosProximos.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const [rawCourses, tasaEur] = await Promise.all([
      getActiveCourses(),
      getEuroRate(),
    ]);

    const data = rawCourses.map((c) => formatCurso(c, tasaEur));

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
    return res.status(200).json(data);
  } catch (error) {
    console.error('[/api/cursos] Error:', error.message);
    return res.status(500).json({ error: 'Error al obtener cursos', detalles: error.message });
  }
}
