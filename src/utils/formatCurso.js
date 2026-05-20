/**
 * Transforma un Course de Prisma + tasa EUR al shape que consumen
 * los hooks useCursos / useCursosProximos del sitio público.
 *
 * @param {object} curso  — registro Course de Prisma
 * @param {number} tasaEur — tasa BCV EUR/Bs del día
 * @returns {object}
 */
export function formatCurso(curso, tasaEur) {
  const precioBs = Number((curso.priceEUR * tasaEur).toFixed(2));

  const formatoPrecio = {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  };

  let fecha = '';
  let fechaSnFormato = '';
  if (curso.date) {
    const d = new Date(curso.date);
    const dia  = String(d.getUTCDate()).padStart(2, '0');
    const mes  = String(d.getUTCMonth() + 1).padStart(2, '0');
    const anio = d.getUTCFullYear();
    fechaSnFormato = `${dia}/${mes}/${anio}`;
    fecha = new Intl.DateTimeFormat('es-ES', {
      day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
    }).format(d);
  }

  return {
    id:              curso.id,
    nombre:          curso.title,
    descripcion:     curso.description,
    fecha,
    fechaSnFormato,
    modo:            curso.type,
    sede:            curso.sede ?? '',
    nivel:           curso.nivel ?? '',
    horas_academicas: curso.horasAcademicas ?? 0,
    clases: {
      cantidad:    curso.diasDeClases ?? 0,
      instructor:  curso.instructor  ?? '',
    },
    precio:    precioBs.toLocaleString('es-ES', formatoPrecio),
    priceEUR:  curso.priceEUR,
    imagen:    curso.imageUrl  ?? '',
    imagenVariants: curso.imageVariants ?? null, // { base, width, height, sizes }
    estatus:   curso.status,
    maxSpots:  curso.maxSpots  ?? null,
  };
}
