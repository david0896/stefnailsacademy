import React, { useState, useEffect } from "react";
import styles from "../../styles/CarrucelCharacteristics.module.css"; // Importar el CSS Module
import clsx from "clsx"; // Importar clsx para manejar clases condicionales

const CarrucelCharacteristics = () => {
  const slides = [
    {
      title: "Prepárate para conseguir tu certificado",
      description:
        "Explora el futuro de la TI. Empieza a aprender para obtener las certificaciones de AWS, CompTIA A+ y muchas más.",
      backgroundColor: "bg-yellow-300",
      image: "https://i.postimg.cc/Pq6P5DJB/stef-nails-stef-removebg-preview.png",
    },
    {
      title: "Avanza en tu carrera profesional",
      description:
        "Descubre habilidades en demanda y cómo aplicarlas en el mundo real.",
      backgroundColor: "bg-blue-300",
      image: "https://i.postimg.cc/yNygMNwb/stef-nails-instructora-de-unas-decoradas.png",
    },
    {
      title: "Construye tu futuro con nosotros",
      description:
        "Conéctate con expertos y una comunidad global de estudiantes.",
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
        <div className="w-full lg:w-1/2 p-5 rounded-sm bg-slate-50">
          <h2 className="text-2xl font-bold mb-4">{slides[currentIndex].title}</h2>
          <p className="text-base text-gray-700">
            {slides[currentIndex].description}
          </p>
          <a
            href="#"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 underline"
          >
            Explora el futuro con Stef Nails Academy
          </a>
        </div>
        <div className="w-full lg:w-1/2 h-[45vw] lg:h-auto flex justify-center relative">
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