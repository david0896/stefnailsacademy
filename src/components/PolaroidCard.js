import React from 'react';

const PolaroidCard = ({ imageUrl, customClass }) => {
  return (
    <div className="">
      <div className={`bg-white shadow-[#e56966] shadow-2xl rounded-sm w-72 h-96 relative p-5 ${customClass}`}>
        {/* Área de imagen (placeholder azul) */}
        <div className="bg-blue-500 w-full h-3/4 flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt="Cursos de manicure especializados"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Parte inferior con mayor borde */}
        <div className="absolute bottom-0 w-auto h-1/4 bg-white border-t-4 border-gray-300 rounded-b-lg flex justify-center items-center"></div>
      </div>
    </div>
  );
};

export default PolaroidCard;




