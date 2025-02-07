import React, { useState, useEffect } from "react";
import styles from "../styles/PolaroidCarousel.module.css";
import clsx from "clsx";
import PolaroidCard from "./PolaroidCard";
import SvgComponent from "./SvgComponent";

const PolaroidCarousel = () => {
  const images = [
    {
      id: 1,
      url: "https://i.postimg.cc/QdpHV0f9/stefail-graduacion-curso-de-u-as.png",
    },
    {
      id: 2,
      url: "https://i.postimg.cc/9XKMpvSw/stefail-academia-instructoras.png",
    },
    {
      id: 3,
      url: "https://i.postimg.cc/cH8HyhtL/stefail-academia-diploma.png",
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
