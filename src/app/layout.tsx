import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "Arial"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://flik.cl"),
  title: "Flik - Blog de tecnología y desarrollo",
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
    title: "Flik - Blog de tecnología y desarrollo",
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
        <meta property="fm-admin" content="61551505805464" />
        <link rel="icon" href="/favicon.ico" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <Script id="disable-ga-if-cookie" strategy="beforeInteractive">
          {`
          if (document.cookie.includes('ignore_tracking=true')) {
            window['ga-disable-G-T1ZKQDYNZZ'] = true;
          }
        `}
        </Script>

        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              id="cookieyes"
              src="https://cdn-cookieyes.com/client_data/8eefd0d2385ccb3becdf9718/script.js"
              strategy="lazyOnload"
            />
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=G-T1ZKQDYNZZ`}
              strategy="lazyOnload"
              defer
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-T1ZKQDYNZZ');
              `}
            </Script>
          </>
        )}
      </head>

      <body className={"bg-gray-50 text-gray-800"}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-6 sm:py-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
