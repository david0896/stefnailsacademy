import { createClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase con service_role key — SOLO para uso server-side.
 * El service_role bypassa RLS, por eso NUNCA debe exponerse al cliente.
 */
let _client = null;

function getClient() {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Faltan variables de entorno SUPABASE_URL y/o SUPABASE_SERVICE_KEY'
    );
  }

  _client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

const BUCKET = 'imagenes';

/**
 * Sube un buffer al bucket de imágenes.
 * @param {string} path - ruta dentro del bucket (ej: "cursos/abc-800.webp")
 * @param {Buffer} buffer - contenido del archivo
 * @param {string} contentType - MIME type (ej: "image/webp")
 * @returns {Promise<string>} URL pública del archivo
 */
export async function uploadImage(path, buffer, contentType = 'image/webp') {
  const supabase = getClient();

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType,
    upsert: true,
    cacheControl: '31536000', // 1 año — los nombres son únicos por hash
  });

  if (error) {
    throw new Error(`Error subiendo imagen a storage: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Borra una lista de rutas del bucket.
 * @param {string[]} paths
 */
export async function deleteImages(paths = []) {
  if (!paths.length) return;
  const supabase = getClient();
  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) {
    console.error('Error borrando imágenes de storage:', error.message);
  }
}

export const STORAGE_BUCKET = BUCKET;
