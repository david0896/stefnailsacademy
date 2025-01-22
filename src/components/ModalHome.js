import React, { useState } from "react";
import clsx from "clsx";
import styles from "../styles/ModalHome.module.css";

const ModalHome = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80">
      <div
        className={clsx(
          "bg-white w-full max-w-5xl rounded-lg shadow-lg overflow-hidden relative",
          styles.modal,
          styles.fadeIn
        )}
      >
        <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 absolute top-2 right-4"
            aria-label="Close modal"
        >
            &times;
        </button>
        <div className="grid grid-cols-5 gap-5">
            <div 
                className={`col-span-2 relative bg-[#ffddde] p-6`}    
            >
                {/* Fondo con imagen y blur */}
                <div 
                    className="absolute inset-0 bg-[url('https://i.postimg.cc/FHZqLpjC/flyer-curso-soft-gel.jpg')] bg-cover blur-[2px] bg-center opacity-30"
                    aria-hidden="true"
                ></div>

                {/* Main Content */}
                <div className="flex flex-col md:flex-row gap-4 relative">  
                    <div className="flex-1 flex flex-col justify-center items-center">
                        <img
                            src="https://i.postimg.cc/GpRdG1qP/logo-stefnails.png"
                            alt="Logo Stef Nails"
                            className=" w-1/5 pb-5"
                        />
                        <img
                            src="https://i.postimg.cc/FHZqLpjC/flyer-curso-soft-gel.jpg"
                            alt="Curso acrílico básico"
                            className=" w-4/5 rounded-2xl"
                        />
                        <div className=" bg-white rounded-2xl w-4/5 p-3 -mt-8">
                            <h3 className="text-lg font-bold text-gray-700">Curso acrílico básico</h3>
                            <p className="text-sm text-gray-600 mb-4">
                            Decoraciones especiales y efectos de tendencia en SOF GEL
                            </p>
                            <p className="text-base font-semibold text-gray-800">Costo: 25 REF</p>
                            <p className="text-sm text-gray-500">Modalidad: presencial</p>
                        </div>                        
                    </div>
                </div>
            </div>
            <div className=" col-span-3 p-6">
                <div className="text-center">
                    <span className="font-semibold text-[#383838] text-base">cupos disponibles</span>
                    <h3 className="text-[#ff5a5f] text-2xl font-semibold">¡Inscribirse ahora!</h3>    
                </div>                
                
                {/* Form */}
                <form className="mt-6 px-20">
                <div className="flex flex-col gap-4">
                    <input
                    type="text"
                    placeholder="Escribe tu nombre"
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]"
                    />
                    <input
                    type="text"
                    placeholder="Escribe tu apellido"
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]"
                    />
                    <input
                    type="text"
                    placeholder="Escribe tu cédula"
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]"
                    />
                    <input
                    type="email"
                    placeholder="Escribe tu dirección de correo"
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]"
                    />
                    <input
                    type="tel"
                    placeholder="Escribe tu número de teléfono"
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]"
                    />
                    <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2" />
                    <span>Acepto los <a href="#" className="text-[#ff5a5f] underline">términos y condiciones</a></span>
                    </label>
                </div>
                <button
                    type="submit"
                    className="mt-4 w-full py-3 bg-[#ff5a5f] text-white rounded-md hover:bg-[#ff5a5f]/70 transition duration-200"
                >
                    Enviar formulario
                </button>
                </form>

                {/* Footer */}
                <p className="mt-6 text-sm text-gray-500 text-center">
                Próxima clase: Enero 25 - <span className="font-semibold">SOFT GEL nivel II</span>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ModalHome;
