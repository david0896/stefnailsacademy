import { useState } from "react";
import CarrucelCharacteristics from "@/components/courses/CarrucelCharacteristics"
import useCursos from "@/hooks/useCursos";
import CursoCardMini from "@/components/courses/cursoCardMini";
import ModalHome from "@/components/ModalHome";
import { set } from "react-hook-form";
import useProximaFecha from "@/hooks/useProximaFecha";
import useCursosProximos from "@/hooks/useCursosProximos";

export async function getStaticProps() {
  // 1. Fetch a tu propia API
  const res = await fetch(`${process.env.BASE_URL}/api/sheets/infoCursos`);
  const cursos = await res.json();

  // 2. ISR: Revalida cada 24 horas (86400 segundos)
  return {
    props: { cursos },
    revalidate: 86400 // ← Actualiza 1 vez/día aunque no se use
  };
}

const Courses = ({cursos}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [indexData, setIndexData] = useState(0);
    const [principalCurso, setPrincipalCurso] = useState(true);
    // Custom hook para mantener actualizado
    const { data } = useCursos(cursos);
    // obtener cursos con proximidad a fecha actual 
    const cursosProcesados = useCursosProximos(data);
    //cursos que no cumplen con la condicion de proximo curso
    const otrosCursos = cursosProcesados.filter(curso => !curso.proximoCurso);
    //primer curso proximo a la fecha actual
    const ProximoCurso = cursosProcesados.find(curso => curso.proximoCurso);
    //segundo curso proximo al primer curso a la fecha actual
    const SiguienteCurso = cursosProcesados.find(curso => curso.siguienteCurso);
    
    return (
        <div className="w-10/12 mx-auto pb-10">
            <CarrucelCharacteristics/>
            <h2 className=" text-2xl font-bold text-[#383838] mt-10 mb-5">Conoce nuestro proximo curso ideal para ti</h2>
            {ProximoCurso ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 border-[0.5px] border-gray-300 rounded-md p-8 gap-5 bg-[#ff5a600d]">
                    <div className=" col-span-3" >
                        <img
                            src={ProximoCurso.imagen}
                            alt={"Ilustración de certificación " + ProximoCurso.nombre}
                            className="w-full h-72 rounded-sm"
                        />
                    </div>
                    <div className="col-span-9 space-y-5 flex flex-col justify-between">
                        <div className="">
                            <h3 className="text-xl font-bold text-[#383838]">Curso: {ProximoCurso.nombre }</h3>
                            <p className="text-[#383838] w-4/5">{ProximoCurso.descripcion}</p>
                            <p className="text-[#383838] text-sm"><span className=" font-semibold">Nombre del instructor:</span> {ProximoCurso.clases.instructor}</p>
                            <p className="text-[#383838]"><span className="text-[#ff5a5f] font-bold">{ProximoCurso.fecha}</span> | {ProximoCurso.horas_academicas} horas - {ProximoCurso.clases.cantidad} clases - nivel {ProximoCurso.nivel}</p>
                        </div>
                        <p className="text-[#383838] font-bold text-2xl">{ProximoCurso.precio} Bs.</p>
                        <button
                            className="inline-block w-fit cursor-pointer bg-[#ff5a5f] text-white px-4 py-2 pr-6 rounded-[25px] font-normal hover:bg-[#ff3b3f] transition"
                            onClick={() =>{ 
                                setPrincipalCurso(true);
                                setIndexData(0);
                                setIsOpen(true);
                            }}
                        >
                            Reservar tu lugar en la próxima clase
                        </button>
                    </div>

                </div>
            ) : (
                <p>No hay cursos disponibles</p>
            )}
            <h2 className=" text-2xl font-bold text-[#383838] mt-10 mb-5">Conoce los siguientes cursos que tendremos para ti</h2>
            <div className="mb-10 grid grid-cols-3 lg:grid-cols-5 gap-4">
                {otrosCursos.map((curso, index) => (
                    <CursoCardMini
                        key={index}
                        index={index}
                        curso={curso}
                        setIsOpen={setIsOpen}
                        setIndexData={setIndexData}
                        setPrincipalCurso={setPrincipalCurso}
                    />
                ))}
            </div>
            {/* Modal */}
            <ModalHome 
                isOpen={isOpen} 
                onClose={() => setIsOpen(false)} 
                data={principalCurso ? ProximoCurso : otrosCursos?.[indexData]}
                ProximoCurso={principalCurso ? SiguienteCurso : ProximoCurso}
            />
        </div>
    )
}

export default Courses