import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { processAndUpload } from '@/infrastructure/services/imageOptimizer';

// Desactivamos el bodyParser de Next para recibir el archivo binario crudo
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_BYTES = 4 * 1024 * 1024; // 4 MB

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Requiere sesión activa del backoffice (consistente con el resto de
  // /api/backoffice/*, que solo verifican la existencia de sesión —
  // el acceso al BO ya está restringido por el middleware a admins).
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const { fileBase64, contentType, folder } = req.body || {};

    if (!fileBase64 || !contentType) {
      return res.status(400).json({ error: 'Falta el archivo o su tipo' });
    }
    if (!ALLOWED_TYPES.includes(contentType)) {
      return res.status(400).json({ error: 'Formato no permitido. Usa JPG, PNG o WebP.' });
    }

    // Decodificar base64 → buffer
    const base64 = fileBase64.includes(',') ? fileBase64.split(',')[1] : fileBase64;
    const buffer = Buffer.from(base64, 'base64');

    if (buffer.length > MAX_BYTES) {
      return res.status(400).json({ error: 'La imagen supera el límite de 4 MB' });
    }

    const safeFolder = ['cursos', 'contenido', 'general'].includes(folder) ? folder : 'general';
    const result = await processAndUpload(buffer, safeFolder);

    return res.status(201).json({
      base:   result.base,
      width:  result.width,
      height: result.height,
      sizes:  result.sizes,
      paths:  result.paths,
    });
  } catch (error) {
    console.error('[upload-imagen] error:', error);
    return res.status(500).json({ error: error.message || 'Error procesando la imagen' });
  }
}
