import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SITE_TITLE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Página no encontrada | " + SITE_TITLE,
  description:
    "La página que buscas no existe en Flik. Explora otros artículos y categorías en nuestro blog de tecnología en español.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center text-center py-20">
      <Image
        src="/logo.png"
        alt="Flik Blog"
        width={120}
        height={120}
        className="mb-6 opacity-80"
      />
      <h1 className="text-5xl font-bold text-green-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Página no encontrada</h2>
      <p className=" mb-10 max-w-md">
        Lo sentimos, la página que intentas visitar no existe. Pero no te vayas
        👀, en Flik tenemos artículos sobre programación, IA, seguridad y mucho
        más.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          🏠 Volver al inicio
        </Link>
        <Link
          href="/mapa"
          className="px-6 py-3 bg-blue-500 rounded-lg shadow hover:bg-green-700 transition"
        >
          🔎 Ir al mapa del sitio
        </Link>
      </div>
    </main>
  );
}
