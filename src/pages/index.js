import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Hero from "@/components/Hero";
import PolaroidCarousel from "@/components/PolaroidCarousel";
import CarouselTestimonials from "@/components/CarouselTestimonials";
import ModalHome from "@/components/ModalHome";
import styles from '../styles/Home.module.css';
import useVisibility from "@/hooks/useVisibility";
import InfiniteSlider from "@/components/InfiniteSlider";

export default function Home() {


  // Referencias y visibilidad para cada sección
  const refNosotros = useRef(null);
  const refProductos = useRef(null);
  const refCursosColum1 = useRef(null); // Nueva sección
  const refCursosColum2 = useRef(null); // Nueva sección
  const refReferencias = useRef(null); // Nueva sección

  // Usamos el custom hook para cada sección}
  const isVisibleNosotros = useVisibility(refNosotros);
  const isVisibleProductos = useVisibility(refProductos);
  const isVisibleCursosColum1 = useVisibility(refCursosColum1);
  const isVisibleCursosColum2 = useVisibility(refCursosColum2);
  const isVisibleReferencias = useVisibility(refReferencias);


  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div>
        <Hero/>
        {/* seccion nosotros */}
        <div ref={refNosotros} className={`container mx-auto px-6 lg:px-20 grid grid-cols-1 space-y-3 py-10 relative transform transition-all duration-1000 ease-out 
          ${isVisibleNosotros ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          <span className="font-semibold text-[#383838] text-lg text-center">¿Quienes somos?</span>
          <h2 className="text-[#ff5a5f] text-center text-4xl font-semibold">No solo enseñamos técnicas,<span className=" block">forjamos artistas</span></h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-5">
            <div className="col-span-1 flex justify-end">
              <PolaroidCarousel/>
            </div>
            <div className="col-auto flex flex-col lg:justify-center items-start space-y-6">            
              <p className="text-[#383838] text-lg lg:w-3/4">
                En nuestra academia especializada en uñas profesionales, fusionamos teoría y práctica con las tendencias más recientes del mundo de las uñas, asegurando que cada estudiante domine técnicas innovadoras y descubra su propio estilo. Nos aliamos con marcas líderes y expertos activos en la industria para ofrecer una formación actualizada, alineada con las verdaderas exigencias del mercado. Aquí no solo aprenderás a crear diseños excepcionales, sino también a construir una carrera sólida, con pasión, creatividad y profesionalismo
              </p>
              <div className="flex flex-row space-x-2">
                <a
                  href="/AboutUs"
                  className="inline-block w-fit bg-[#ff5a5f] text-white px-4 py-2 pr-6 rounded-[25px] font-normal hover:bg-[#ff3b3f] transition"
                >
                  Leer más
                </a>
                <a
                  href="#"
                  className="inline-block w-fit bg-[#383838] text-white px-4 py-2 pr-6 rounded-[25px] font-normal hover:bg-[#212121] transition"
                  onClick={() => setIsOpen(true)}
                >
                  Reservar tu lugar en la próxima clase
                </a>
              </div>
            </div>
          </div> 
          <img src="https://i.postimg.cc/FFq3JLP4/US-3-00-removebg-preview.png" alt="Corta cuticula" className={clsx("hidden md:block absolute top-16 left-[28%] w-20 h-20", styles.flotar)}/>
          <div className="hidden md:block absolute top-10 right-[29%]" style={{transform: 'rotate(15deg)'}}>
            <img src="https://i.postimg.cc/dQmXnJyD/esmalte-de-unas-naranja.png" alt="Esmalte de uñas color naranja" className={clsx("w-20 h-20", styles.flotar)}/>
          </div>
        </div>
        {/* seccion productos */}
        <div ref={refProductos} className={`bg-[#ff5a5f] mt-32 transform transition-all duration-1000 ease-out 
            ${isVisibleProductos ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 px-6 lg:px-20">
            <div className="text-[#fff] text-lg space-y-3 py-5">
              <h3 className="text-3xl font-semibold">Proximamente llega nuestra tienda online</h3>
              <p className="w-[95%]">
                Nuestra tienda en línea diseñada para profesionales de uñas. Encuentra productos de alta calidad, para potenciar tu talento desde un solo lugar
              </p>            
              <p
                href="#"
                className="inline-block w-fit bg-[#383838] text-white px-4 py-2 pr-6 rounded-[25px] font-normal hover:bg-[#383838] transition"
              >
                Proximamente
              </p>
            </div>
            <div className="overflow-hidden h-52 flex justify-end">
              <img src="https://i.postimg.cc/2jTJ8XDL/snail-colors.png" alt="Pinturas de uñas" className=" w-11/12 lg:w-9/12 h-fit lg:-mt-10 -mr-10 lg:mr-0"/>
            </div>
          </div>
        </div>
        {/* seccion cursos */}
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-5 px-6 lg:px-20 mt-10 lg:mt-16">
          <div ref={refCursosColum1}  className={`col-span-2 space-y-3 flex flex-col justify-center transform transition-all duration-1000 ease-out
            ${isVisibleCursosColum1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
            <span className="font-semibold text-[#383838] text-lg">¡Tu carrera en uñas comienza aquí!</span>
            <h2 className="text-[#ff5a5f] text-4xl font-semibold">Cursos completos y especializados <span className=" block">con enfoque profesional</span></h2>
            <p className="text-[#383838] text-lg lg:w-3/4">En Stef Nails Academy, combinamos teoría, práctica y tendencias actuales para que domines las técnicas más innovadoras del sector. Aprende de la mano de expertos activos en la industria y desarrolla tu propio estilo con el respaldo de marcas líderes</p>
              <a
                href="#"
                className="inline-block w-fit bg-[#ff5a5f] text-white px-4 py-2 pr-6 rounded-[25px] font-normal hover:bg-[#ff3b3f] transition"
                onClick={() => setIsOpen(true)}
              >
                Reservar tu lugar en la próxima clase
              </a>
          </div>
          <div ref={refCursosColum2} className={`col-span-3 mt-10 lg:mt-0 transform transition-all duration-1000 ease-out
            ${isVisibleCursosColum2 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}`}>
            <div className="grid grid-rows-2 gap-4" style={{ gridTemplateRows: '1fr 2fr' }}>
              <div className="row-span-1 order-2 md:order-1">
                <div className=" grid grid-cols-2 lg:grid-cols-4 gap-2">
                  <div className="bg-[#ff5a5f] p-4 w-full h-40 col-span-1 relative overflow-hidden group">
                    <img src="https://i.postimg.cc/bJF741Pg/icono-cortaunas.png"
                      alt="Imagen" 
                      className="absolute bottom-0 right-0 w-1/2 object-cover transition-transform transform group-hover:scale-110 group-hover:rotate-45"
                    />
                    <div className="absolute bottom-8 text-white">
                      <div className="w-1/2 h-1 bg-white mb-2"></div>
                      <h4 className="text-lg font-semibold mb-1">Formación práctica</h4>
                      <p className="text-sm">Aprende haciendo desde el primer día</p>
                    </div>
                  </div>
                  <div className="bg-[#f34f55] p-4 w-full h-40 col-span-1 relative overflow-hidden group">
                    <img src="https://i.postimg.cc/jjCbhyDs/icono-cortacuticula.png"
                      alt="Imagen" 
                      className="absolute bottom-0 right-0 w-1/2 object-cover transition-transform transform group-hover:scale-110 group-hover:rotate-45"
                    />
                    <div className="absolute bottom-8 text-white">
                      <div className="w-1/2 h-1 bg-white mb-2"></div>
                      <h4 className="text-lg font-semibold mb-1">Técnicas actualizadas</h4>
                      <p className="text-sm">Siempre a la vanguardia del diseño de uñas</p>
                    </div>
                  </div>
                  <div className="bg-[#e03e43] p-4 w-full h-40 col-span-1 relative overflow-hidden group">
                    <img src="https://i.postimg.cc/bvfxx9Cn/icono-pintaunas.png"
                      alt="Imagen" 
                      className="absolute bottom-0 right-0 w-1/2 object-cover transition-transform transform group-hover:scale-110 group-hover:rotate-45"
                    />
                    <div className="absolute bottom-8 text-white">
                      <div className="w-1/2 h-1 bg-white mb-2"></div>
                      <h4 className="text-lg font-semibold mb-1">Certificación</h4>
                      <p className="text-sm">Recibe un diploma que respalda tus habilidades</p>
                    </div>
                  </div>
                  <div className="bg-[#c22e33] p-4 w-full h-40 col-span-1 relative overflow-hidden group">
                    <img src="https://i.postimg.cc/QCv9Xjv7/icono-unaspintadas.png"
                      alt="Imagen" 
                      className="absolute bottom-0 right-0 w-1/2 object-cover transition-transform transform group-hover:scale-110 group-hover:rotate-45"
                    />
                    <div className="absolute bottom-8 text-white">
                      <div className="w-1/2 h-1 bg-white mb-2"></div>
                      <h4 className="text-lg font-semibold mb-1">Comunidad exclusiva</h4>
                      <p className="text-sm">Comparte, aprende y crece junto a otras nail artists</p>
                    </div>
                  </div>
                </div>
              </div>  
              <div className="row-span-1 order-1 md:order-2">
                <div className="grid grid-cols-4"> 
                  <div className="col-span-2 lg:col-span-1 flex items-center justify-center">
                    {/* <img src="https://i.postimg.cc/GpRdG1qP/logo-stefnails.png" alt="Logo Stef Nails" className=" w-[10vw] h-[10vw]"/> */}
                    <div>
                    <span className="block text-6xl tracking-widest font-bold bg-gradient-to-r from-red-300 via-red-400 to-red-500 bg-clip-text text-transparent">
                      STEF 
                    </span>
                    <span className="block text-5xl tracking-wider font-bold bg-gradient-to-r from-red-300 via-red-400 to-red-500 bg-clip-text text-transparent">
                      NAILS 
                    </span>
                    <span className="block text-3xl font-bold bg-gradient-to-r from-red-300 via-red-400 to-red-500 bg-clip-text text-transparent">
                      ACADEMY 
                    </span>
                    </div>
                  </div>
                  <div className=" col-span-2 lg:col-span-3">
                    {/* cinta de fotos */}
                    <InfiniteSlider/>
                  </div>
                </div>     
              </div>  
            </div>  
          </div>        
        </div>
        {/* seccion testimonios */}
        <div ref={refReferencias} className={`container mx-auto grid grid-cols-1 px-6 lg:px-20 mt-10 lg:mt-0 overflow-hidden transform transition-all duration-1000 ease-out 
            ${isVisibleReferencias ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          <div className="text-center space-y-3">
            <span className="font-semibold text-[#383838] text-lg">Referencias</span>
            <h2 className="text-[#ff5a5f] text-center text-4xl font-semibold">¿Qué opinan <span className=" block">nuestros alumnos? </span></h2>
            <div className=" py-10">
              <CarouselTestimonials/>
            </div>

            <div className=" p-10">
              
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      <ModalHome isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
