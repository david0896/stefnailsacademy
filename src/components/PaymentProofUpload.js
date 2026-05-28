import { useState, useRef } from 'react';

/**
 * PaymentProofUpload — subida del comprobante de pago para alumnos.
 *
 * Versión liviana de ImageUpload (BO):
 *  - Solo subir archivo (sin opción de URL externa)
 *  - Llama al endpoint privado /api/student/upload-comprobante
 *  - Guarda PATHS, no URLs (el bucket destino es privado)
 *  - Preview a partir de un blob local (la imagen ya no es pública)
 *
 * @param {object}   props
 * @param {object}   props.value      - paymentProofVariants actual ({ base, sizes, width, height } | null)
 * @param {function} props.onChange   - (variants | null) => void
 * @param {boolean}  props.required   - si es true muestra asterisco visual
 */
export default function PaymentProofUpload({ value = null, onChange, required = false }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState('');
  const [dragOver, setDragOver]   = useState(false);
  // Preview local: data URL del archivo elegido (no podemos servir el bucket privado al cliente)
  const [localPreview, setLocalPreview] = useState('');
  const inputRef = useRef(null);

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
      // Mostramos preview local mientras sube (y queda visible después,
      // porque el bucket privado no expone la imagen al cliente)
      setLocalPreview(base64);

      const res = await fetch('/api/student/upload-comprobante', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ fileBase64: base64, contentType: file.type }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al subir el comprobante');
        setLocalPreview('');
        return;
      }
      onChange?.({
        base:   data.base,
        width:  data.width,
        height: data.height,
        sizes:  data.sizes,
      });
    } catch {
      setError('Error de conexión al subir el comprobante');
      setLocalPreview('');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange?.(null);
    setLocalPreview('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const hasFile = Boolean(value);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Comprobante de pago {required && <span className="text-[#ff5a5f]">*</span>}
      </label>

      {/* Preview cuando ya hay archivo subido */}
      {hasFile && localPreview && (
        <div className="mb-3 relative inline-block">
          <img
            src={localPreview}
            alt="Comprobante de pago"
            className="w-40 h-40 object-cover rounded-md border border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow hover:bg-red-600"
            aria-label="Quitar comprobante"
          >
            ×
          </button>
          <span className="absolute bottom-1 left-1 bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded">
            optimizada
          </span>
        </div>
      )}

      {/* Estado "adjunto" sin preview local (cuando el form se rehidrata con un valor previo) */}
      {hasFile && !localPreview && (
        <div className="mb-3 flex items-center justify-between gap-3 bg-green-50 border border-green-200 rounded-md px-3 py-2 max-w-xs">
          <span className="text-sm text-green-700">✓ Comprobante adjunto</span>
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 text-xs underline"
          >
            Quitar
          </button>
        </div>
      )}

      {/* Drop zone (oculta cuando ya hay archivo) */}
      {!hasFile && (
        <div
          onDragOver={(e) => { if (!uploading) { e.preventDefault(); setDragOver(true); } }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            if (uploading) return;
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => { if (!uploading) inputRef.current?.click(); }}
          aria-busy={uploading}
          className={`border-2 border-dashed rounded-md p-5 text-center transition-colors ${
            uploading
              ? 'border-[#ff5a5f]/60 bg-[#ff5a5f]/5 cursor-wait'
              : dragOver
                ? 'border-[#ff5a5f] bg-[#ff5a5f]/5 cursor-pointer'
                : 'border-gray-300 hover:border-[#ff5a5f]/50 cursor-pointer'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-1">
              {/* Spinner: anillo rosado con segmento blanco que gira */}
              <span
                role="status"
                aria-label="Subiendo comprobante"
                className="inline-block w-8 h-8 rounded-full border-[3px] border-[#ff5a5f]/30 border-t-[#ff5a5f] animate-spin"
              />
              <p className="text-sm text-gray-700">Optimizando y subiendo...</p>
              <p className="text-xs text-gray-400">Convirtiendo a WebP en 4 tamaños</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600">Arrastra la foto del pago o haz click para elegirla</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG o WebP · máx 4 MB</p>
            </>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
