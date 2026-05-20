// components/Hero.js
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { FaPercent, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import clsx from "clsx";
import styles from '../styles/Hero.module.css';
import Countdown from "./Countdown";
import ModalHome from "@/components/ModalHome";
import BlurBackgroundSection from "./BlurBackgroundSection";
import BlurImage from "./BlurImage";

function formatearFechaMesDia(fechaStr) {
  const [day, month, year] = fechaStr.split('/').map(Number);
  const fecha = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('es-ES', { month: 'long', day: 'numeric' }).format(fecha);
}

import { variantClass } from "@/utils/enrollmentButtonState";

// ─── Slide 1: Hero principal con instructora + countdown ──────────────────
function SlidePrincipal({ slide, ProximoCurso, SiguienteCurso, isVisible, onReservar, enrollmentState }) {
  const hayCurso = ProximoCurso && Object.keys(ProximoCurso).length > 0;

  return (
    <>
      <BlurBackgroundSection
        lowQualityImageUrl={slide.imagenBajaCal}
        fullImageUrl={slide.imagenUrl}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">

            {/* Columna de texto */}
            <div className="flex flex-col col-span-1 justify-center space-y-4 lg:space-y-6 text-left pt-28 lg:pt-0">
              <h1 className="text-2xl sm:text-3xl xl:text-5xl font-bold text-[#ff5a5f] leading-tight">
                {slide.titulo}
              </h1>
              <h2 className="text-lg sm:text-2xl xl:text-3xl text-[#383838]">
                {slide.subtitulo}
              </h2>
              <p className="text-sm lg:text-lg text-[#383838] max-w-2xl">
                {slide.descripcion}
              </p>
              {hayCurso && ProximoCurso.modo === 'PRESENCIAL' && ProximoCurso.sede && (
                <p className="text-sm text-[#383838] flex items-start gap-1">
                  <span aria-hidden>📍</span>
                  <span><span className="font-semibold">Sede:</span> {ProximoCurso.sede}</span>
                </p>
              )}
              {hayCurso && enrollmentState ? (
                <span className={`inline-block w-fit px-4 py-2 pr-6 rounded-[25px] text-base lg:text-lg font-medium ${variantClass[enrollmentState.variant]}`}>
                  {enrollmentState.label}
                </span>
              ) : (
                <button
                  className="inline-block w-fit bg-[#ff5a5f] text-white px-4 py-2 pr-6 z-50 rounded-[25px] text-base lg:text-lg font-medium hover:bg-[#ff3b3f] transition"
                  onClick={onReservar}
                >
                  {hayCurso ? slide.ctaTexto : 'Proximamente cursos disponibles'}
                </button>
              )}

            </div>

            {/* Columna de imagen + countdown.
                En mobile la imagen vuelve a anchorse al bottom (items-end)
                y el badge de fecha flota arriba a la izquierda, fuera del
                área de la cara. object-top en la imagen preserva la cabeza. */}
            <div className="relative h-full flex col-span-1 justify-center items-end overflow-hidden">

              {/* Countdown — desktop (absolute, en la columna de la imagen) */}
              {ProximoCurso && Object.keys(ProximoCurso).length > 0 && (
                <>
                  <div className="absolute px-8 py-10 hidden lg:grid content-end z-20">
                    <div className="grid grid-cols-5 rounded-lg border-solid border-2 border-[#ff5a5f]">
                      <div className="col-span-2 bg-[#ff5a5f]/60 backdrop-blur-sm">
                        <div className="bg-[#ff5a5f] p-2 h-full border-solid border-2 border-[#ffffff] rounded-lg">
                          <p className="text-white font-bold text-center text-3xl">
                            {formatearFechaMesDia(ProximoCurso.fechaSnFormato)}
                            <span className="block font-normal text-base">Siguiente clase</span>
                          </p>
                        </div>
                      </div>
                      <div className="col-span-3 p-2 bg-[#ff5a5f]/60 backdrop-blur-sm">
                        <Countdown fecha={ProximoCurso.fechaSnFormato} />
                      </div>
                      {SiguienteCurso && Object.keys(SiguienteCurso).length !== 0 && (
                        <div className="col-span-5 p-2 bg-[#ff5a5f]/60 backdrop-blur-sm border-t-2 border-solid border-[#ff5a5f]">
                          <p className="text-white font-medium">Clase programada: {SiguienteCurso.fecha}</p>
                          <p className="text-white font-normal text-sm uppercase">{SiguienteCurso.nombre}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Badge de fecha — mobile only, esquina superior izquierda
                      de la columna de la imagen. Posicionado lejos de la cara
                      de la instructora. */}
                  <div className="lg:hidden absolute top-3 left-3 z-30">
                    <div className="bg-[#ff5a5f] border-2 border-white rounded-lg px-3 py-2 shadow-md">
                      <p className="text-white font-bold text-sm leading-tight whitespace-nowrap">
                        {formatearFechaMesDia(ProximoCurso.fechaSnFormato)}
                        <span className="block font-normal text-[10px] opacity-90">Siguiente clase</span>
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Imagen instructora — z-20 delante de SVGs decorativos.
                  object-top en mobile preserva la cabeza al hacer object-cover. */}
              <BlurImage
                lowQualitySrc="https://i.postimg.cc/xdbsNgTM/instructor.jpg"
                fullQualitySrc="https://i.postimg.cc/KjJrYrk3/instructor.png"
                alt="Instructora profesional Stef"
                className="relative w-[80vw] h-[45vh] lg:w-[40vw] lg:h-[80vh] z-20 object-top lg:object-center"
              />

              {/* SVGs decorativos */}
              <div className="absolute -bottom-2 lg:-bottom-16 left-32 lg:left-36 w-[18vw] h-[18vw] lg:w-[35vw] lg:h-[35vw]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
                  <rect width={179} height={274} rx={41} ry={41}
                    transform="matrix(1 0 0 1.125856 69.85 8.988626)"
                    fill="none" stroke="rgba(55,55,55,0.43)" />
                </svg>
              </div>
              <div className="absolute -bottom-12 left-28 lg:left-32 w-[20vw] h-[20vw] lg:w-[35vw] lg:h-[35vw]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
                  <rect width={179} height={274} rx={41} ry={41}
                    transform="matrix(1 0 0 1.125856 69.85 8.988626)"
                    fill="rgba(255,90,95,0.37)" strokeWidth={0} />
                </svg>
              </div>
            </div>
          </div>

          {/* Card flotante — solo visible en desktop. En mobile el espacio
              es muy chico y compite con el countdown + texto + imagen. */}
          <div
            className={clsx(
              `${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`,
              'hidden lg:grid absolute rounded-md z-30 w-[17vw]',
              'top-[12vw] right-[5vw]',
              'bg-[#fff]/60 backdrop-blur-sm p-1 py-3',
              styles.heroFloat
            )}
            style={{ gridTemplateColumns: '1fr 2fr' }}
          >
            <div className="flex items-center justify-center">
              <div className="bg-gray-900 text-white text-3xl rounded-full p-2">
                <FaPercent />
              </div>
            </div>
            <div className="text-[#383838] space-y-2">
              <h4 className="font-bold text-sm">Productos para uñas</h4>
              <p className="text-sm">Distribuimos artículos para uñas de las marcas más reconocidas</p>
            </div>
          </div>
        </div>
      </BlurBackgroundSection>
    </>
  );
}

// ─── Slide genérico (slides 2 y 3) ────────────────────────────────────────
function SlideGenerico({ slide }) {
  return (
    <BlurBackgroundSection
      lowQualityImageUrl={slide.imagenBajaCal}
      fullImageUrl={slide.imagenUrl}
    >
      {/* Overlay oscuro para legibilidad */}
      <div className="absolute inset-0 bg-black/40 z-[2]" />
      <div className="absolute inset-0 flex items-center z-[10]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <div className="max-w-xl space-y-4 lg:space-y-6">
            <h1 className="text-2xl sm:text-3xl xl:text-5xl font-bold text-white leading-tight">
              {slide.titulo}
            </h1>
            <h2 className="text-lg sm:text-2xl xl:text-3xl text-white/90 font-medium">
              {slide.subtitulo}
            </h2>
            <p className="text-sm lg:text-lg text-white/80 max-w-lg">
              {slide.descripcion}
            </p>
            <a
              href={slide.ctaUrl}
              className="inline-block w-fit bg-[#ff5a5f] text-white px-4 py-2 pr-6 rounded-[25px] text-base lg:text-lg font-medium hover:bg-[#ff3b3f] transition"
            >
              {slide.ctaTexto}
            </a>
          </div>
        </div>
      </div>
    </BlurBackgroundSection>
  );
}

// ─── Hero carousel ─────────────────────────────────────────────────────────
const Hero = ({ ProximoCurso, SiguienteCurso, slides = [], student = null, enrollmentState = null }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const isAuthenticated = !!student || session?.user?.role === 'STUDENT';

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const total = slides.length;
  const hayCurso = ProximoCurso && Object.keys(ProximoCurso).length > 0;
  const MIN_SWIPE_DISTANCE = 50; // px

  useEffect(() => { setIsVisible(true); }, []);

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  // Autoplay — pausado cuando: mouse encima, modal abierto, solo un slide
  useEffect(() => {
    if (paused || isOpen || total <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [paused, isOpen, total, next]);

  // Swipe táctil (mobile/tablet) para cambiar de slide
  const handleTouchStart = (e) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (touchStartX == null || touchEndX == null) return;
    const distance = touchStartX - touchEndX;
    if (distance > MIN_SWIPE_DISTANCE) next();        // swipe izquierda → siguiente
    else if (distance < -MIN_SWIPE_DISTANCE) prev();  // swipe derecha → anterior
  };

  // Auth guard + dedup para abrir el modal
  const handleReservar = () => {
    if (!hayCurso) return;
    if (!isAuthenticated) {
      router.push({ pathname: '/login', query: { callbackUrl: '/Courses' } });
      return;
    }
    if (enrollmentState) return; // ya inscrito, ignorar
    setIsOpen(true);
  };

  if (!slides || total === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden touch-pan-y"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides — crossfade con absolute positioning */}
      <div className="relative w-full" style={{ height: '100vh' }}>
        {slides.map((slide, i) => (
          <div
            key={slide.tipo || i}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? 'auto' : 'none' }}
          >
            {slide.tipo === 'hero_principal'
              ? <SlidePrincipal
                  slide={slide}
                  ProximoCurso={ProximoCurso}
                  SiguienteCurso={SiguienteCurso}
                  isVisible={isVisible}
                  onReservar={handleReservar}
                  enrollmentState={enrollmentState}
                />
              : <SlideGenerico slide={slide} />
            }
          </div>
        ))}
      </div>

      {/* Flechas de navegación — solo desktop. En mobile el usuario hace
          swipe táctil o espera el autoplay. */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Slide anterior"
            className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-40 bg-black/40 hover:bg-black/60 text-white rounded-full min-w-[44px] min-h-[44px] items-center justify-center transition-colors"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Slide siguiente"
            className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-40 bg-black/40 hover:bg-black/60 text-white rounded-full min-w-[44px] min-h-[44px] items-center justify-center transition-colors"
          >
            <FaChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots de navegación — solo desktop también */}
      {total > 1 && (
        <div className="hidden lg:flex absolute bottom-5 left-1/2 -translate-x-1/2 z-40 items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Ir al slide ${i + 1}`}
              className={clsx(
                'rounded-full transition-all duration-300',
                i === current
                  ? 'bg-white w-6 h-2.5'
                  : 'bg-white/50 hover:bg-white/75 w-2.5 h-2.5'
              )}
            />
          ))}
        </div>
      )}

      {/* Modal de inscripción — fuera de los slides para que sobreviva al cambio de slide */}
      <ModalHome
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        data={ProximoCurso}
        ProximoCurso={SiguienteCurso}
        student={student}
      />
    </div>
  );
};

export default Hero;
