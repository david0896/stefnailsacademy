import { useEffect, useState } from "react";

export default function BlurBackgroundSection({
  lowQualityImageUrl,
  fullImageUrl,
  className = "",
  children,
}) {
  const [loaded, setLoaded] = useState(false);

  // Efecto para precargar la imagen real sin mostrarla aún
  useEffect(() => {
    const img = new Image();
    img.src = fullImageUrl;

    // Cuando se carga correctamente
    img.onload = () => {
      setLoaded(true);
    };

    // Opcional: en caso de error (para evitar que quede en estado intermedio)
    img.onerror = () => {
      console.error("Error cargando la imagen:", fullImageUrl);
      setLoaded(true); // o puedes mantenerlo en false
    };
  }, [fullImageUrl]);

  return (
    <div
      className={`relative w-full h-screen bg-center bg-cover overflow-hidden ${className}`}
    >
      {/* Imagen borrosa inicial (ligera) */}
      <div
        className={`absolute inset-0 bg-center bg-cover transition-opacity duration-700 scale-110 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage: `url(${lowQualityImageUrl})`,
          filter: "blur(20px)",
          zIndex: 0,
        }}
      />

      {/* Imagen final, nítida (se activa al estar completamente cargada) */}
      <div
        className={`absolute inset-0 bg-center bg-cover transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: `url(${fullImageUrl})`,
          zIndex: 1,
        }}
      />

      {/* Contenido que quieras renderizar encima */}
      <div className="relative w-full h-screen bg-center bg-cover overflow-hidden z-[9]">{children}</div>
    </div>
  );
}
