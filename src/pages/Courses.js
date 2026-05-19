import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { getSession } from 'next-auth/react';
import CarrucelCharacteristics from "@/components/courses/CarrucelCharacteristics"
import useCursos from "@/hooks/useCursos";
import CursoCardMini from "@/components/courses/cursoCardMini";
import ModalHome from "@/components/ModalHome";
import useProximaFecha from "@/hooks/useProximaFecha";
import useCursosProximos from "@/hooks/useCursosProximos";
import MisInscripciones from "@/components/courses/MisInscripciones";
import { buildEnrollmentMap, variantClass } from "@/utils/enrollmentButtonState";

const PER_PAGE = 5;

export async function getServerSideProps(context) {
  const { getActiveCourses } = await import('@/application/courses/getCourses');
  const { getEuroRate }      = await import('@/infrastructure/services/exchangeRateService');
  const { formatCurso }      = await import('@/utils/formatCurso');

  const [rawCourses, tasaEur] = await Promise.all([
    getActiveCourses(),
    getEuroRate().catch(() => 1),
  ]);

  const cursos = rawCourses.map((c) => formatCurso(c, tasaEur));

  // Si hay alumno logueado, traemos su perfil + historial de inscripciones
  let inscripciones = [];
  let student       = null;

  const session = await getSession(context);
  if (session?.user?.role === 'STUDENT' && session.user.id) {
    try {
      const { default: prisma } = await import('@/lib/prisma');
      const studentRow = await prisma.student.findUnique({ where: { id: session.user.id } });
      if (studentRow) {
        student = {
          id:        studentRow.id,
          firstName: studentRow.firstName ?? '',
          lastName:  studentRow.lastName  ?? '',
          email:     studentRow.email,
          phone:     studentRow.phone    ?? '',
          idNumber:  studentRow.idNumber ?? '',
        };
      }

      const { getStudentEnrollments } = await import('@/application/enrollments/getStudentEnrollments');
      const raw = await getStudentEnrollments(session.user.id);
      inscripciones = raw.map((e) => ({
        id:            e.id,
        status:        e.status,
        paymentStatus: e.paymentStatus,
        paymentMethod: e.paymentMethod,
        amountEUR:     e.amountEUR,
        enrolledAt:    e.enrolledAt,
        confirmedAt:   e.confirmedAt,
        course: {
          id:       e.course.id,
          title:    e.course.title,
          type:     e.course.type,
          date:     e.course.date,
          imageUrl: e.course.imageUrl,
          nivel:    e.course.nivel,
          sede:     e.course.sede,
        },
      }));
    } catch (err) {
      console.error('[Courses] error cargando perfil/inscripciones del alumno:', err);
    }
  }

  return {
    props: {
      cursos:        JSON.parse(JSON.stringify(cursos)),
      inscripciones: JSON.parse(JSON.stringify(inscripciones)),
      student:       student ? JSON.parse(JSON.stringify(student)) : null,
    },
  };
}

