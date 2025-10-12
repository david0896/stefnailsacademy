import { useMemo } from 'react';

const useCursosProximos = (cursos) => {
  return useMemo(() => {
    if (!Array.isArray(cursos)) return [];

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Convertimos y filtramos cursos válidos
    const cursosConFechas = cursos.map(curso => {
      if (!curso?.fechaSnFormato || !curso?.nombre) return null;

      try {
        const [dia, mes, anio] = curso.fechaSnFormato.split('/').map(Number);
        const fechaCurso = new Date(anio, mes - 1, dia);
        const diferencia = fechaCurso.getTime() - hoy.getTime();

        return {
          ...curso,
          fechaObj: fechaCurso,
          diferencia
        };
      } catch {
        return null;
      }
    }).filter(Boolean);

    // Filtramos solo cursos futuros o de hoy
    const cursosValidos = cursosConFechas.filter(curso => curso.diferencia >= 0);

    if (cursosValidos.length === 0) return [];

    // Ordenar por fecha más próxima
    const cursosOrdenados = [...cursosValidos].sort((a, b) => a.diferencia - b.diferencia);

    const cursoMasProximo = cursosOrdenados[0];
    const siguienteCurso = cursosOrdenados[1]; // puede ser undefined si solo hay uno válido

    // Mapear resultado final
    return cursosValidos.map(curso => ({
      ...curso,
      proximoCurso: curso.id === cursoMasProximo?.id,
      siguienteCurso: curso.id === siguienteCurso?.id
    }));

  }, [cursos]);
};

export default useCursosProximos;