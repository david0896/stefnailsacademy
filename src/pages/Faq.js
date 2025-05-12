import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const faq = () => {

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "¿Qué tipos de cursos ofrecen?",
      answer:
        "Ofrecemos cursos básicos, avanzados y especializados en técnicas como Soft Gel, Acrílicos, Esculpidas y más",
    },
    {
      question: "¿Cuál es el horario de atención de la academia?",
      answer:
        "Estamos abiertos de lunes a viernes de 9:00 a.m. a 8:00 p.m. y sábados de 9:00 a.m. a 8 :00 p.m.). domingos no laborables",
    },
    {
      question: "¿Los cursos incluyen certificado?",
      answer:
        "Sí, todos nuestros cursos incluyen certificado por aprobación",
    },
    {
      question: "¿Cuál es la duración de los cursos?",
      answer:
        "Los talleres tienen duración de 9 horas diarias, las certificaciones van desde 180 horas a 270 horas y optimizaciones y perfeccionamiento van desde 27 horas 90 horas  académicas",
    },
    {
      question: "¿Necesito tener experiencia previa para inscribirme?",
      answer:
        "Dependiendo del nivel a participar, pero para básico no hace falta tener experiencia previa",
    },
    {
      question: "¿Qué materiales o herramientas necesito para los cursos?",
      answer:
        "Cada curso tiene su lista de materiales",
    },
    {
      question: "¿Ofrecen cursos en línea o solo presenciales?",
      answer:
        "Actualmente ofrecemos cursos presenciales, pero estamos trabajando en una modalidad en línea",
    },
    {
      question: "¿Puedo pagar en cuotas?",
      answer:
        "Sí, ofrecemos opciones de pago en cuotas sin intereses",
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer:
        "zelle, paypal, pago móvil, transferencias bancarias y efectivo",
    },
    {
      question: "¿Ofrecen promociones?",
      answer:
        "Si tenemos promociones especiales en fechas específicas, que solo se anuncian en redes sociales",
    },
    {
      question: "¿Puedo probar una clase antes de inscribirme?",
      answer:
        "No",
    },
    {
      question: "¿Qué productos venden en la academia?",
      answer:
        "Todos los implementos necesarios para el mundo nails",
    },
    {
      question: "¿Los productos están disponibles para compra en línea?",
      answer:
        "Sí, puedes comprar nuestros productos a través de nuestra tienda en línea (Se habilitar proximamente)",
    },
    {
      question: "¿Qué productos venden en la academia?",
      answer:
        "Todos los implementos necesarios para el mundo nails",
    },    
    {
      question: "¿Cómo puedo contactarlos para más información?",
      answer:
        "Puedes contactarnos a través de nuestro formulario en línea, por WhatsApp o visitarnos en nuestras instalaciones",
    },
  ];

  return (
    <>
      <div className="relative w-full h-[30vw] bg-[#fdebeb]">
        <div className="min-h-screen w-9/12 mx-auto absolute inset-0 flex items-center justify-center p-4 mt-[27rem]">
          <div className="w-full bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-center mb-8">
              Preguntas Frecuentes
            </h1>
            {faqData.map((item, index) => (
              <div key={index} className="mb-4">
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex justify-between items-center p-4 bg-gray-200 rounded-lg focus:outline-none"
                >
                  <span className="font-medium">{item.question}</span>
                  <svg
                    className={`w-6 h-6 transition-transform transform ${
                      activeIndex === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {activeIndex === index && (
                  <div className="p-4 bg-gray-50 rounded-b-lg mt-2">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>                                 
      </div>
      <div className=" bg-white h-[20vw] p-[34rem]">
      </div>
    </>
  )
}

export default faq