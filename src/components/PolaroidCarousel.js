import React, { useState, useEffect } from "react";
import styles from "../styles/PolaroidCarousel.module.css";
import clsx from "clsx";
import PolaroidCard from "./PolaroidCard";
import SvgComponent from "./SvgComponent";

const PolaroidCarousel = () => {
  const images = [
    {
      id: 1,
      url: "https://bcw-media.s3.ap-northeast-1.amazonaws.com/text_to_image_v6_poster_01_f038887d26.jpg",
    },
    {
      id: 2,
      url: "https://img.freepik.com/fotos-premium/arte-fondo-retrato-mujer-paisaje-urbano-neon_862994-83628.jpg",
    },
    {
      id: 3,
      url: "https://img.freepik.com/fotos-premium/arte-fondo-retrato-mujer-paisaje-urbano-neon_862994-83706.jpg",
    },
  ];

  const [currentOrder, setCurrentOrder] = useState([0, 1, 2]);

  useEffect(() => {
    const svg = document.getElementById('my-svg');
    svg?.beginElement();

    const interval = setInterval(() => {
      setCurrentOrder((prevOrder) => {
        const newOrder = [...prevOrder];
        newOrder.push(newOrder.shift());
        return newOrder;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.carouselContainer} style={{ position: "relative" }}>
      {/* SVG para la "C" detrás del carrusel */}
      <SvgComponent />

      {/* Carrusel principal */}
      {currentOrder.map((index, position) => (
        <PolaroidCard
          key={images[index].id}
          imageUrl={images[index].url}
          customClass={styles[`cardPosition${position}`]}
        />
      ))}

      {/* Imágenes decorativas */}
      <img
        src="https://i.postimg.cc/mDFjsRP1/pintura-color-fucsia.png"
        alt="Pintura de uñas"
        className={clsx("hidden lg:flex",styles.decorativeImage)}
        style={{ left: "15%", bottom: "-8rem", zIndex: 3 }}
      />
      <img
        src="https://i.postimg.cc/Hnd5j7Y5/flor-rosada.png"
        alt="Flor de referencia"
        className={clsx("hidden lg:flex", styles.decorativeImage)}
        style={{ right: "40%", bottom: "-8rem", zIndex: 2 }}
      />
    </div>
  );
};

export default PolaroidCarousel;
