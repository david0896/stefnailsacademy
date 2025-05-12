import styles from '@/styles/infiniteSlider.module.css';
import { useMemo } from 'react';
import clsx from 'clsx';

  const images = [
    "https://i.postimg.cc/FHZqLpjC/flyer-curso-soft-gel.jpg",
    "https://i.postimg.cc/FHZqLpjC/flyer-curso-soft-gel.jpg",
    "https://i.postimg.cc/FHZqLpjC/flyer-curso-soft-gel.jpg",
    "https://i.postimg.cc/FHZqLpjC/flyer-curso-soft-gel.jpg",
    "https://i.postimg.cc/FHZqLpjC/flyer-curso-soft-gel.jpg",
    "https://i.postimg.cc/FHZqLpjC/flyer-curso-soft-gel.jpg",
    "https://i.postimg.cc/FHZqLpjC/flyer-curso-soft-gel.jpg",
    "https://i.postimg.cc/FHZqLpjC/flyer-curso-soft-gel.jpg",
  ];

  const imagesDos = [
    "https://i.postimg.cc/K8pxGWTD/tecnico-aplicador.jpg",
    "https://i.postimg.cc/K8pxGWTD/tecnico-aplicador.jpg",
    "https://i.postimg.cc/K8pxGWTD/tecnico-aplicador.jpg",
    "https://i.postimg.cc/K8pxGWTD/tecnico-aplicador.jpg",
    "https://i.postimg.cc/K8pxGWTD/tecnico-aplicador.jpg",
    "https://i.postimg.cc/K8pxGWTD/tecnico-aplicador.jpg",
    "https://i.postimg.cc/K8pxGWTD/tecnico-aplicador.jpg",
    "https://i.postimg.cc/K8pxGWTD/tecnico-aplicador.jpg",
  ]; 

const InfiniteCintas = () => {

  return (
    <div className={styles.marco}>
                    <div className={styles.cintaWrapper}>
                      <div className={styles.cinta}>
                        <div className={styles.cintaCarril}>
                          {images.map((src, index) => (
                            <img key={index} src={src} alt={`Imagen ${index + 1}`} className={styles.cintaImagen} />
                          ))}
                        </div>
                      </div>
                      <div className={clsx("hidden lg:flex",styles.cinta)}>
                        <div className={styles.cintaCarrilInvertido}>
                          {imagesDos.map((src, index) => (
                            <img key={index} src={src} alt={`Imagen ${index + 1}`} className={styles.cintaImagen} />
                          ))}
                        </div>
                      </div>
                      <div className={clsx("hidden lg:flex",styles.cinta)}>
                        <div className={styles.cintaCarril}>
                          {images.map((src, index) => (
                            <img key={index} src={src} alt={`Imagen ${index + 1}`} className={styles.cintaImagen} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
  );
};

export default InfiniteCintas;