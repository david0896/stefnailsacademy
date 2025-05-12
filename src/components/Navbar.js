import React, { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""} border-b-[1px] border-[#242424] transition-all duration-300`}>
      <div className={styles.logoContainer}>
        <a href="/">
          <img src="https://i.postimg.cc/pdhQfKMg/steflogo-1.png" className={styles.logoText}/>
        </a>
      </div>
      <nav className={`${styles.navLinks} ${isMenuOpen ? styles.showMenu : ""}`}>
        <ul>
          <li><a href="/">Inicio</a></li>
          <li><a href="/AboutUs">Nosotros</a></li>
          <li><a href="/Courses">Cursos</a></li>
          {/* <li><a href="#tienda">Tienda</a></li> */}
          <li><a href="/ContactUs">Contacto</a></li>
        </ul>
      </nav>
      <div className={styles.whatsappButton}>
        <a href="https://wa.link/pxwwz5" target="_blank" rel="noopener noreferrer">
          <FaWhatsapp className={styles.whatsappIcon} /> WhatsApp
        </a>
      </div>
      <div
        className={styles.hamburger}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <IoMdClose className={styles.closeIcon} /> : (
          <>
            <div />
            <div />
            <div />
          </>
        )}
      </div>
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.logoContainer}>
            <span className={styles.logoText}>Stef</span>
            <span className={styles.logoSubtext}>Nails Academy</span>
          </div>
          <div className="flex items-center justify-center h-screen">
            <ul>
              <li><a href="/">Inicio</a></li>
              <li><a href="/AboutUs">Nosotros</a></li>
              <li><a href="/Courses">Cursos</a></li>
              {/* <li><a href="#tienda">Tienda</a></li> */}
              <li><a href="/ContactUs">Contacto</a></li>
            </ul>
          </div>          
          <div className={styles.socialIcons}>
            <FaFacebook />
            <FaInstagram />
            <FaTwitter />
            <FaWhatsapp />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
