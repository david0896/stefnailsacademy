import { useState, useEffect } from 'react';

const useCursos = (initialData) => {
  const [data, setData] = useState(initialData);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  const revalidate = async () => {
    try {
      const res = await fetch(`${process.env.BASE_URL}/api/sheets/infoCursos`);
      const newData = await res.json();
      setData(newData);
      setLastUpdated(Date.now());
    } catch (error) {
      console.error('Error al revalidar:', error);
    }
  };

  // 1. Revalida cada 1 hora (opcional)
  useEffect(() => {
    const interval = setInterval(revalidate, 3600000);
    return () => clearInterval(interval);
  }, []);

  // 2. Devuelve función para revalidación manual
  return { 
    data,
    lastUpdated,
    revalidate 
  };
};

export default useCursos;