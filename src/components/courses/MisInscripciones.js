import { useState } from 'react';

/**
 * Combina enrollment status + paymentStatus en UN solo badge legible
 * para el alumno. Devuelve { text, className }.
 *
 * Reglas de precedencia:
 *  1. CANCELLED     → Cancelada (rojo)
 *  2. COMPLETED     → Completada (azul)
 *  3. REFUNDED      → Reembolsado (gris)
 *  4. CONFIRMED + PAID    → Confirmada (verde)
 *  5. CONFIRMED + PENDING → Confirmada, pago por verificar (verde/amarillo)
 *  6. PENDING + PAID      → Por confirmar (amarillo)
 *  7. PENDING + PENDING   → Pago por verificar (amarillo)
 */
const getCombinedBadge = (status, paymentStatus) => {
  if (status === 'CANCELLED') {
    return { text: 'Cancelada', className: 'bg-red-100 text-red-700' };
  }
  if (status === 'COMPLETED') {
    return { text: 'Completada', className: 'bg-blue-100 text-blue-800' };
  }
  if (paymentStatus === 'REFUNDED') {
    return { text: 'Reembolsado', className: 'bg-gray-100 text-gray-700' };
  }
  if (status === 'CONFIRMED' && paymentStatus === 'PAID') {
    return { text: 'Confirmada', className: 'bg-green-100 text-green-800' };
  }
  if (status === 'CONFIRMED') {
    return { text: 'Confirmada · pago por verificar', className: 'bg-green-50 text-green-700 border border-green-200' };
  }
  if (status === 'PENDING' && paymentStatus === 'PAID') {
    return { text: 'Por confirmar', className: 'bg-yellow-100 text-yellow-800' };
  }
  // PENDING + PENDING (caso más común)
  return { text: 'Pago por verificar', className: 'bg-yellow-100 text-yellow-800' };
};

const typeLabel = {
  PRESENCIAL: 'Presencial',
  ONLINE:     'Online',
};

const formatFecha = (iso) => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
    }).format(d);
  } catch {
    return '—';
  }
};

export default function MisInscripciones({ inscripciones }) {
  const [expanded, setExpanded] = useState(false);
  const VISIBLES = 3;

  const visibles = expanded ? inscripciones : inscripciones.slice(0, VISIBLES);
  const hayMas   = inscripciones.length > VISIBLES;

  return (
    <section className="mt-10 mb-4">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl xl:text-3xl font-bold text-[#383838]">
          Mis inscripciones
        </h2>
        <span className="text-sm text-gray-500">
          {inscripciones.length}{' '}
          {inscripciones.length === 1 ? 'inscripción' : 'inscripciones'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibles.map((insc) => {
          const badge = getCombinedBadge(insc.status, insc.paymentStatus);

          return (
            <article
              key={insc.id}
              className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-3">
                {insc.course.imageUrl ? (
                  <img
                    src={insc.course.imageUrl}
                    alt={insc.course.title}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#383838] line-clamp-2 leading-tight">
                    {insc.course.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {typeLabel[insc.course.type] ?? insc.course.type}
                    {insc.course.date && ` · ${formatFecha(insc.course.date)}`}
                  </p>
                  {insc.course.sede && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      📍 {insc.course.sede}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${badge.className}`}>
                  {badge.text}
                </span>
              </div>

              <p className="text-xs text-gray-400 mt-3">
                Inscrita el {formatFecha(insc.enrolledAt)}
              </p>
            </article>
          );
        })}
      </div>

      {hayMas && (
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-sm text-[#ff5a5f] hover:underline font-medium"
          >
            {expanded
              ? 'Ver menos'
              : `Ver todas (${inscripciones.length})`}
          </button>
        </div>
      )}

      <hr className="border-t border-gray-200 mt-10" />
    </section>
  );
}
