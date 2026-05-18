import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { z } from 'zod';
import { updateContent } from '@/application/content/updateContent';

const upsertSchema = z.object({
  value: z.string().min(1, 'El valor no puede estar vacío'),
  type:  z.enum(['TEXT', 'IMAGE', 'JSON']),
});

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'No autorizado' });

  // La key viene en la URL: /api/backoffice/contenido/hero.title
  // Next.js la pasa como string, pero los puntos en el param pueden ser
  // capturados como array — normalizamos a string
  const rawKey = req.query.key;
  const key = Array.isArray(rawKey) ? rawKey.join('.') : rawKey;

  if (req.method === 'PUT') {
    const parsed = upsertSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    // Validación extra: si type es JSON, verificar que el valor sea JSON válido
    if (parsed.data.type === 'JSON') {
      try {
        JSON.parse(parsed.data.value);
      } catch {
        return res.status(400).json({ error: 'El valor debe ser JSON válido' });
      }
    }

    try {
      const content = await updateContent(key, {
        value: parsed.data.value,
        type:  parsed.data.type,
      });
      return res.status(200).json(content);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
