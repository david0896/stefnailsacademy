import React from 'react'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import FormContact from '@/components/ContactUs/FormContact';

const ContactUs = () => {
  return (
    <div className="bg-gradient-to-b from-[#ff5a601c] to-white min-h-screen flex items-center justify-center">
      <div className="lg:w-9/12 mx-auto px-4 py-32">
        <div className='w-9/12 mx-auto lg:w-auto'>
          <h1 className="text-3xl xl:text-4xl  font-bold lg:text-center mb-8">Ponerse en contacto</h1>
          <p className="lg:text-center lg:text-lg text-gray-600 mb-12">
          En STEF NAILS, estamos aquí para ayudarte a dar el primer paso hacia tu carrera en el arte de las uñas. ¿Tienes preguntas sobre nuestros cursos, horarios o inscripciones? ¿Necesitas asesoría personalizada o quieres conocer más sobre nuestras promociones? ¡No dudes en escribirnos!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 shadow-lg rounded-2xl bg-white p-6">
          {/* Contact Information */}
          <div className="bg-[#ff5a5f] text-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl xl:text-3xl font-semibold mb-4">Información de Contacto</h2>
            <p className="mb-4 lg:text-lg">
                Nuestro equipo está listo para brindarte la información que necesitas.
            </p>

            <ul className="grid gap-4 text-white">
              <li className="flex items-center space-x-3 overflow-hidden">
                <FaWhatsapp className="text-xl flex-shrink-0" />
                <div className="overflow-hidden">
                  <strong className="block">WhatsApp:</strong>
                  <span className="block break-words">+58 426-4091983</span>
                </div>
              </li>

              <li className="flex items-center space-x-3 overflow-hidden">
                <FaEnvelope className="text-xl flex-shrink-0" />
                <div className="overflow-hidden">
                  <strong className="block">Correo:</strong>
                  <span className="block break-words">soportestefnailsacademy@gmail.com</span>
                </div>
              </li>

              <li className="flex items-start space-x-3 overflow-hidden col-span-full lg:col-span-1">
                <FaMapMarkerAlt className="text-xl flex-shrink-0 mt-1" />
                <div className="overflow-hidden">
                  <strong className="block">Ubicación:</strong>
                  <a 
                    href="https://maps.app.goo.gl/QTKCQePBkegPj4Zm7" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block break-words hover:underline"
                  >
                    C.C. Galerías El Paraiso, Local 19, Final Av. Páez, con Ohiggins, Frente a la Redoma La India, El Paraíso, Caracas
                  </a>
                </div>
              </li>
            </ul>

          </div>

          {/* Contact Form */}
          <div className="bg-white p-6">
            <FormContact/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs