import prisma from '@/lib/prisma';

/**
 * GET /api/contenido?keys=hero.slide.1,hero.slide.2,hero.slide.3
 * GET /api/contenido  → devuelve todos los bloques de contenido
 *
 * Endpoint público de solo lectura. No requiere autenticación.
 * El BO usa /api/backoffice/contenido (con auth) para editar.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { keys } = req.query;

    const where = keys
      ? { key: { in: keys.split(',').map((k) => k.trim()) } }
      : {};

    const content = await prisma.content.findMany({
      where,
      select: { key: true, value: true, type: true },
      orderBy: { key: 'asc' },
    });

    // Parsear automáticamente los campos JSON
    const parsed = content.map((item) => ({
      ...item,
      value: item.type === 'JSON' ? JSON.parse(item.value) : item.value,
    }));

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    return res.status(200).json(parsed);
  } catch (error) {
    console.error('[/api/contenido] Error:', error.message);
    return res.status(500).json({ error: 'Error al obtener contenido' });
  }
}
