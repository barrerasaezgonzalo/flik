"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Search from "./Search";
import { useState, useEffect } from "react";
import {
  FaAlignJustify,
  FaSignsPost,
  FaLightbulb,
  FaBookmark,
  FaMugSaucer,
  FaXmark,
} from "react-icons/fa6";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
        setOpenSearch(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setOpenSearch(open ? true : false);
  }, [open]);

  return (
    <header className="bg-white shadow-sm border-b border-green-600">
      <div className="container mx-auto flex justify-between items-center max-w-4xl px-4 ">
        <div className="text-2xl font-bold text-black flex items-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Flik Blog"
              width={100}
              height={100}
              className="w-25 h-25 object-contain"
            />
          </Link>
        </div>

        <button
          className="md:hidden text-2xl text-black cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
          role="button"
        >
          {open ? (
            <FaXmark className="w-7 h-7" />
          ) : (
            <FaAlignJustify className="w-7 h-7" />
          )}
        </button>

        <nav className="hidden md:flex md:items-center md:space-x-6">
          <ul className="flex">
            <li>
              <Link
                href="/"
                className="text-sm border-t border-b border-r border-black inline-block text-black hover:text-green-600 px-[20px] py-[10px]"
              >
                Posts
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-sm border-t border-b border-r border-black inline-block text-black hover:text-green-600 px-[30px] py-[10px]"
              >
                Sobre Flik
              </Link>
            </li>
            <li>
              <Link
                href="/mapa?modo=categorias"
                className="text-sm border-t border-b border-r border-black inline-block text-black hover:text-green-600 px-[30px] py-[10px]"
              >
                Categorías
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-sm border-t border-b border-r border-black inline-block text-black hover:text-green-600 px-[30px] py-[10px]"
              >
                Contacto
              </Link>
            </li>
            <li className="text-sm">
              <button
                role="button"
                type="button"
                onClick={() => setOpenSearch((v) => !v)}
                aria-expanded={openSearch}
                aria-controls="site-search"
                aria-label="Buscar"
                data-testid="buscar-menu-desktop"
                className="cursor-pointer border-t border-b border-black inline-block text-black hover:text-green-600 px-[30px] py-[10px] focus:outline-none"
              >
                Buscar{" "}
                {openSearch && <FaXmark className="inline-block w-4 h-4" />}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <Search openSearch={openSearch} onClose={() => setOpenSearch(false)} />

      {open && (
        <div
          data-testid="mobile-menu"
          className="md:hidden bg-white border-t border-gray-200 px-4 py-3"
        >
          <ul className="flex flex-col gap-3">
            <li className="border-b border-gray-200 py-2">
              <Link
                href="/"
                className="inline-flex items-center text-black hover:text-green-600 transition-colors"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <FaSignsPost className="w-7 h-7" />{" "}
                <p className="ml-4">Posts</p>
              </Link>
            </li>
            <li className="border-b border-gray-200 py-2">
              <Link
                href="/about"
                className="inline-flex items-center text-black hover:text-green-600 transition-colors"
                onClick={() => setOpen(false)}
              >
                <FaLightbulb className="w-7 h-7" />{" "}
                <p className="ml-4">Sobre Flik</p>
              </Link>
            </li>
            <li className="border-b border-gray-200 py-2">
              <Link
                href="/mapa?modo=categorias"
                className="inline-flex items-center text-black hover:text-green-600 transition-colors"
                onClick={() => setOpen(false)}
              >
                <FaBookmark className="w-7 h-7" />{" "}
                <p className="ml-4">Categorías</p>
              </Link>
            </li>
            <li className="border-b border-gray-200 py-2">
              <Link
                href="/contact"
                className="inline-flex items-center text-black hover:text-green-600 transition-colors"
                onClick={() => setOpen(false)}
              >
                <FaMugSaucer className="w-7 h-7" />{" "}
                <p className="ml-4">Contacto</p>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
