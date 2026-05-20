import { FaTiktok, FaInstagram, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-8 px-4 sm:px-6 mt-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo y Descripción */}
        <div className="md:col-span-2">
          <img
            src="https://i.postimg.cc/GpRdG1qP/logo-stefnails.png"
            alt="Stef Nails Logo"
            className="w-24 mb-4"
          />
          <p className="text-sm leading-relaxed max-w-md">
            Donde el arte de las uñas se convierte en tu profesión. Transforma tu talento en un negocio de éxito.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="https://www.facebook.com/profile.php?id=61561978680089" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook className="text-xl hover:text-blue-500 cursor-pointer" />
            </a>
            <a href="https://www.tiktok.com/@stefnail" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <FaTiktok className="text-xl hover:text-red-500 cursor-pointer" />
            </a>
            <a href="https://www.instagram.com/stefnails/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="text-xl hover:text-pink-500 cursor-pointer" />
            </a>
          </div>
        </div>

        {/* Servicio + Productos */}
        <div className="space-y-6">
          <div>
            <h4 className="font-bold mb-3">Servicio</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:underline cursor-pointer">
                <a href="/Courses">Cursos</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Productos</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-500">Tienda (Próximamente)</li>
            </ul>
          </div>
        </div>

        {/* Compañía + Soporte */}
        <div className="space-y-6">
          <div>
            <h4 className="font-bold mb-3">Compañía</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:underline cursor-pointer">
                <a href="/AboutUs">Nosotros</a>
              </li>
              <li className="hover:underline cursor-pointer">
                <a href="/ContactUs">Contacto</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Soporte</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:underline cursor-pointer">
                <a href="/Faq">Preguntas frecuentes</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Línea de separación */}
      <div className="border-t border-gray-300 my-6 max-w-7xl mx-auto"></div>

      {/* Texto inferior */}
      <div className="text-center text-xs sm:text-sm px-2">
        <p>
          Stef Nails © 2025 · Power by{' '}
          <span className="font-semibold">
            <a href="https://www.instagram.com/codemallow/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Codemallow
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
