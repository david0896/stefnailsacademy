import { useEffect } from "react";

function esFechaPasada(fechaStr) {
  // Dividir la cadena de fecha en día, mes y año
  const [dia, mes, anio] = fechaStr.split('/').map(Number);
  
  // Crear un objeto Date con la fecha proporcionada
  const fecha = new Date(anio, mes - 1, dia); // Los meses en JavaScript son de 0 a 11
  
  // Obtener la fecha actual y establecer la hora a 00:00:00
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  // Comparar las fechas
  return hoy > fecha;
}

const CursoCardMini = ({index, curso, setIsOpen, setIndexData, setPrincipalCurso }) => {

  return (
    <div className="py-4">
      <img
        src={curso.imagen}
        alt={`Imagen del curso ${curso.nombre}`}
        className="w-full h-auto rounded-sm mb-4"
      />
      <h3 className="text-base font-bold text-[#383838]">{curso.nombre}</h3>
      <p className="text-[#383838] text-sm">{curso.descripcion}</p>
      <p className="text-[#383838] text-sm"><span className="font-semibold">Instructor:</span> {curso.clases.instructor}</p>
      <p className="text-[#383838] text-sm">
        <span className="text-[#ff5a5f] font-bold block">{curso.fecha}</span>
        {curso.horas_academicas} horas - {curso.clases.cantidad} clases - nivel {curso.nivel}
      </p>
      {esFechaPasada(curso.fechaSnFormato) ? 
        <button
            className="mt-6 w-full inline-block text-center bg-[#383838] text-white px-4 py-2 pr-6 rounded-[25px] font-normal transition"
            onClick={() =>{ 
              setPrincipalCurso(false);
              setIndexData(index);
              setIsOpen(true);            
            }}
            disabled={true}
        >
            Finalizado
        </button>
      : 
        <button
            className="mt-6 w-full inline-block cursor-pointer text-center bg-[#ff5a5f] text-white px-4 py-2 pr-6 rounded-[25px] font-normal hover:bg-[#ff3b3f] transition"
            onClick={() =>{ 
              setPrincipalCurso(false);
              setIndexData(index);
              setIsOpen(true);            
            }}
        >
            Reservar cupo
        </button>
      }
      
    </div>
  );
};

export default CursoCardMini;
