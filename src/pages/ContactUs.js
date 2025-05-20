import React from 'react'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import FormContact from '@/components/ContactUs/FormContact';

const ContactUs = () => {
  return (
    <div className="bg-gradient-to-b from-[#ff5a601c] to-white min-h-screen flex items-center justify-center">
      <div className="w-9/12 mx-auto px-4 py-32">
        <h1 className="text-4xl font-bold text-center mb-8">Ponerse en contacto</h1>
        <p className="text-center text-lg text-gray-600 mb-12">
        En STEF NAILS, estamos aquí para ayudarte a dar el primer paso hacia tu carrera en el arte de las uñas. ¿Tienes preguntas sobre nuestros cursos, horarios o inscripciones? ¿Necesitas asesoría personalizada o quieres conocer más sobre nuestras promociones? ¡No dudes en escribirnos!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 shadow-lg rounded-2xl bg-white p-6">
          {/* Contact Information */}
          <div className="bg-[#ff5a5f] text-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Información de Contacto</h2>
            <p className="mb-4">
                Nuestro equipo está listo para brindarte la información que necesitas.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center space-x-3">
                <FaWhatsapp /> <strong className="material-icons mr-2">WhatsApp:</strong>
                <span>+58 426-4091983</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope /> <strong className="material-icons mr-2">Correo:</strong>
                <span>Support@uprankly.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className='flex items-center space-x-3'>
                  <FaMapMarkerAlt /> <strong className="material-icons mr-2">Ubicación:</strong>
                </div>
                <a href='https://maps.app.goo.gl/QTKCQePBkegPj4Zm7' target='blank'>C.C. Galerías El Paraiso, Final Av. Paéz, con Ohiggins, Frente a la Redoma La India, El Paraíso, Caracas</a>
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