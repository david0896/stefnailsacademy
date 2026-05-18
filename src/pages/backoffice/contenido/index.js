import { useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { clsx } from 'clsx';
import BOLayout from '@/components/backoffice/BOLayout';

const typeStyle = {
  TEXT:  'bg-blue-50 text-blue-600',
  IMAGE: 'bg-purple-50 text-purple-600',
  JSON:  'bg-orange-50 text-orange-600',
};

const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent';

// ─── Fila de contenido con edición inline ─────────────────────────────────
function ContentRow({ item, onSaved }) {
  const [editing, setEditing]   = useState(false);
  const [value, setValue]       = useState(item.value);
  const [isLoading, setLoading] = useState(false);
  const [error, setError]       = useState('');

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/backoffice/contenido/${encodeURIComponent(item.key)}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ value, type: item.type }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al guardar');
        return;
      }
      setEditing(false);
      onSaved();
    } catch {
      setError('Error de conexión');
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
    if (!key.trim()) { setError('La clave es requerida'); return; }
    if (!value.trim()) { setError('El valor es requerido'); return; }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/backoffice/contenido/${encodeURIComponent(key.trim())}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ value, type }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al guardar');
        return;
      }
      setKey(''); setValue(''); setType('TEXT');
      setOpen(false);
      onSaved();
    } catch {
      setError('Error de conexión');
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
  const router = useRouter();
  const [content, setContent] = useState(initialContent);

  const refresh = async () => {
    const res  = await fetch('/api/backoffice/contenido');
    const data = await res.json();
    setContent(data);
  };

  return (
    <BOLayout>
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Contenido</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Bloques de texto e imágenes editables del sitio público
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl mb-4 overflow-hidden">
          {content.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-gray-400">No hay bloques de contenido aún.</p>
            </div>
          ) : (
            content.map((item) => (
              <ContentRow key={item.key} item={item} onSaved={refresh} />
            ))
          )}
        </div>

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
