import { useState, useRef } from 'react';

/**
 * Carga de imágenes para el BO — modo híbrido.
 *
 * Permite:
 *  - Subir un archivo → se optimiza (WebP, 4 tamaños) y devuelve `imageVariants`
 *  - O pegar una URL externa → se guarda en `imageUrl`
 *
 * @param {object}   props
 * @param {string}   props.imageUrl       - URL externa actual
 * @param {object}   props.imageVariants  - variantes actuales { base, sizes }
 * @param {function} props.onChange       - ({ imageUrl, imageVariants }) => void
 * @param {string}   props.folder         - carpeta destino: 'cursos' | 'contenido'
 * @param {boolean}  props.readOnly
 */
export default function ImageUpload({
  imageUrl = '',
  imageVariants = null,
  onChange,
  folder = 'general',
  readOnly = false,
}) {
  // Modo inicial: si ya hay variantes subidas → 'upload', si hay URL → 'url'
  const [mode, setMode] = useState(imageVariants ? 'upload' : 'url');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const previewSrc = imageVariants?.base || imageUrl || '';

  const handleFile = async (file) => {
    setError('');
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setError('Formato no permitido. Usa JPG, PNG o WebP.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('La imagen supera el límite de 4 MB.');
      return;
    }

    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      const res = await fetch('/api/backoffice/upload-imagen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileBase64: base64, contentType: file.type, folder }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al subir la imagen');
        return;
      }
      // Guardamos variantes y limpiamos la URL externa
      onChange?.({ imageUrl: '', imageVariants: {
        base: data.base, width: data.width, height: data.height, sizes: data.sizes,
      }});
    } catch {
      setError('Error de conexión al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (url) => {
    // Al usar URL externa, limpiamos las variantes subidas
    onChange?.({ imageUrl: url, imageVariants: null });
  };

  const handleRemove = () => {
    onChange?.({ imageUrl: '', imageVariants: null });
    if (inputRef.current) inputRef.current.value = '';
  };

  if (readOnly) {
    return previewSrc ? (
      <img src={previewSrc} alt="Imagen del curso" className="w-40 h-28 object-cover rounded-lg border border-gray-100" />
    ) : (
      <p className="text-sm text-gray-400">Sin imagen</p>
    );
  }

  return (
    <div>
      {/* Toggle de modo */}
      <div className="inline-flex rounded-lg border border-gray-200 p-0.5 mb-3 text-xs">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-1.5 rounded-md transition-colors ${mode === 'upload' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Subir imagen
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-3 py-1.5 rounded-md transition-colors ${mode === 'url' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Usar URL
        </button>
      </div>

      {/* Preview actual */}
      {previewSrc && (
        <div className="mb-3 relative inline-block">
          <img src={previewSrc} alt="Vista previa" className="w-40 h-28 object-cover rounded-lg border border-gray-100" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow hover:bg-red-600"
            aria-label="Quitar imagen"
          >
            ×
          </button>
          {imageVariants && (
            <span className="absolute bottom-1 left-1 bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded">
              optimizada
            </span>
          )}
        </div>
      )}

      {/* Modo subir */}
      {mode === 'upload' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {uploading ? (
            <p className="text-sm text-gray-500">Optimizando y subiendo...</p>
          ) : (
            <>
              <p className="text-sm text-gray-600">Arrastra una imagen o haz click para elegir</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG o WebP · máx 4 MB · se convierte a WebP en 4 tamaños</p>
            </>
          )}
        </div>
      )}

      {/* Modo URL */}
      {mode === 'url' && (
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
