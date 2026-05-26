import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { processAndUploadPrivate } from '@/infrastructure/services/imageOptimizer';

// Recibimos la imagen como base64 dentro del body, no como multipart.
// Esto mantiene el contrato igual al de /api/backoffice/upload-imagen y nos
// permite usar el bodyParser estándar de Next con un límite explícito.
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_BYTES = 4 * 1024 * 1024; // 4 MB

/**
 * POST /api/student/upload-comprobante
 *
 * Permite a un alumno autenticado subir su comprobante de pago (imagen de
 * transferencia / pago móvil). La imagen se optimiza a 4 variantes WebP
 * responsive y se guarda en el bucket PRIVADO 'comprobantes' de Supabase.
 *
 * Respuesta: { base, width, height, sizes, paths } donde sizes contiene
 * PATHS dentro del bucket privado — no URLs públicas. El BO genera signed
 * URLs on-demand para visualizarlas.
 *
 * Body: { fileBase64: string, contentType: string }
 *
 * Restricciones:
 * - Sólo POST
 * - Sólo sesión con role === 'STUDENT'
 * - Sólo JPG, PNG o WebP
 * - Máx 4 MB
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  if (session.user?.role !== 'STUDENT') {
    // Endpoint dedicado al sitio público. Los admins del BO usan su propio
    // /api/backoffice/upload-imagen para imágenes de cursos.
    return res.status(403).json({ error: 'Acceso reservado a alumnos' });
  }

  try {
    const { fileBase64, contentType } = req.body || {};

    if (!fileBase64 || !contentType) {
      return res.status(400).json({ error: 'Falta el archivo o su tipo' });
    }
    if (!ALLOWED_TYPES.includes(contentType)) {
      return res.status(400).json({ error: 'Formato no permitido. Usa JPG, PNG o WebP.' });
    }

    // Decodificar base64 → buffer (acepta tanto data URL como base64 puro)
    const base64 = fileBase64.includes(',') ? fileBase64.split(',')[1] : fileBase64;
    const buffer = Buffer.from(base64, 'base64');

    if (buffer.length > MAX_BYTES) {
      return res.status(400).json({ error: 'La imagen supera el límite de 4 MB' });
    }

    // Sin subcarpeta: el bucket 'comprobantes' ya es el namespace
    const result = await processAndUploadPrivate(buffer, '');

    return res.status(201).json({
      base:   result.base,
      width:  result.width,
      height: result.height,
      sizes:  result.sizes,
      paths:  result.paths,
    });
  } catch (error) {
    console.error('[student/upload-comprobante] error:', error);
    return res.status(500).json({ error: error.message || 'Error procesando el comprobante' });
  }
}
