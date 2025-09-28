import Link from "next/link";
import Image from "next/image";
import React from "react";

interface FooterProps {
  post?: { slug: string; title: string };
  prev?: { slug: string; title: string } | null;
  next?: { slug: string; title: string } | null;
}

export default function Footer({ post, prev, next }: FooterProps) {
  return (
    <footer className="bg-gray-100 border-t mt-8 py-6">
      <div className="max-w-4xl mx-auto px-4 flex flex-col gap-6 text-sm text-gray-600">
        {/* 🔗 Si estamos en un post → mostrar social + navegación */}
        {post && (
          <div className="space-y-6">
            {/* Botones sociales */}
            <div className="flex gap-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  post.title,
                )}&url=${encodeURIComponent("https://flik.cl/posts/" + post.slug)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                🐦 Compartir en X
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  "https://flik.cl/posts/" + post.slug,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline"
              >
                💼 Compartir en LinkedIn
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  post.title + " https://flik.cl/posts/" + post.slug,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                📱 Compartir en WhatsApp
              </a>
            </div>

            {/* Prev / Next */}
            <div className="flex justify-between text-sm">
              {prev ? (
                <Link href={`/posts/${prev.slug}`} className="hover:underline">
                  ⬅️ {prev.title}
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={`/posts/${next.slug}`}
                  className="hover:underline ml-auto"
                >
                  {next.title} ➡️
                </Link>
              ) : (
                <span />
              )}
            </div>
          </div>
        )}

        {/* Logo + nombre + navegación estática */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo + nombre */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Flik Blog"
                width={48}
                height={48}
                className="w-12 h-auto"
              />
            </Link>
            <p className="text-gray-600 pt-2">
              Blog de tecnología en español © {new Date().getFullYear()}
            </p>
          </div>

          {/* Links */}
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
    </footer>
  );
}
