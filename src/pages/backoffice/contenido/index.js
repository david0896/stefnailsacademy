import { useState } from 'react';
import { getSession } from 'next-auth/react';
import { clsx } from 'clsx';
import BOLayout from '@/components/backoffice/BOLayout';
import ImageUpload from '@/components/backoffice/ImageUpload';

const typeStyle = {
  TEXT:  'bg-blue-50 text-blue-600',
  IMAGE: 'bg-purple-50 text-purple-600',
  JSON:  'bg-orange-50 text-orange-600',
};

const inputClass =
  'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent';

const SLIDE_LABELS = {
  'hero.slide.1': 'Slide 1 — Principal',
  'hero.slide.2': 'Slide 2 — Secundario',
  'hero.slide.3': 'Slide 3 — Tienda / Promo',
};

// ─── Guarda un bloque de contenido vía API ────────────────────────────────
async function saveContent(key, value, type) {
  const res = await fetch(`/api/backoffice/contenido/${encodeURIComponent(key)}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ value, type }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al guardar');
  return data;
}

// ─── Editor visual para slides del Hero ───────────────────────────────────
function HeroSlideEditor({ item, label, onSaved }) {
  const parsed     = (() => { try { return JSON.parse(item.value); } catch { return {}; } })();
  const [fields, setFields] = useState({
    titulo:        parsed.titulo       ?? '',
    subtitulo:     parsed.subtitulo    ?? '',
    descripcion:   parsed.descripcion  ?? '',
    imagenUrl:     parsed.imagenUrl    ?? '',
    imagenBajaCal: parsed.imagenBajaCal ?? '',
    imagenVariants: parsed.imagenVariants ?? null,
    ctaTexto:      parsed.ctaTexto     ?? '',
    ctaUrl:        parsed.ctaUrl       ?? '',
    activo:        parsed.activo       ?? true,
  });

  // Maneja el cambio desde ImageUpload: si subió imagen optimizada,
  // mapea la variante grande a imagenUrl y la chica (400w) a imagenBajaCal
  // (que el Hero usa para el efecto blur). Si usó URL externa, ambas iguales.
  const handleImageChange = ({ imageUrl, imageVariants }) => {
    if (imageVariants) {
      const small = imageVariants.sizes['400'] || imageVariants.base;
      setFields((prev) => ({
        ...prev,
        imagenUrl:      imageVariants.base,
        imagenBajaCal:  small,
        imagenVariants: imageVariants,
      }));
    } else {
      setFields((prev) => ({
        ...prev,
        imagenUrl:      imageUrl,
        imagenBajaCal:  imageUrl,
        imagenVariants: null,
      }));
    }
  };
  const [isLoading, setLoading] = useState(false);
  const [error,     setError]   = useState('');
  const [saved,     setSaved]   = useState(false);

  const set = (k) => (e) =>
    setFields((prev) => ({ ...prev, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSaved(false);
    try {
      const json = JSON.stringify({ ...parsed, ...fields });
      await saveContent(item.key, json, 'JSON');
      setSaved(true);
      onSaved();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const field = (name, lbl, placeholder = '', type = 'text') => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{lbl}</label>
      {type === 'textarea' ? (
        <textarea
          value={fields[name]}
          onChange={set(name)}
          rows={3}
          placeholder={placeholder}
          className={inputClass}
        />
      ) : (
        <input
          type={type}
          value={fields[name]}
          onChange={set(name)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </div>
  );

  return (
    <div className="border border-gray-100 rounded-xl bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-800">{label}</span>
          <code className="text-xs font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
            {item.key}
          </code>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-xs text-gray-500">Activo</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={fields.activo}
              onChange={set('activo')}
              className="sr-only peer"
            />
            <div className="w-9 h-5 rounded-full bg-gray-200 peer-checked:bg-gray-900 transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
          </div>
        </label>
      </div>

      {/* Image preview */}
      {fields.imagenUrl && (
        <div className="relative h-28 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fields.imagenUrl}
            alt="preview"
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <p className="text-sm font-semibold drop-shadow">{fields.titulo || '—'}</p>
              <p className="text-xs opacity-80 drop-shadow">{fields.subtitulo || ''}</p>
            </div>
          </div>
        </div>
      )}

      {/* Fields */}
      <div className="px-5 py-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {field('titulo',    'Título principal', 'Ej: Academia de uñas profesionales')}
          {field('subtitulo', 'Subtítulo',        'Ej: Aprende desde donde estés')}
        </div>
        {field('descripcion', 'Descripción', 'Texto del slide...', 'textarea')}
        <div className="grid grid-cols-2 gap-3">
          {field('ctaTexto', 'Texto del botón CTA', 'Ej: Ver cursos')}
          {field('ctaUrl',   'URL del botón CTA',   'Ej: /Courses o https://wa.link/...')}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Imagen de fondo del slide</label>
          <ImageUpload
            imageUrl={fields.imagenVariants ? '' : fields.imagenUrl}
            imageVariants={fields.imagenVariants}
            folder="contenido"
            onChange={handleImageChange}
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Al subir, se genera automáticamente la versión de baja calidad para el efecto blur.
          </p>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gray-900 text-white text-xs px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Guardando...' : 'Guardar slide'}
          </button>
          {saved && (
            <span className="text-xs text-green-600 font-medium">✓ Guardado</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Fila genérica para contenido no-slide ────────────────────────────────
function ContentRow({ item, onSaved }) {
  const [editing, setEditing]   = useState(false);
  const [value, setValue]       = useState(item.value);
  const [isLoading, setLoading] = useState(false);
  const [error, setError]       = useState('');

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      await saveContent(item.key, value, item.type);
      setEditing(false);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setValue(item.value);
    setError('');
    setEditing(false);
  };

  return (
    <div className="border-b border-gray-50 last:border-0 px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <code className="text-xs font-mono text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
              {item.key}
            </code>
            <span className={clsx('text-xs font-medium px-1.5 py-0.5 rounded', typeStyle[item.type])}>
              {item.type}
            </span>
          </div>

          {editing ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={item.type === 'JSON' ? 6 : 3}
                className={clsx(inputClass, 'font-mono text-xs')}
                autoFocus
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  onClick={handleCancel}
                  className="text-gray-500 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-1 truncate">
              {item.value || <span className="italic text-gray-300">Sin valor</span>}
            </p>
          )}
        </div>

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors shrink-0 mt-1"
          >
            Editar
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Formulario para agregar nuevo bloque ─────────────────────────────────
function NewContentForm({ onSaved }) {
  const [open, setOpen]         = useState(false);
  const [key, setKey]           = useState('');
  const [type, setType]         = useState('TEXT');
  const [value, setValue]       = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError]       = useState('');

  const handleSave = async () => {
    if (!key.trim())   { setError('La clave es requerida'); return; }
    if (!value.trim()) { setError('El valor es requerido'); return; }
    setLoading(true);
    setError('');
    try {
      await saveContent(key.trim(), value, type);
      setKey(''); setValue(''); setType('TEXT');
      setOpen(false);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full text-sm text-gray-400 hover:text-gray-700 py-3 border border-dashed border-gray-200 rounded-xl hover:border-gray-400 transition-colors"
      >
        + Agregar bloque de contenido
      </button>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5 space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Nuevo bloque</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Clave</label>
          <input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className={inputClass}
            placeholder="ej: hero.titulo"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Tipo</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
            <option value="TEXT">TEXT</option>
            <option value="IMAGE">IMAGE</option>
            <option value="JSON">JSON</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Valor</label>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          className={clsx(inputClass, 'font-mono text-xs')}
          placeholder={type === 'JSON' ? '{"clave": "valor"}' : 'Escribí el contenido...'}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Guardando...' : 'Guardar bloque'}
        </button>
        <button
          onClick={() => { setOpen(false); setError(''); }}
          className="text-gray-500 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ─── Página principal ──────────────────────────────────────────────────────
export default function ContenidoPage({ initialContent }) {
  const [content, setContent] = useState(initialContent);

  const refresh = async () => {
    const res  = await fetch('/api/backoffice/contenido');
    const data = await res.json();
    setContent(data);
  };

  const slideKeys   = Object.keys(SLIDE_LABELS);
  const slides      = content.filter((c) => slideKeys.includes(c.key));
  const otherItems  = content.filter((c) => !slideKeys.includes(c.key));

  return (
    <BOLayout>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Contenido</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Bloques de texto e imágenes editables del sitio público
          </p>
        </div>

        {/* ── Hero Carousel ── */}
        {slides.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Hero Carousel
            </h2>
            <div className="space-y-4">
              {slideKeys.map((key) => {
                const item = slides.find((s) => s.key === key);
                if (!item) return null;
                return (
                  <HeroSlideEditor
                    key={key}
                    item={item}
                    label={SLIDE_LABELS[key]}
                    onSaved={refresh}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* ── Tasas y otros ── */}
        {otherItems.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Otros bloques
            </h2>
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
              {otherItems.map((item) => (
                <ContentRow key={item.key} item={item} onSaved={refresh} />
              ))}
            </div>
          </section>
        )}

        <NewContentForm onSaved={refresh} />
      </div>
    </BOLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: '/backoffice/login', permanent: false } };
  }

  const { getAllContent } = await import('@/application/content/getContent');
  const content = await getAllContent();

  return {
    props: { initialContent: JSON.parse(JSON.stringify(content)) },
  };
}
