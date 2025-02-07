import React, { useState, useEffect } from "react";


const CarrucelCharacteristics = () => {
    const slides = [
        {
          title: "Prepárate para conseguir tu certificado",
          description: "Explora el futuro de la TI. Empieza a aprender para obtener las certificaciones de AWS, CompTIA A+ y muchas más.",
          backgroundColor: "bg-yellow-300",
          image: "https://i.postimg.cc/Pq6P5DJB/stef-nails-stef-removebg-preview.png",
        },
        {
          title: "Avanza en tu carrera profesional",
          description: "Descubre habilidades en demanda y cómo aplicarlas en el mundo real.",
          backgroundColor: "bg-blue-300",
          image: "https://i.postimg.cc/yNygMNwb/stef-nails-instructora-de-unas-decoradas.png",
        },
        {
          title: "Construye tu futuro con nosotros",
          description: "Conéctate con expertos y una comunidad global de estudiantes.",
          backgroundColor: "bg-green-300",
          image: "https://i.postimg.cc/wjSZCqhL/stef-nails-instructora-de-unas-decoradas-profesionales-removebg-preview.png",
        },
      ];

      const [currentIndex, setCurrentIndex] = useState(0);

      const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
      };
    
      const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
      };
    
      useEffect(() => {
        const interval = setInterval(() => {
          handleNext();
        }, 5000); // Cambia de slide cada 5 segundos
    
        return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
      }, []);

  return (
    <div className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-lg shadow-lg mt-32">
      {/* Slide */}
      <div
        className={`flex items-center justify-between p-8 ${slides[currentIndex].backgroundColor}`}
      >
        <div className="w-1/2 p-5 rounded-sm bg-slate-50">
          <h2 className="text-2xl font-bold mb-4">{slides[currentIndex].title}</h2>
          <p className="text-base text-gray-700">{slides[currentIndex].description}</p>
          <a
            href="#"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 underline"
          >
            Explora el futuro con Stef Nails Academy
          </a>
        </div>
        <div className="w-1/2 flex justify-center relative">
          <img
            src={slides[currentIndex].image}
            alt="Ilustración de certificación"
            className="max-h-80 absolute -top-28 -right-10"
          />
        </div>
      </div>

      {/* Botones de navegación */}
      {/* <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
      >
        ◀
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
      >
        ▶
      </button> */}
    </div>
  );
};

export default CarrucelCharacteristics;
