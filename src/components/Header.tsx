import Link from "next/link";
import Image from "next/image";
import Search from "./Search";
import React from "react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b-2 border-green-600">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold !text-black flex justify-center sm:justify-start">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Flik Blog"
              width={100}
              height={100}
              className="w-24 h-24 object-contain"
            />
          </Link>
        </h1>

        <nav className="w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 gap-3 sm:gap-0">
            <ul className="flex flex-col sm:flex-row sm:space-x-6 text-center sm:text-left">
              <li>
                <Link
                  href="/"
                  className="block py-1 text-gray-600 hover:text-green-600 transition-colors"
                >
                  Posts
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block py-1 text-gray-600 hover:text-green-600 transition-colors"
                >
                  Sobre Flik
                </Link>
              </li>
              <li>
                <Link
                  href="/mapa?modo=categorias"
                  className="block py-1 text-gray-600 hover:text-green-600 transition-colors"
                >
                  Categorías
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block py-1 text-gray-600 hover:text-green-600 transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>

            <div className="flex justify-center sm:justify-start">
              <Search />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
