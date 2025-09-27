"use client";

import Link from "next/link";
import Image from "next/image";
import Search from "./Search";
import React, { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-green-600">
      <div className="container mx-auto flex justify-between items-center max-w-4xl px-4 py-2">
        {/* Logo */}
        <div className="text-2xl font-bold text-black flex items-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Flik Blog"
              width={80}
              height={80}
              className="w-16 h-16 object-contain"
            />
          </Link>
        </div>

        {/* Botón hamburguesa en mobile */}
        <button
          className="sm:hidden text-2xl text-black cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          {open ? "❌" : "☰"}
        </button>

        {/* Nav en desktop */}
        <nav className="hidden sm:flex sm:items-center sm:space-x-6">
          <ul className="flex gap-4">
            <li>
              <Link
                href="/"
                className="text-black hover:text-green-600 transition-colors"
              >
                📝 Posts
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-black hover:text-green-600 transition-colors"
              >
                🚀 Sobre Flik
              </Link>
            </li>
            <li>
              <Link
                href="/mapa?modo=categorias"
                className="text-black hover:text-green-600 transition-colors"
              >
                🔖 Categorías
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-black hover:text-green-600 transition-colors"
              >
                📞 Contacto
              </Link>
            </li>
          </ul>
          <Search />
        </nav>
      </div>

      {/* Menú desplegable en mobile */}
      {open && (
        <div
          data-testid="mobile-menu"
          className="sm:hidden bg-white border-t border-gray-200 px-4 py-3"
        >
          <ul className="flex flex-col gap-3">
            <li>
              <Link
                href="/"
                className="block text-black hover:text-green-600 transition-colors"
                onClick={() => setOpen(false)}
              >
                📝 Posts
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="block text-black hover:text-green-600 transition-colors"
                onClick={() => setOpen(false)}
              >
                🚀 Sobre Flik
              </Link>
            </li>
            <li>
              <Link
                href="/mapa?modo=categorias"
                className="block text-black hover:text-green-600 transition-colors"
                onClick={() => setOpen(false)}
              >
                🔖 Categorías
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="block text-black hover:text-green-600 transition-colors"
                onClick={() => setOpen(false)}
              >
                📞 Contacto
              </Link>
            </li>
          </ul>
          <div className="mt-3">
            <Search />
          </div>
        </div>
      )}
    </header>
  );
}
