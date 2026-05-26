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

// Bucket público de imágenes (cursos, hero, etc.) — URLs servidas directo.
const PUBLIC_BUCKET = 'imagenes';

// Bucket privado de comprobantes de pago — sin URL pública,
// se accede sólo con signed URLs generadas server-side por el BO.
const PRIVATE_BUCKET = 'comprobantes';

/**
 * Sube un buffer al bucket público de imágenes.
 * @param {string} path - ruta dentro del bucket (ej: "cursos/abc-800.webp")
 * @param {Buffer} buffer - contenido del archivo
 * @param {string} contentType - MIME type (ej: "image/webp")
 * @returns {Promise<string>} URL pública del archivo
 */
export async function uploadImage(path, buffer, contentType = 'image/webp') {
  const supabase = getClient();

  const { error } = await supabase.storage.from(PUBLIC_BUCKET).upload(path, buffer, {
    contentType,
    upsert: true,
    cacheControl: '31536000', // 1 año — los nombres son únicos por hash
  });

  if (error) {
    throw new Error(`Error subiendo imagen a storage: ${error.message}`);
  }

  const { data } = supabase.storage.from(PUBLIC_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Borra una lista de rutas del bucket PÚBLICO.
 * @param {string[]} paths
 */
export async function deleteImages(paths = []) {
  if (!paths.length) return;
  const supabase = getClient();
  const { error } = await supabase.storage.from(PUBLIC_BUCKET).remove(paths);
  if (error) {
    console.error('Error borrando imágenes de storage:', error.message);
  }
}

/**
 * Sube un buffer al bucket PRIVADO de comprobantes.
 * No devuelve URL — devuelve el path. La URL se obtiene on-demand con getSignedUrl().
 * @param {string} path - ruta dentro del bucket (ej: "comprobantes/abc-800.webp")
 * @param {Buffer} buffer
 * @param {string} contentType
 * @returns {Promise<string>} el mismo path, confirmando la subida
 */
export async function uploadPrivate(path, buffer, contentType = 'image/webp') {
  const supabase = getClient();

  const { error } = await supabase.storage.from(PRIVATE_BUCKET).upload(path, buffer, {
    contentType,
    upsert: true,
    cacheControl: '31536000',
  });

  if (error) {
    throw new Error(`Error subiendo comprobante a storage: ${error.message}`);
  }

  return path;
}

/**
 * Genera una URL firmada temporal para acceder a un objeto del bucket privado.
 * Sólo debe llamarse server-side (usa el service_role).
 * @param {string} path - path dentro del bucket privado
 * @param {number} expiresIn - segundos de validez (default 1h)
 * @returns {Promise<string>} signed URL
 */
export async function getSignedUrl(path, expiresIn = 3600) {
  const supabase = getClient();
  const { data, error } = await supabase.storage
    .from(PRIVATE_BUCKET)
    .createSignedUrl(path, expiresIn);

  if (error) {
    throw new Error(`Error generando signed URL: ${error.message}`);
  }
  return data.signedUrl;
}

/**
 * Genera signed URLs para un mapa de paths (útil para servir las variantes
 * del comprobante de una vez). Devuelve un mapa con la misma forma de entrada.
 * @param {Record<string,string>} pathsByKey - ej: { "400": "comprobantes/...-400.webp", ... }
 * @param {number} expiresIn
 * @returns {Promise<Record<string,string>>}
 */
export async function getSignedUrls(pathsByKey, expiresIn = 3600) {
  const entries = Object.entries(pathsByKey || {});
  if (!entries.length) return {};
  const out = {};
  // En lote — el SDK de Supabase no expone createSignedUrls bien tipado para este caso,
  // así que vamos uno a uno (4 variantes a lo sumo).
  for (const [key, path] of entries) {
    out[key] = await getSignedUrl(path, expiresIn);
  }
  return out;
}

/**
 * Borra una lista de rutas del bucket PRIVADO.
 * @param {string[]} paths
 */
export async function deletePrivate(paths = []) {
  if (!paths.length) return;
  const supabase = getClient();
  const { error } = await supabase.storage.from(PRIVATE_BUCKET).remove(paths);
  if (error) {
    console.error('Error borrando comprobantes de storage:', error.message);
  }
}

export const STORAGE_BUCKET         = PUBLIC_BUCKET;   // alias retro-compatible
export const STORAGE_PRIVATE_BUCKET = PRIVATE_BUCKET;
