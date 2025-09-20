import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-8 py-6">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600 gap-4">
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
            <span className="font-semibold text-gray-800">Flik</span>
          </Link>
          <p className="text-gray-600">Un blog de tecnología aleatoria</p>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-4">
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

      <p className="mt-4 text-center text-xs text-gray-700">
        © {new Date().getFullYear()} Flik 
      </p>
    </footer>
  );
}
