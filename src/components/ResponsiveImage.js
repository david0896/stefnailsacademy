import { useState } from 'react';

/**
 * Imagen responsive sin next/image.
 *
 * Modo híbrido:
 *  - Si recibe `variants` (objeto { base, sizes: {400,800,...} }) →
 *    genera srcset + sizes y sirve WebP por viewport.
 *  - Si solo recibe `src` (URL externa, ej. postimg.cc) → la muestra tal cual.
 *
 * @param {object}  props
 * @param {object?} props.variants - { base, width, height, sizes }
 * @param {string?} props.src      - URL fallback (imagen externa o legacy)
 * @param {string}  props.alt
 * @param {string}  props.className
 * @param {string}  props.sizes    - atributo sizes (default: 100vw)
 * @param {boolean} props.priority - si true, carga eager (sin lazy)
 */
export default function ResponsiveImage({
  variants = null,
  src = '',
  alt = '',
  className = '',
  sizes = '100vw',
  priority = false,
  ...rest
}) {
  const [loaded, setLoaded] = useState(false);

  const hasVariants =
    variants &&
    variants.sizes &&
    Object.keys(variants.sizes).length > 0;

  // Construir srcset a partir de las variantes: "url 400w, url 800w, ..."
  let srcSet;
  let mainSrc = src;

  if (hasVariants) {
    const entries = Object.entries(variants.sizes)
      .map(([w, url]) => [Number(w), url])
      .sort((a, b) => a[0] - b[0]);

    srcSet = entries.map(([w, url]) => `${url} ${w}w`).join(', ');
    // src principal = la variante más grande (mejor fallback)
    mainSrc = variants.base || entries[entries.length - 1][1];
  }

  if (!mainSrc) {
    // Sin imagen: placeholder gris
    return <div className={`bg-gray-100 ${className}`} aria-hidden />;
  }

  return (
    <img
      src={mainSrc}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      draggable={false}
      {...rest}
    />
  );
}
