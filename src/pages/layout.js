import Navbar from "@/components/Navbar";
import { Montserrat, Nunito, Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], // Todos los grosores
  variable: "--font-montserrat",
  style: ['normal', 'italic'], // Estilos disponibles
  subsets: ['latin', 'latin-ext'], // Subconjuntos
  display: 'swap', // Mejora la carga y evita el FOUT
});

// Configuración de Nunito con todos los pesos
const nunito = Nunito({
  weight: ['200', '300', '400', '600', '700', '800', '900'], // Todos los grosores de Nunito
  variable: "--font-nunito",
  style: ['normal', 'italic'], // Estilos disponibles
  subsets: ['latin', 'latin-ext'], // Subconjuntos
  display: 'swap', // Mejora la carga
});

const Layout = ({ children }) => {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${nunito.variable} antialiased`}>
        <Navbar />
        <main>{children}</main>
        <Footer/>
    </div>
  );
};

export default Layout;
