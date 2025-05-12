import React from 'react'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";

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
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Tu nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff5a5f] focus:ring-[#ff5a5f] p-4"
                    placeholder="John Trangelo"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Tu correo
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff5a5f] focus:ring-[#ff5a5f] p-4"
                    placeholder="hello@gmail.com"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Asunto
                </label>
                <input
                  type="text"
                  id="subject"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff5a5f] focus:ring-[#ff5a5f] p-4"
                  placeholder="Solicitud de inscripción"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff5a5f] focus:ring-[#ff5a5f] p-4"
                  placeholder="Escribe aqui tu mensaje"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#ff5a5f] text-white py-2 px-4 rounded-md hover:bg-[#bb3d41] focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:ring-offset-2"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs