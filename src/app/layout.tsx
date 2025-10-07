import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlobalLoading from "@/components/GlobalLoading";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/constants";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "Arial"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://flik.cl"),
  title: {
    default: SITE_TITLE,
    template: "%s | " + SITE_TITLE,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
      description: SITE_DESCRIPTION,
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
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
