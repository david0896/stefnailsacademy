import { useEffect, useState } from "react";

export default function BlurImage({
  lowQualitySrc,
  fullQualitySrc,
  alt = "",
  className = "",
  ...props
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = fullQualitySrc;
    img.onload = () => setLoaded(true);
    img.onerror = () => {
      console.error("Error cargando la imagen:", fullQualitySrc);
      setLoaded(true); // Opcional: mantener borrosa si falla
    };
  }, [fullQualitySrc]);

  return (
    <div className={`relative ${className}`} style={{ display: "inline-block" }}>
      {/* Imagen borrosa */}
      <img
        src={lowQualitySrc}
        alt={alt}
        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
          loaded ? "opacity-0" : "opacity-100"
        } blur-xl scale-110`}
        draggable={false}
      />

      {/* Imagen final */}
      <img
        src={fullQualitySrc}
        alt={alt}
        className={`relative w-full h-full object-cover transition-opacity duration-700 ${className} ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        draggable={false}
        {...props}
      />
    </div>
  );
}
