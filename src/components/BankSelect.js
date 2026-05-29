import { useState, useEffect, useMemo, useRef } from 'react';

/**
 * BankSelect — combobox con buscador para bancos venezolanos.
 *
 * - Carga los bancos de /api/generics/BANK_VE (24 items aprox).
 * - Cachea la respuesta en una cookie por 30 días para evitar refetch
 *   en cada inscripción del mismo alumno.
 * - Cada opción se muestra como "0102 - Banco de Venezuela" (código SUDEBAN
 *   + nombre legible).
 * - El valor emitido vía onChange tiene el mismo formato "CODE - LABEL",
 *   que se persiste tal cual en Enrollment.bankName.
 * - Soporta búsqueda por código o por nombre, navegación con flechas y Enter.
 *
 * @param {object}   props
 * @param {string}   props.value     - "0102 - Banco de Venezuela" o ''
 * @param {function} props.onChange  - (str) => void
 * @param {string}   [props.error]   - mensaje de error para bordes rojos
 */
const COOKIE_KEY = 'bankList_ve_v1';
const COOKIE_DAYS = 30;

function readCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name, value, days) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 86400_000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export default function BankSelect({ value = '', onChange, error }) {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(false);
  const [fetchError, setFetchErr] = useState('');
  const [open, setOpen]           = useState(false);
  const [query, setQuery]         = useState('');
  const [highlight, setHighlight] = useState(0);
  const wrapperRef = useRef(null);
  const searchRef  = useRef(null);

  // 1. Hidratar desde cookie o fetch
  useEffect(() => {
    const cached = readCookie(COOKIE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed?.items) && parsed.items.length > 0) {
          setItems(parsed.items);
          return; // hit del cache, no fetch
        }
      } catch {
        // cookie corrupta, ignorar y refetch
      }
    }
    setLoading(true);
    fetch('/api/generics/BANK_VE')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((data) => {
        const arr = Array.isArray(data?.items) ? data.items : [];
        setItems(arr);
        if (arr.length) writeCookie(COOKIE_KEY, JSON.stringify({ items: arr }), COOKIE_DAYS);
      })
      .catch(() => setFetchErr('No se pudo cargar la lista de bancos'))
      .finally(() => setLoading(false));
  }, []);

  // 2. Cerrar al click fuera
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // 3. Auto-focus en buscador al abrir
  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  // 4. Reset de highlight al cambiar query u open
  useEffect(() => { setHighlight(0); }, [query, open]);

  // 5. Filtro por código O nombre (case-insensitive)
  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase().trim();
    return items.filter(
      (it) => it.code.toLowerCase().includes(q) || it.label.toLowerCase().includes(q),
    );
  }, [items, query]);

  const handleSelect = (item) => {
    onChange?.(`${item.code} - ${item.label}`);
    setOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[highlight]) handleSelect(filtered[highlight]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full p-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md text-left focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] flex items-center justify-between bg-white`}
      >
        <span className={value ? 'text-gray-900 truncate' : 'text-gray-400'}>
          {value || (loading ? 'Cargando bancos...' : 'Selecciona tu banco')}
        </span>
        <span className="text-gray-400 ml-2 flex-shrink-0">▾</span>
      </button>

      {fetchError && <p className="text-xs text-red-500 mt-1">{fetchError}</p>}

      {open && (
        <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-72 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-gray-100">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar por código o nombre..."
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]"
            />
          </div>
          <ul className="overflow-y-auto flex-1" role="listbox">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-400">No se encontraron bancos</li>
            ) : (
              filtered.map((item, i) => (
                <li
                  key={item.code}
                  role="option"
                  aria-selected={i === highlight}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => handleSelect(item)}
                  className={`px-3 py-2 text-sm cursor-pointer flex items-center gap-2 ${
                    i === highlight ? 'bg-[#ff5a5f]/10 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-mono text-xs text-gray-500 w-10 flex-shrink-0">{item.code}</span>
                  <span className="text-gray-400">-</span>
                  <span className="truncate">{item.label}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
