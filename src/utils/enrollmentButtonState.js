/**
 * Dada la lista de inscripciones de un alumno, devuelve un mapa
 * { [courseId]: { label, disabled, variant, enrollmentId } }
 * que indica qué texto y estilo debe tener el botón "Reservar cupo"
 * para CADA curso en el listado público.
 *
 * Reglas de precedencia (cuando el alumno tiene varias inscripciones
 * para el mismo curso, lo cual puede pasar si canceló y reintentó):
 *   1. CONFIRMED  → "Ya estás inscrita" (ganador absoluto, verde)
 *   2. PENDING    → "Pago por verificar" / "Por confirmar" según pago
 *   3. COMPLETED  → "Curso completado"
 *   4. CANCELLED  → se ignora (puede volver a reservar)
 *
 * Si no hay inscripción activa, devuelve `null` → botón normal.
 */

const PRECEDENCE = { CONFIRMED: 3, PENDING: 2, COMPLETED: 1, CANCELLED: 0 };

export function buildEnrollmentMap(inscripciones = []) {
  const map = {};

  for (const insc of inscripciones) {
    const cid = insc.course?.id;
    if (!cid) continue;
    const prev = map[cid];
    const score = PRECEDENCE[insc.status] ?? 0;
    if (!prev || score > prev._score) {
      map[cid] = { ...insc, _score: score };
    }
  }

  // Convertir cada inscripción dominante en un estado de botón
  const result = {};
  for (const [cid, insc] of Object.entries(map)) {
    if (insc.status === 'CANCELLED') continue; // ignorar, permite re-inscribirse

    let label, variant, disabled = true;

    if (insc.status === 'CONFIRMED') {
      label   = 'Ya estás inscrita';
      variant = 'success';
    } else if (insc.status === 'COMPLETED') {
      label   = 'Curso completado';
      variant = 'muted';
    } else if (insc.status === 'PENDING' && insc.paymentStatus === 'PAID') {
      label   = 'Por confirmar';
      variant = 'pending';
    } else if (insc.status === 'PENDING') {
      label   = 'Pago por verificar';
      variant = 'pending';
    } else {
      continue;
    }

    result[cid] = { label, variant, disabled, enrollmentId: insc.id };
  }

  return result;
}

/**
 * Clases de Tailwind por variante.
 */
export const variantClass = {
  success: 'bg-green-100 text-green-800 cursor-default',
  pending: 'bg-yellow-100 text-yellow-800 cursor-default',
  muted:   'bg-gray-200 text-gray-600 cursor-default',
};
