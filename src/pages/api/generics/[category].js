import prisma from '@/lib/prisma';

/**
 * GET /api/generics/:category
 *
 * Devuelve los items activos de una categoría de la tabla `generics`,
 * ordenados por (order asc, label asc). Endpoint PÚBLICO — no requiere sesión.
 *
 * Categorías disponibles hoy:
 *   - BANK_VE  → bancos venezolanos (códigos SUDEBAN)
 *
 * Cache HTTP largo (30 días fresco + 7 días stale-while-revalidate) porque
 * las listas cambian muy rara vez. El cliente además cachea en cookie/storage
 * para evitar refetch en cada inscripción.
 *
 * Respuesta:
 *   { category: string, items: Array<{ code, label, order }> }
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { category } = req.query;
  if (!category || typeof category !== 'string') {
    return res.status(400).json({ error: 'Falta el parámetro category' });
  }

  try {
    const items = await prisma.generic.findMany({
      where: { category, active: true },
      orderBy: [{ order: 'asc' }, { label: 'asc' }],
      select: { code: true, label: true, order: true },
    });

    // 30 días fresco, 7 días stale-while-revalidate.
    // Listas como bancos cambian rarísimo; vale la pena cachear agresivo.
    res.setHeader('Cache-Control', 'public, max-age=2592000, stale-while-revalidate=604800');
    return res.status(200).json({ category, items });
  } catch (error) {
    console.error('[api/generics/:category] error:', error);
    return res.status(500).json({ error: 'Error al obtener el catálogo' });
  }
}
