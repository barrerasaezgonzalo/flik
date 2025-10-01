// Footer.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

// extraer esta función
export function getScrollY(): number {
  return window.scrollY || document.documentElement.scrollTop;
}

export default function Footer() {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const y = getScrollY();
    setVisible(y > 200);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible);
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

  return (
    <footer className="bg-gray-100 border-t mt-8 py-6">
      <div className="max-w-4xl mx-auto px-4 flex flex-col gap-6 text-sm text-gray-600">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Flik Blog"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
            </Link>
            <p className="text-gray-600 pt-2">
              Blog de tecnología en español © {new Date().getFullYear()}
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-4">
            <a href="/about" className="hover:text-gray-800">
              Sobre Flik
            </a>
            <a href="/privacy" className="hover:text-gray-800">
              Privacidad
            </a>
            <a href="/terminos" className="hover:text-gray-800">
              Términos
            </a>
            <a href="/tags" className="hover:text-gray-800">
              Tags
            </a>
            <a href="/contact" className="hover:text-gray-800">
              Contacto
            </a>
            <a
              href="https://www.linkedin.com/company/flikcl/"
              target="_blank"
              className="hover:text-gray-800"
            >
              Linkedin
            </a>
            <a href="/mapa" className="hover:text-gray-800">
              Mapa
            </a>
          </nav>
        </div>
      </div>
      <button
        onClick={scrollToTop}
        aria-label="Volver al inicio"
        className="cursor-pointer fixed bottom-8 right-6 z-50 p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition"
        style={{ display: visible ? "block" : "none" }}
      >
        <FaArrowUp size={24} />
      </button>
    </footer>
  );
}