const Courses = ({ cursos, inscripciones = [], student = null }) => {
    const router = useRouter();
    const [isOpen, setIsOpen]               = useState(false);
    const [indexData, setIndexData]         = useState(0);
    const [principalCurso, setPrincipalCurso] = useState(true);
    const [page, setPage]                   = useState(0);

    // Mapa { courseId → estado del botón } basado en las inscripciones del alumno
    const enrollmentMap = useMemo(() => buildEnrollmentMap(inscripciones), [inscripciones]);

    // Auth guard + defensa contra doble-inscripción
    const openInscripcionModal = (isPrincipal, index, cursoId) => {
      if (!student) {
        router.push({ pathname: '/login', query: { callbackUrl: '/Courses' } });
        return;
      }
      if (cursoId && enrollmentMap[cursoId]) {
        // Ya tiene inscripción activa para ese curso → no abrimos el modal
        return;
      }
      setPrincipalCurso(isPrincipal);
      setIndexData(index);
      setIsOpen(true);
    };

    // Custom hook para mantener actualizado
    const { data } = useCursos(cursos);
    // obtener cursos con proximidad a fecha actual
    const cursosProcesados = useCursosProximos(data);
    // cursos que no cumplen con la condicion de proximo curso
    const otrosCursos = cursosProcesados.filter(curso => !curso.proximoCurso);
    // primer curso proximo a la fecha actual
    const ProximoCurso = cursosProcesados.find(curso => curso.proximoCurso);
    // segundo curso proximo al primer curso a la fecha actual
    const SiguienteCurso = cursosProcesados.find(curso => curso.siguienteCurso);

    // Paginación de otrosCursos
    const totalPages    = Math.ceil(otrosCursos.length / PER_PAGE);
    const cursosPagina  = otrosCursos.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

    const handlePrev = () => setPage((p) => Math.max(0, p - 1));
    const handleNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

    return (
        <div className="w-10/12 mx-auto pb-10">
            <CarrucelCharacteristics/>

            {/* ── Historial del alumno (solo si está logueado y tiene inscripciones) ── */}
            {inscripciones.length > 0 && (
                <MisInscripciones inscripciones={inscripciones} />
            )}

            <h2 className="text-2xl xl:text-3xl font-bold text-[#383838] mt-10 mb-5">
                Conoce nuestro proximo curso ideal para ti
            </h2>

            {ProximoCurso ? (
                <>
                    {/* ── Curso destacado ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 border-[0.5px] border-gray-300 rounded-md p-8 gap-5 bg-[#ff5a600d]">
                        <div className="col-span-1 xl:col-span-3">
                            <img
                                src={ProximoCurso.imagen}
                                alt={"Ilustración de certificación " + ProximoCurso.nombre}
                                className="w-full h-72 rounded-sm"
                            />
                        </div>
                        <div className="xl:col-span-9 space-y-5 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-[#383838]">Curso: {ProximoCurso.nombre}</h3>
                                <p className="text-[#383838] w-4/5">{ProximoCurso.descripcion}</p>
                                <p className="text-[#383838] text-sm">
                                    <span className="font-semibold">Nombre del instructor:</span>{' '}
                                    {ProximoCurso.clases.instructor}
                                </p>
                                <p className="text-[#383838]">
                                    <span className="text-[#ff5a5f] font-bold">{ProximoCurso.fecha}</span>
                                    {' | '}{ProximoCurso.horas_academicas} horas -{' '}
                                    {ProximoCurso.clases.cantidad} clases - nivel {ProximoCurso.nivel}
                                </p>
                                {ProximoCurso.modo === 'PRESENCIAL' && ProximoCurso.sede && (
                                    <p className="text-[#383838] text-sm flex items-start gap-1 mt-1">
                                        <span aria-hidden>📍</span>
                                        <span><span className="font-semibold">Sede:</span> {ProximoCurso.sede}</span>
                                    </p>
                                )}
                            </div>
                            <p className="text-[#383838] font-bold text-2xl">{ProximoCurso.precio} Bs.</p>
                            {(() => {
                                const estado = ProximoCurso && enrollmentMap[ProximoCurso.id];
                                if (estado) {
                                    return (
                                        <span className={`inline-block w-fit text-base lg:text-lg px-4 py-2 pr-6 rounded-[25px] font-medium ${variantClass[estado.variant]}`}>
                                            {estado.label}
                                        </span>
                                    );
                                }
                                return (
                                    <button
                                        className="inline-block w-fit cursor-pointer bg-[#ff5a5f] text-white text-base lg:text-lg px-4 py-2 pr-6 rounded-[25px] font-normal hover:bg-[#ff3b3f] transition"
                                        onClick={() => openInscripcionModal(true, 0, ProximoCurso?.id)}
                                    >
                                        Reserva tu cupo
                                    </button>
                                );
                            })()}
                        </div>
                    </div>

                    {/* ── Otros cursos con paginación ── */}
                    {otrosCursos.length > 0 && (
                        <>
                            <h3 className="text-xl lg:text-2xl font-bold text-[#383838] mt-10 mb-5">
                                Conoce los siguientes cursos que tendremos para ti
                            </h3>

                            <div className="mb-6 grid grid-cols-3 lg:grid-cols-5 gap-4">
                                {cursosPagina.map((curso, index) => (
                                    <CursoCardMini
                                        key={curso.id ?? index}
                                        index={page * PER_PAGE + index}
                                        curso={curso}
                                        onReservar={openInscripcionModal}
                                        enrollmentState={enrollmentMap[curso.id] || null}
                                    />
                                ))}
                            </div>

                            {/* ── Controles de paginación ── */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-4 mb-10">
                                    <button
                                        onClick={handlePrev}
                                        disabled={page === 0}
                                        className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        ← Anterior
                                    </button>
                                    <span className="text-sm text-gray-500">
                                        Página {page + 1} de {totalPages}
                                    </span>
                                    <button
                                        onClick={handleNext}
                                        disabled={page === totalPages - 1}
                                        className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Siguiente →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </>

            ) : (
                <p>No hay cursos disponibles</p>
            )}

            {/* Modal */}
            <ModalHome
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                data={principalCurso ? ProximoCurso : otrosCursos?.[indexData]}
                ProximoCurso={principalCurso ? SiguienteCurso : ProximoCurso}
                student={student}
            />
        </div>
    );
}

export default Courses;
