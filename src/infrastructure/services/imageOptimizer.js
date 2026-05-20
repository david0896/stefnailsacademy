import sharp from 'sharp';
import crypto from 'crypto';
import { uploadImage } from './supabaseStorage';

// Anchos de las variantes responsive que generamos por cada imagen
export const VARIANT_WIDTHS = [400, 800, 1200, 1600];

// Calidad WebP (0-100). 80 es el balance estándar calidad/peso.
const WEBP_QUALITY = 80;

/**
 * Procesa un buffer de imagen: genera variantes WebP en varios anchos
 * y las sube al storage. Devuelve el objeto imageVariants para guardar en DB.
 *
 * @param {Buffer} buffer - imagen original (jpg/png/webp)
 * @param {string} folder - carpeta destino dentro del bucket (ej: "cursos")
 * @returns {Promise<{ base: string, width: number, height: number, sizes: Record<string,string>, paths: string[] }>}
 */
export async function processAndUpload(buffer, folder = 'general') {
  // Validar que sea una imagen procesable y obtener metadata
  const image = sharp(buffer, { failOn: 'error' });
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error('El archivo no es una imagen válida');
  }

  // Hash corto del contenido para nombres únicos (evita colisiones + cache busting)
  const hash = crypto.createHash('sha1').update(buffer).digest('hex').slice(0, 12);
  const baseName = `${folder}/${Date.now()}-${hash}`;

  const sizes = {};
  const paths = [];

  // Generar y subir cada variante. No agrandamos imágenes más allá de su
  // tamaño original (si la original es < 800px, no generamos 1200/1600).
  for (const width of VARIANT_WIDTHS) {
    if (width > metadata.width && width !== VARIANT_WIDTHS[0]) {
      // Saltamos anchos mayores al original, pero siempre garantizamos
      // al menos la variante más chica.
      continue;
    }

    const resized = await sharp(buffer)
      .rotate() // respeta orientación EXIF
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    const path = `${baseName}-${width}.webp`;
    const url = await uploadImage(path, resized, 'image/webp');
    sizes[String(width)] = url;
    paths.push(path);
  }

  // base = la variante más grande disponible (fallback para src)
  const availableWidths = Object.keys(sizes).map(Number).sort((a, b) => b - a);
  const base = sizes[String(availableWidths[0])];

  return {
    base,
    width: metadata.width,
    height: metadata.height,
    sizes,
    paths, // útil si después queremos borrar todas las variantes
  };
}
