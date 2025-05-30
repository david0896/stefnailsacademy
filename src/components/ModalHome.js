import React, { useState } from "react";
import clsx from "clsx";
import styles from "../styles/ModalHome.module.css";
import MultiStepForm from "./MultiStepForm";

const ModalHome = ({ isOpen, onClose, data, ProximoCurso }) => {
    if (!isOpen) return null;
    console.log(JSON.stringify(data.precio, null, 2))

    return (
        <div className={"fixed top-0 left-0 inset-0 flex items-center justify-center bg-black bg-opacity-80 z-[999]"}>
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
                        className="absolute inset-0 bg-cover blur-[2px] bg-center opacity-30"
                        style={{ backgroundImage: `url(${data?.imagen})` }}
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
                                src={data?.imagen}
                                alt="Curso acrílico básico"
                                className=" w-4/5 rounded-2xl"
                            />
                            <div className=" bg-white rounded-2xl w-4/5 p-3 -mt-8">
                                <h3 className="text-lg font-bold text-gray-700">{data?.nombre}</h3>
                                <p className="text-sm text-gray-600 mb-4">{data?.descripcion}</p>
                                <p className="text-base font-semibold text-gray-800">Costo: {data?.precio} Bs.</p>
                                <p className="text-sm text-gray-500">Modalidad: {data?.modo}</p>
                            </div>                        
                        </div>
                    </div>
                </div>
                <div className=" col-span-3 p-4">
                    <div className="text-center">
                        <span className="font-semibold text-[#383838] text-base">cupos disponibles</span>
                        <h4 className="text-[#ff5a5f] text-lg font-semibold">¡Inscribirse ahora!</h4>    
                    </div>                
                    
                    {/* Form */}
                    <MultiStepForm
                        nombreCurso={data?.nombre}
                        precio={data?.precio}
                    />

                    {/* Footer */}
                    <p className="mt-6 text-sm text-gray-500 text-center">
                    Próxima clase: {ProximoCurso.fecha} - <span className="font-semibold">{ProximoCurso.nombre}</span>
                    </p>
                </div>
            </div>
        </div>
        </div>
    );
};

export default ModalHome;
