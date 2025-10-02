import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlobalLoading from "@/components/GlobalLoading";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "Arial"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://flik.cl"),
  title: {
    default: "Blog de tecnología en español",
    template: "%s | Blog de tecnología en español",
  },
  description:
    "Flik es un blog de tecnología en español con artículos sobre desarrollo, IA, seguridad, herramientas y experiencias reales.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Blog de tecnología en español",
    description:
      "Flik es un blog de tecnología en español con artículos sobre desarrollo, IA, seguridad, herramientas y experiencias reales.",
    url: "https://flik.cl",
    siteName: "Flik Blog",
    images: [
      {
        url: "/og_logo.png",
        width: 1200,
        height: 630,
        alt: "Flik Blog",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
  other: {
    "script:ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Flik",
      url: "https://www.flik.cl",
      description:
        "Flik es un blog de tecnología en español sobre programación, desarrollo web, inteligencia artificial y seguridad informática.",
      inLanguage: "es",
      author: {
        "@type": "Person",
        name: "Gonzalo",
      },
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.className}>
      <head>
        <link rel="icon" href="/favicon.ico" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />


      </head>

      <body className={"bg-gray-50 text-gray-800"} suppressHydrationWarning>
        <GlobalLoading />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-6 sm:py-8">
            {children}
            <Script id="copy-current-url" strategy="afterInteractive">
          {`
            (function () {
              function copyText(text) {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                  return navigator.clipboard.writeText(text);
                }
                var ta = document.createElement('textarea');
                ta.value = text;
                ta.setAttribute('readonly','');
                ta.style.position = 'absolute';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                return Promise.resolve();
              }

              function handleClick(e) {
                var target = e.target.closest('[data-copy-current-url]');
                if (!target) return;
                e.preventDefault();
                var url = target.getAttribute('data-url') || window.location.href;
                copyText(url).then(function () {
                alert('¡Enlace copiado al portapapeles!');
                  var originalTitle = target.getAttribute('title');
                  target.setAttribute('title', '¡Copiado!');
                  setTimeout(function(){ 
                    if (originalTitle) target.setAttribute('title', originalTitle);
                    else target.removeAttribute('title');
                  }, 1500);
                }).catch(function(err){
                  console.error('No se pudo copiar la URL:', err);
                });
              }

              document.addEventListener('click', handleClick);
            })();
          `}
        </Script>
            {process.env.NODE_ENV === "production" && (
              <Script
                id="cookieyes"
                src="https://cdn-cookieyes.com/client_data/TU_ID_UNICO/script.js"
                strategy="afterInteractive" // se carga después de que la página se monta
              />
            )}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
