import sharp from 'sharp';
import crypto from 'crypto';
import { uploadImage, uploadPrivate } from './supabaseStorage';

// Anchos de las variantes responsive que generamos por cada imagen
export const VARIANT_WIDTHS = [400, 800, 1200, 1600];

// Calidad WebP (0-100). 80 es el balance estándar calidad/peso.
const WEBP_QUALITY = 80;

/**
 * Genera las variantes WebP de un buffer de imagen, sin subirlas.
 * Helper interno compartido entre processAndUpload y processAndUploadPrivate.
 * @returns {Promise<{ metadata: sharp.Metadata, variants: Array<{ width: number, buffer: Buffer }> }>}
 */
async function buildVariants(buffer) {
  const image = sharp(buffer, { failOn: 'error' });
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error('El archivo no es una imagen válida');
  }

  const variants = [];
  // No agrandamos más allá del original. Si la original es < 800px,
  // no generamos 1200/1600. Garantizamos al menos la variante más chica.
  for (const width of VARIANT_WIDTHS) {
    if (width > metadata.width && width !== VARIANT_WIDTHS[0]) continue;

    const resized = await sharp(buffer)
      .rotate() // respeta orientación EXIF
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    variants.push({ width, buffer: resized });
  }

  return { metadata, variants };
}

function buildBaseName(folder, hash) {
  return folder
    ? `${folder}/${Date.now()}-${hash}`
    : `${Date.now()}-${hash}`;
}

/**
 * Procesa un buffer y sube las variantes al bucket PÚBLICO 'imagenes'.
 * Devuelve URLs públicas (formato esperado por Course.imageVariants).
 *
 * @param {Buffer} buffer
 * @param {string} folder - subcarpeta dentro del bucket (ej: "cursos")
 * @returns {Promise<{ base: string, width: number, height: number, sizes: Record<string,string>, paths: string[] }>}
 */
export async function processAndUpload(buffer, folder = 'general') {
  const { metadata, variants } = await buildVariants(buffer);
  const hash = crypto.createHash('sha1').update(buffer).digest('hex').slice(0, 12);
  const baseName = buildBaseName(folder, hash);

  const sizes = {};
  const paths = [];

  for (const { width, buffer: resized } of variants) {
    const path = `${baseName}-${width}.webp`;
    const url = await uploadImage(path, resized, 'image/webp');
    sizes[String(width)] = url;
    paths.push(path);
  }

  const availableWidths = Object.keys(sizes).map(Number).sort((a, b) => b - a);
  return {
    base: sizes[String(availableWidths[0])],
    width: metadata.width,
    height: metadata.height,
    sizes,
    paths,
  };
}

/**
 * Procesa un buffer y sube las variantes al bucket PRIVADO 'comprobantes'.
 * Devuelve PATHS (no URLs) — la URL pública no existe en buckets privados,
 * se genera on-demand con getSignedUrl() server-side. Este es el shape que
 * persistimos en Enrollment.paymentProofVariants.
 *
 * @param {Buffer} buffer
 * @param {string} folder - subcarpeta dentro del bucket (puede ser '' para raíz)
 * @returns {Promise<{ base: string, width: number, height: number, sizes: Record<string,string>, paths: string[] }>}
 */
export async function processAndUploadPrivate(buffer, folder = '') {
  const { metadata, variants } = await buildVariants(buffer);
  const hash = crypto.createHash('sha1').update(buffer).digest('hex').slice(0, 12);
  const baseName = buildBaseName(folder, hash);

  const sizes = {};
  const paths = [];

  for (const { width, buffer: resized } of variants) {
    const path = `${baseName}-${width}.webp`;
    await uploadPrivate(path, resized, 'image/webp');
    sizes[String(width)] = path; // ← path, no URL
    paths.push(path);
  }

  const availableWidths = Object.keys(sizes).map(Number).sort((a, b) => b - a);
  return {
    base: sizes[String(availableWidths[0])], // path de la variante más grande
    width: metadata.width,
    height: metadata.height,
    sizes,
    paths,
  };
}
