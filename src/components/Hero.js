// components/Hero.js
import { useEffect, useState } from "react";
import { FaPercent } from 'react-icons/fa';
import clsx from "clsx";
import styles from '../styles/Hero.module.css';
import Countdown from "./Countdown";
import ModalHome from "@/components/ModalHome";
import BlurBackgroundSection from "./BlurBackgroundSection";
import BlurImage from "./BlurImage";


const Hero = () => {

    const [isVisible, setIsVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Activa la animación al cargar el componente
        setIsVisible(true);
    }, []);

    return (
 
        <>
        <BlurBackgroundSection
            lowQualityImageUrl="https://i.postimg.cc/XJtR5T4K/first-banner-blur.jpg"  // Imagen ligera, difuminada
            fullImageUrl="https://i.postimg.cc/fT1P7Mzt/background-u-as-profesionales.png"  // Imagen real
        >
            <div className="absolute inset-0 flex items-center">                
                <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
                    {/* Columna de texto */}
                    <div className={clsx("flex flex-col col-span-1 justify-center space-y-6 text-left h-full -mb-96 lg:mb-0", styles.heroSvg1FadeinLeft)}>
                        <h1 className="text-5xl font-bold text-[#ff5a5f]">
                            Academia especializada en uñas profesionales
                        </h1>
                        <h2 className="text-3xl text-[#383838]">
                            Domina las técnicas de uñas más innovadoras
                        </h2>
                        <p className="text-lg text-[#383838] max-w-2xl mx-auto lg:mx-0">
                            En nuestra academia profesional de uñas, te ofrecemos cursos prácticos presenciales u online, personalizados y grupales para que te conviertas en un experto/a en diseño y elaboración de uñas.
                        </p>
                        <a
                            href="#"
                            className="inline-block w-fit bg-[#ff5a5f] text-white px-4 py-2 pr-6 rounded-[25px] text-lg font-medium hover:bg-[#ff3b3f] transition"
                            onClick={() => setIsOpen(true)}
                        >
                            Reserva tu lugar en la próxima clase
                        </a>
                                    
                    </div>

                    {/* Columna de imagen */}
                    <div className="relative h-full flex col-span-1 justify-center items-end overflow-hidden">
                        
                        {/* Countdown */}
                        <div className={clsx("absolute px-8 py-10 hidden lg:grid content-end z-20", styles.heroSvg1FadeinLeft)}>
                            <div className="grid grid-cols-5 rounded-lg border-solid border-2 border-[#ff5a5f]">
                                <div className="col-span-2 bg-[#ff5a5f]/60 backdrop-blur-sm">
                                <div className="bg-[#ff5a5f] p-2 h-full border-solid border-2 border-[#ffffff] rounded-lg">
                                    <p className=" text-white font-bold text-center text-3xl">Febrero 28 <span className="block font-normal text-base">Siguiente clase</span></p>
                                </div>
                                </div>
                                <div className=" col-span-3 p-2 bg-[#ff5a5f]/60 backdrop-blur-sm">
                                <Countdown/>
                                </div>
                                <div className=" col-span-5 p-2 bg-[#ff5a5f]/60 backdrop-blur-sm border-t-2 border-solid border-[#ff5a5f]">
                                <p className=" text-white font-medium">Clase programada: Marzo 12</p>
                                <p className=" text-white font-normal text-sm uppercase">soft gel nivel 2</p>
                                </div>
                            </div>
                        </div> 
                        <div className={`${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-1000 ease-in-out absolute -left-5 px-8 py-10 grid lg:hidden content-start z-20 bottom-28`}>
                            <div className="grid grid-cols-5 rounded-lg">
                                <div className="col-span-3 bg-[#ff5a5f]/60 backdrop-blur-sm rounded-lg">
                                    <div className="bg-[#ff5a5f] p-2 h-full border-solid border-2 border-[#ffffff] rounded-lg">
                                        <p className=" text-white font-bold text-center text-2xl">Enero 31 <span className="block font-normal text-base">Siguiente clase</span></p>
                                    </div>
                                </div>                        
                            </div>
                        </div>
                        {/* Imagen de la instructora */}
                        <BlurImage
                            lowQualitySrc="https://i.postimg.cc/xdbsNgTM/instructor.jpg"
                            fullQualitySrc="https://i.postimg.cc/KjJrYrk3/instructor.png"
                            alt="Instructora profesional Stef"
                            className={clsx("relative w-[72vw] h-[76vw] lg:w-[40vw] lg:h-[40vw] z-[8]", styles.heroFadeinLeft)}
                        />

                        {/* SVGs detrás */}
                        <div className={clsx("absolute -bottom-2 lg:-bottom-16 left-32 lg:left-36 w-[18vw] h-[18vw] lg:w-[35vw] lg:h-[35vw]", styles.heroSvg1FadeinLeft)}>
                            <svg
                                id="eNUCqyYSVLl1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                viewBox="0 0 300 300"
                                shapeRendering="geometricPrecision"
                                textRendering="geometricPrecision"
                                project-id="a09e4b2f33b749a5a0ddc78a7d6f2e87"
                                export-id="c4af66c7edde4f2499fe799c15647b7e"
                                cached="false"
                            >
                                <rect
                                    width={179.026217}
                                    height={273.782772}
                                    rx={41}
                                    ry={41}
                                    transform="matrix(1 0 0 1.125856 69.850188 8.988626)"
                                    fill="none"
                                    stroke="rgba(55,55,55,0.43)"
                                />
                            </svg>
                        </div>
                        <div className={clsx("absolute -bottom-12 left-28 lg:left-32 w-[20vw] h-[20vw] lg:w-[35vw] lg:h-[35vw]", styles.heroSvg2FadeinLeft)}>
                            <svg
                                id="evxATmnOUFY1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                viewBox="0 0 300 300"
                                shapeRendering="geometricPrecision"
                                textRendering="geometricPrecision"
                                project-id="a09e4b2f33b749a5a0ddc78a7d6f2e87"
                                export-id="3f5991e3715c4bb1a91dc9c8fbf7793b"
                                cached="false"
                            >
                                <rect
                                    width={179.026217}
                                    height={273.782772}
                                    rx={41}
                                    ry={41}
                                    transform="matrix(1 0 0 1.125856 69.850188 8.988626)"
                                    fill="rgba(255,90,95,0.37)"
                                    strokeWidth={0}
                                />
                            </svg>
                        </div>
                    </div>
                </div>
                {/* **************** card **************** */}
                <div className={clsx(`${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-1000 ease-in-out absolute rounded-md grid grid-cols-2 z-30 w-[55vw] lg:w-[17vw] bottom-10 lg:bottom-auto lg:top-[12vw] right-[35vw] lg:right-[5vw] bg-[#fff]/60 backdrop-blur-sm p-1 py-3`, styles.heroFloat)} style={{ gridTemplateColumns: '1fr 2fr' }}>
                    <div className="flex items-center justify-center">
                        <div className=" bg-gray-900 text-white text-3xl rounded-full p-2 ">
                            <FaPercent />
                        </div>                            
                    </div>
                    <div className="text-[#383838] space-y-2">
                        <h4 className="font-bold text-sm">Productos para uñas</h4>
                        <p className="text-sm">
                            Distribuimos artículos para uñas de las marcas más reconocidas
                        </p>
                    </div>
                </div>
            </div>
            
        </BlurBackgroundSection>
        {/* Modal */}
        <ModalHome isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default Hero;

