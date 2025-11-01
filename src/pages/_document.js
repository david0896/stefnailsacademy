import { Html, Head, Main, NextScript } from "next/document";
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <link rel="icon" href="/stefnailsfavicon.ico" />
        {/* Aquí es donde va la etiqueta de Google, justo después de <Head> */}
        <Script
          strategy="afterInteractive" // Carga el script después de que la página sea interactiva
          src="https://www.googletagmanager.com/gtag/js?id=G-PDT7QS1K1H" // Tu ID de Google Tag
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PDT7QS1K1H'); // Asegúrate de que este ID coincida con el de arriba
          `}
        </Script>
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
