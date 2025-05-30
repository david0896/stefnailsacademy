import { useMemo } from 'react';

const useProximaFecha = (cursos) => {
  return useMemo(() => {
    if (!Array.isArray(cursos)) return [];
    
    // Convertir fechas y calcular diferencias
    const cursosConFechas = cursos.map(curso => {
      if (!curso?.fechaSnFormato || !curso?.nombre) return null;
      
      try {
        const [dia, mes, anio] = curso.fechaSnFormato.split('/').map(Number);
        const fechaCurso = new Date(anio, mes - 1, dia);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        const diferencia = fechaCurso.getTime() - hoy.getTime();
        
        return {
          ...curso,
          fechaObj: fechaCurso,
          diferencia: diferencia >= 0 ? diferencia : Infinity
        };
      } catch {
        return null;
      }
    }).filter(Boolean);

    // Encontrar la fecha más próxima
    const cursoMasProximo = cursosConFechas.reduce((proximo, actual) => {
      return actual.diferencia < proximo.diferencia ? actual : proximo;
    }, { diferencia: Infinity });

    // Mapear resultado final
    return cursosConFechas.map(curso => ({
      fecha: curso.fechaSnFormato,
      nombre: curso.nombre,
      proximoCurso: curso.id === cursoMasProximo.id
    }));

  }, [cursos]);
};

export default useProximaFecha;