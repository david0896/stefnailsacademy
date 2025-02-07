import { FaWhatsapp, FaYoutube, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo y Descripción */}
        <div>
          <img
            src="https://i.postimg.cc/GpRdG1qP/logo-stefnails.png"
            alt="Stef Nails Logo"
            className="w-24 mb-4"
          />
          <p className="text-sm leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt.
          </p>
          <div className="flex space-x-4 mt-4">
            <FaWhatsapp className="text-xl hover:text-green-500 cursor-pointer" />
            <FaYoutube className="text-xl hover:text-red-500 cursor-pointer" />
            <FaInstagram className="text-xl hover:text-pink-500 cursor-pointer" />
          </div>
        </div>

        <div>
        </div>

        <div className=" col-span-2">
          <div className=" grid grid-cols-2">
            <div>
{/* Enlaces de Servicio */}
<div>
          <h4 className="font-bold mb-4">Servicio</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:underline cursor-pointer">Cursos</li>
          </ul>
        </div>

        {/* Enlaces de Productos */}
        <div>
          <h4 className="font-bold mb-4 mt-6">Productos</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:underline cursor-pointer">Tienda ( Proximamente )</li>
          </ul>
        </div>
            </div>
            <div>
        {/* Enlaces de Compañía y Soporte */}
        <div>
          <h4 className="font-bold mb-4">Compañía</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:underline cursor-pointer">Nosotros</li>
            <li className="hover:underline cursor-pointer">Galería</li>
            <li className="hover:underline cursor-pointer">Contacto</li>
          </ul>
          <h4 className="font-bold mt-6 mb-4">Soporte</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:underline cursor-pointer">
              <a href="/PreguntasFrecuentes">Preguntas frecuentes</a>
            </li>
          </ul>
        </div>
            </div>
          </div>
        </div>
      </div>

      {/* Línea de separación */}
      <div className="border-t border-gray-300 my-6"></div>

      {/* Texto inferior */}
      <div className="text-center text-sm">
        <p>
          Stef Nails 2025 | Power By: <span className="font-semibold">codemallow</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
