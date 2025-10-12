import React, { useState, useEffect } from "react";
import styles from "../../styles/CarrucelCharacteristics.module.css"; // Importar el CSS Module
import clsx from "clsx"; // Importar clsx para manejar clases condicionales

const CarrucelCharacteristics = () => {
  const slides = [
    {
      title: "Certificación Profesional en Uñas",
      description:
        "Domina técnicas premium (gel, acrílico, nail art) con cursos prácticos avalados por Expertos y Marca la Diferencia",
      backgroundColor: "bg-yellow-300",
      image: "https://i.postimg.cc/Pq6P5DJB/stef-nails-stef-removebg-preview.png",
    },
    {
      title: "Cursos de Uñas con Certificado",
      description:
        "Aprende las últimas tendencias del sector, usa materiales profesionales y certifica tus habilidades para destacar en salones o emprender tu negocio",
      backgroundColor: "bg-blue-300",
      image: "https://i.postimg.cc/yNygMNwb/stef-nails-instructora-de-unas-decoradas.png",
    },
    {
      title: "Técnicas Exclusivas y Herramientas de Alta Gama",
      description:
        "Capacítate con métodos innovadores, accede a productos premium. ¡Transforma tu creatividad en ingresos!",
      backgroundColor: "bg-green-300",
      image: "https://i.postimg.cc/wjSZCqhL/stef-nails-instructora-de-unas-decoradas-profesionales-removebg-preview.png",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextIndex, setNextIndex] = useState(1);

  const handlePrev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? slides.length - 1 : prevIndex - 1
      );
    }
  };

  const handleNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true); // Iniciar transición
      setNextIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000); // Cambia de slide cada 5 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, []);

  // Manejar el fin de la transición
  useEffect(() => {
    if (isTransitioning) {
      const timeout = setTimeout(() => {
        setCurrentIndex(nextIndex); // Cambiar el slide después de la animación de salida
        setIsTransitioning(false); // Finalizar la transición
      }, 500); // Duración de la animación de salida (debe coincidir con el CSS)
  
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning, nextIndex]);

  return (
    <div className={clsx("relative w-full max-w-7xl mx-auto overflow-hidden rounded-lg shadow-lg mt-32", 
      styles.slide,
      isTransitioning ? styles.slideEnter : styles.slideExit 
    )}>
      {/* Slide */}
      <div
        className={clsx(
          `lg:flex items-center justify-between p-8 ${slides[currentIndex].backgroundColor}`,
          styles.slide,
          isTransitioning ? styles.slideEnter : styles.slideExit // Aplicar animación
        )}
      >
        <div className="w-full lg:w-1/2 p-5 rounded-md bg-slate-50">
          <h2 className="text-2xl font-bold mb-4">{slides[currentIndex].title}</h2>
          <p className="text-base text-gray-700">
            {slides[currentIndex].description}
          </p>          
        </div>
        <div className="w-full lg:w-1/2 h-[45vw] md:h-auto flex justify-center relative">
          <img
            src={slides[currentIndex].image}
            alt="Ilustración de certificación"
            className="max-h-80 absolute -top-0 lg:-top-28 -right-10"
          />
        </div>
      </div>
    </div>
  );
};

export default CarrucelCharacteristics;