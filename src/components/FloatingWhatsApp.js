import { FaWhatsapp } from 'react-icons/fa';
import styles from '../styles/FloatingWhatsApp.module.css';

/**
 * Botón flotante de WhatsApp, fijo bottom-right.
 * Se monta a través del Layout en todas las páginas públicas
 * (no aparece en /backoffice/* porque ese layout es distinto).
 */
export default function FloatingWhatsApp({
  href = 'https://wa.link/pxwwz5',
  label = 'Escríbenos por WhatsApp',
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={`group fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-[60] flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-110 ${styles.pulse}`}
    >
      <FaWhatsapp className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />

      <span className="hidden md:block absolute right-full mr-3 whitespace-nowrap bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
        {label}
      </span>
    </a>
  );
}
