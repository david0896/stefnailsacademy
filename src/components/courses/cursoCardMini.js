import { variantClass } from "@/utils/enrollmentButtonState";

function esFechaPasada(fechaStr) {
  const [dia, mes, anio] = fechaStr.split('/').map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return hoy > fecha;
}

const baseBtnClass = "mt-6 w-full inline-block text-center px-4 py-2 pr-6 rounded-[25px] font-normal transition";

const CursoCardMini = ({ index, curso, onReservar, enrollmentState }) => {
  const handleClick = () => onReservar?.(false, index, curso.id);
  const fechaPasada = esFechaPasada(curso.fechaSnFormato);

  // Decidir qué renderizar como CTA
  let cta;
  if (fechaPasada) {
    cta = (
      <button className={`${baseBtnClass} bg-[#383838] text-white`} disabled>
        Finalizado
      </button>
    );
  } else if (enrollmentState) {
    // Alumno ya tiene inscripción activa para este curso
    cta = (
      <span className={`${baseBtnClass} ${variantClass[enrollmentState.variant]}`}>
        {enrollmentState.label}
      </span>
    );
  } else {
    cta = (
      <button
        className={`${baseBtnClass} cursor-pointer bg-[#ff5a5f] text-white hover:bg-[#ff3b3f]`}
        onClick={handleClick}
      >
        Reservar cupo
      </button>
    );
  }

  return (
    <div className="py-4">
      <img
        src={curso.imagen}
        alt={`Imagen del curso ${curso.nombre}`}
        className="w-full h-auto rounded-sm mb-4"
      />
      <h3 className="text-base font-bold text-[#383838]">{curso.nombre}</h3>
      <p className="text-[#383838] text-sm">{curso.descripcion}</p>
      <p className="text-[#383838] text-sm">
        <span className="font-semibold">Instructor:</span> {curso.clases.instructor}
      </p>
      <p className="text-[#383838] text-sm">
        <span className="text-[#ff5a5f] font-bold block">{curso.fecha}</span>
        {curso.horas_academicas} horas - {curso.clases.cantidad} clases - nivel {curso.nivel}
      </p>
      {curso.modo === 'PRESENCIAL' && curso.sede && (
        <p className="text-[#383838] text-xs mt-1 line-clamp-1" title={curso.sede}>
          📍 {curso.sede}
        </p>
      )}
      {cta}
    </div>
  );
};

export default CursoCardMini;
