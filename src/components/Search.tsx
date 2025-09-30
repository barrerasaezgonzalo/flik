"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { FaMagnifyingGlass, FaDeleteLeft } from "react-icons/fa6";

export default function Search({
  openSearch,
}: {
  openSearch: boolean;
  onClose?: () => void;
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    //if (onClose) onClose();
  };
  useEffect(() => {
    if (openSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [openSearch]);

  return (
    <div
      role="search"
      id="site-search"
      data-testid="site-search"
      className={`container mx-auto max-w-4xl px-4 mb-4 transition-all duration-300 grid overflow-hidden ${
        openSearch
          ? "grid-rows-[1fr] py-2 opacity-100"
          : "grid-rows-[0fr] py-0 opacity-0"
      }`}
    >
      <div className="overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col" role="form">
          <label htmlFor="site-search" className="sr-only">
            Buscar en el blog
          </label>

          {/* contenedor solo para el input + lupa */}
          <div className="relative w-full">
            <FaMagnifyingGlass className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              aria-label="Buscar en el blog"
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-lg text-black pl-12 pr-8 border-0 border-b border-gray-300 rounded-none focus:outline-none focus:ring-0"
              aria-describedby="search-helper"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-1"
                aria-label="Limpiar búsqueda"
              >
                <FaDeleteLeft className="w-5 h-5" />
              </button>
            )}
          </div>

          <p
            className="inline-block mt-2 text-sm text-gray-500"
            id="search-helper"
          >
            Ingresa tu búsqueda y presiona{" "}
            <kbd className="px-1 border rounded">Enter</kbd> para ver los
            resultados.{" "}
          </p>
        </form>
      </div>
    </div>
  );
}
