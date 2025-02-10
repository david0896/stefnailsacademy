import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const PreguntasFrecuentes = () => {

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "¿Cómo me inscribo en un curso?",
      answer:
        "Puedes inscribirte directamente en nuestra página web seleccionando el curso de tu interés y completando el formulario de inscripción.",
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer:
        "Aceptamos tarjetas de crédito, débito y transferencias bancarias. También ofrecemos opciones de pago en efectivo en nuestras instalaciones.",
    },
    {
      question: "¿Puedo cancelar mi inscripción?",
      answer:
        "Sí, puedes cancelar tu inscripción hasta 7 días antes del inicio del curso. Contacta a nuestro equipo para más detalles.",
    },
    {
      question: "¿Ofrecen certificados al finalizar el curso?",
      answer:
        "Sí, al completar satisfactoriamente el curso, recibirás un certificado avalado por nuestra institución.",
    },
    {
      question: "¿Qué necesito para comenzar el curso?",
      answer:
        "Solo necesitas ganas de aprender. Te proporcionaremos los materiales y herramientas necesarios durante el curso.",
    },
  ];

  return (
    <>
      <div className="relative w-full h-[30vw] bg-[#fdebeb]">
        <div className="min-h-screen w-9/12 mx-auto absolute inset-0 flex items-center justify-center p-4 mt-12">
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
      <div className=" bg-white h-[20vw] p-5">
      </div>
    </>
  )
}

export default PreguntasFrecuentes