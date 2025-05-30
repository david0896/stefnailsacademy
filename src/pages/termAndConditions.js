import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const termAndConditions = () => {

  return (
    <>
      <div className="relative w-full h-[30vw] bg-[#fdebeb]">
        <div className="min-h-screen w-9/12 mx-auto absolute inset-0 flex items-center justify-center p-4 mt-[27rem]">
          <div className="w-full bg-white rounded-lg shadow-lg p-6">
            <section className="max-w-3xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Términos y condiciones
                </h1>

                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800 mt-6">1. Inscripciones y Pagos</h3>
                    <p className="text-gray-600 leading-relaxed">
                    La reserva de plaza se formaliza con el pago completo del curso. Los precios incluyen materiales básicos de práctica. No incluyen kits de herramientas profesionales que deberán ser adquiridos por separado.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-800 mt-6">2. Política de Cancelación</h3>
                    <p className="text-gray-600 leading-relaxed">
                    Las cancelaciones con más de 15 días de anticipación recibirán reembolso del 80%. Cancelaciones entre 7-15 días previos al curso: 50% de reembolso. Cancelaciones con menos de 7 días no son reembolsables.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-800 mt-6">3. Certificación</h3>
                    <p className="text-gray-600 leading-relaxed">
                    La certificación final requiere 90% de asistencia y aprobación del examen práctico. Los certificados tienen validez internacional y llevarán el sello de la Academia.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-800 mt-6">4. Propiedad Intelectual</h3>
                    <p className="text-gray-600 leading-relaxed">
                    Todo material didáctico proporcionado es de uso exclusivo del alumno. Queda prohibida su reproducción, distribución o uso comercial sin autorización escrita.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-800 mt-6">5. Responsabilidades</h3>
                    <p className="text-gray-600 leading-relaxed">
                    La academia no se hace responsable por daños derivados del mal uso de productos químicos o herramientas fuera del ámbito educativo. Los alumnos deben seguir los protocolos de seguridad enseñados.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-800 mt-6">6. Duración y Horarios</h3>
                    <p className="text-gray-600 leading-relaxed">
                    Los horarios establecidos son inamovibles. En caso de fuerza mayor, la academia se reserva el derecho de reprogramar hasta el 20% de las horas lectivas manteniendo el contenido completo del curso.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-800 mt-6">7. Garantías</h3>
                    <p className="text-gray-600 leading-relaxed">
                    La academia garantiza la calidad de la formación mediante profesores certificados. No garantiza resultados individuales que dependen de la práctica y dedicación del alumno.
                    </p>
                </div>

                <p className="text-sm text-gray-500 mt-8 text-center">
                    Última actualización: 20 de marzo de 2024
                </p>
                </section>
          </div>
        </div>                                 
      </div>
      <div className=" bg-white h-[20vw] p-[34rem]">
      </div>
    </>
  )
}

export default termAndConditions