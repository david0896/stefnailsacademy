import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok, FaUserCircle } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useSession, signOut } from "next-auth/react";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  // Solo nos importa la sesión de STUDENT en el sitio público
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated' && session?.user?.role === 'STUDENT';
  const firstName = session?.user?.name?.split(' ')[0] ?? '';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    if (!isUserOpen) return;
    const close = () => setIsUserOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [isUserOpen]);

  const handleLogout = (e) => {
    e?.preventDefault?.();
    setIsUserOpen(false);
    setIsMenuOpen(false);
    signOut({ callbackUrl: '/' });
  };

  // ── Bloque auth para desktop ─────────────────────────────────────
  const AuthDesktop = () => {
    if (status === 'loading') {
      return <div className="w-28 h-10 bg-gray-100 rounded-full animate-pulse" aria-hidden />;
    }

    if (isAuthenticated) {
      return (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setIsUserOpen((v) => !v)}
            className="flex items-center gap-2 text-base text-[#383838] hover:text-[#ff5a5f] transition-colors font-medium"
          >
            <FaUserCircle className="text-2xl" />
            <span>{firstName || 'Mi cuenta'}</span>
          </button>
          {isUserOpen && (
            <div className="absolute right-0 mt-3 w-52 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50">
              <Link
                href="/Courses"
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setIsUserOpen(false)}
              >
                Mis cursos
              </Link>
              <Link
                href="/mi-perfil"
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setIsUserOpen(false)}
              >
                Mi perfil
              </Link>
              <div className="border-t border-gray-100 my-1" />
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      );
    }

    // Sin sesión
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-base text-[#383838] hover:text-[#ff5a5f] transition-colors font-medium"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/registro"
          className="text-base bg-[#ff5a5f] text-white px-5 py-2 rounded-full hover:bg-[#ff3b3f] transition-colors font-medium"
        >
          Registrarme
        </Link>
      </div>
    );
  };

  // ── Bloque auth para mobile ─────────────────────────────────────
  const AuthMobile = () => {
    if (status === 'loading') return null;

    if (isAuthenticated) {
      return (
        <div className="flex flex-col items-center gap-3 mt-6 pt-6 border-t border-gray-200 w-full">
          <div className="flex items-center gap-2 text-[#383838]">
            <FaUserCircle className="text-2xl" />
            <span className="font-medium text-lg">{firstName || 'Mi cuenta'}</span>
          </div>
          <Link
            href="/Courses"
            className="text-base text-[#383838]"
            onClick={() => setIsMenuOpen(false)}
          >
            Mis cursos
          </Link>
          <Link
            href="/mi-perfil"
            className="text-base text-[#383838]"
            onClick={() => setIsMenuOpen(false)}
          >
            Mi perfil
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="text-base text-red-600 font-medium"
          >
            Cerrar sesión
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center gap-4 mt-6 pt-6 border-t border-gray-200 w-full">
        <Link
          href="/login"
          className="text-lg text-[#383838] font-medium"
          onClick={() => setIsMenuOpen(false)}
        >
          Iniciar sesión
        </Link>
        <Link
          href="/registro"
          className="text-lg bg-[#ff5a5f] text-white px-6 py-2.5 rounded-full font-medium"
          onClick={() => setIsMenuOpen(false)}
        >
          Registrarme
        </Link>
      </div>
    );
  };

  return (
    <div className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""} border-b-[1px] border-[#242424] transition-all duration-300`}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <img src="https://i.postimg.cc/pdhQfKMg/steflogo-1.png" className={styles.logoText} alt="Stef Nails Academy" />
        </Link>
      </div>
      <nav className={`${styles.navLinks} ${isMenuOpen ? styles.showMenu : ""}`}>
        <ul>
          <li><Link href="/">Inicio</Link></li>
          <li><Link href="/AboutUs">Nosotros</Link></li>
          <li><Link href="/Courses">Cursos</Link></li>
          <li><Link href="/ContactUs">Contacto</Link></li>
        </ul>
      </nav>

      {/* Auth en desktop */}
      <div className="hidden md:flex items-center">
        <AuthDesktop />
      </div>

      {/* Botón hamburguesa: solo visible cuando el menú está cerrado.
          Cuando está abierto, el botón de cerrar (X) vive dentro del drawer
          para garantizar que sea clickeable encima de todo. */}
      {!isMenuOpen && (
        <div
          className={styles.hamburger}
          onClick={() => setIsMenuOpen(true)}
          aria-label="Abrir menú"
        >
          <div />
          <div />
          <div />
        </div>
      )}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          {/* Header del drawer: logo + X de cerrar */}
          <div className="flex items-center justify-between w-full mb-4">
            <div className={styles.logoContainer}>
              <img
                src="https://i.postimg.cc/pdhQfKMg/steflogo-1.png"
                className={styles.logoText}
                alt="Stef Nails Academy"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Cerrar menú"
              className="p-2 -mr-2 text-[#ff5a5f] hover:text-[#ff3b3f] transition-colors"
            >
              <IoMdClose className="w-7 h-7" />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center flex-1">
            <ul>
              <li><Link href="/" onClick={() => setIsMenuOpen(false)}>Inicio</Link></li>
              <li><Link href="/AboutUs" onClick={() => setIsMenuOpen(false)}>Nosotros</Link></li>
              <li><Link href="/Courses" onClick={() => setIsMenuOpen(false)}>Cursos</Link></li>
              <li><Link href="/ContactUs" onClick={() => setIsMenuOpen(false)}>Contacto</Link></li>
            </ul>
            <AuthMobile />
          </div>
          <div className={styles.socialIcons}>
            <FaFacebook />
            <FaInstagram />
            <FaTiktok />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
