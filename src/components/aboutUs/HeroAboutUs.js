// components/Hero.js
import { useEffect, useState } from "react";
import { FaHandSparkles, FaHandPaper, FaPalette, FaGem } from 'react-icons/fa';
import { GiNailedFoot, GiNails } from "react-icons/gi";
import clsx from "clsx";
import styles from '../../styles/Hero.module.css';


const HeroAboutUs = () => {

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Activa la animación al cargar el componente
        setIsVisible(true);
    }, []);

    return (
        <section
            className="relative w-full h-[90vw] lg:h-[30vw] bg-[#fdebeb]"
        >
            <div className="relative lg:absolute inset-0 flex items-center">
                {/* **************** card **************** */}
                <div className={clsx(`${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-1000 ease-in-out bg-transparent text-[#ff5a5f] text-3xl rounded-full p-2 hidden lg:block absolute bottom-10 lg:bottom-auto lg:top-[8vw] right-[35vw] lg:right-[24vw]`, styles.heroFloat)}>
                    <FaHandSparkles />
                </div> 
                <div className={clsx(`${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-1000 ease-in-out bg-transparent text-[#ff5a5f] text-2xl rounded-full p-2 hidden lg:block absolute bottom-10 lg:bottom-auto lg:top-[7vw] right-[35vw] lg:right-[28vw]`, styles.heroFloat)}>
                    <FaHandPaper />
                </div> 
                <div className={clsx(`${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-1000 ease-in-out bg-transparent text-[#ff5a5f] text-3xl rounded-full p-2 hidden lg:block absolute bottom-10 lg:bottom-[10vw] lg:top-auto left-[35vw] lg:left-[24vw] `, styles.heroFloat)}>
                    <FaGem />
                </div> 
                <div className="container mx-auto px-6 mt-8 lg:mt-0 lg:px-20 grid grid-cols-1 items-center h-full">
                    {/* Columna de texto */}
                    <div className={clsx("flex flex-col col-span-1 justify-center items-center space-y-6 text-left h-full -mb-96 lg:mb-0", styles.heroSvg1FadeinLeft)}>
                        <h1 className="text-5xl font-bold text-[#ff5a5f]">
                            Conoce más sobre nosotros
                        </h1>
                        <p className="text-lg text-[#383838] max-w-2xl lg:text-center mx-auto lg:mx-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
                            perspiciatis unde omnis iste natus error sit voluptatem
                            accusantium.
                        </p>                                
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroAboutUs;

