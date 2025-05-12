// hooks/useVisibility.js
import { useState, useEffect } from 'react';

const useVisibility = (ref, threshold = 0.4) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Solo actualiza a true si entra al viewport y aún no está marcado como visible
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Deja de observar después de activar
        }
      },
      { threshold }
    );

    if (ref.current && !isVisible) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, threshold, isVisible]); // Dependencias actualizadas

  return isVisible; // Retorna true permanentemente después de la primera entrada
};

export default useVisibility;