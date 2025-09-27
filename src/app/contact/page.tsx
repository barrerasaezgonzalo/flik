import Link from "next/link";
import Image from "next/image";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | Blog de tecnología en español",
  description: "Ponte en contacto con Flik. Blog de tecnología en español.",
};

export default function ContactoPage() {
  return (
    <div className="max-w-4xl mx-auto prose prose-lg">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4">
        Contacto
      </h1>
      <p className="mb-4">
        ¡Hola! Gracias por visitar <strong>Flik</strong>. Si tienes dudas,
        sugerencias, quieres colaborar o simplemente saludar, estás en el lugar
        indicado.
      </p>
      <p className="mb-4">
        Este blog existe para compartir experiencias reales del mundo de la
        tecnología y el desarrollo de software. Me encantaría conocer tu
        opinión, escuchar tus ideas o recibir cualquier tipo de aporte que pueda
        hacer crecer este proyecto.
      </p>
      <p className="mb-4">
        También puedes usar este canal para reportar errores del sitio, avisar
        sobre contenido desactualizado o proponer nuevos temas que te gustaría
        ver publicados aquí.
      </p>{" "}
      <p className="mb-4">
        Puedes escribirme directamente a este correo de contacto y responderé lo
        antes posible:
      </p>
      <p className="text-lg font-semibold mb-4">
        ✉️ <a href="mailto:hola@flik.cl">hola@flik.cl</a>
      </p>
      <p className="mb-4">
        Gracias por ser parte de esta comunidad tecnológica y por apoyar este
        espacio que busca aprender, equivocarse y mejorar día a día.{" "}
      </p>
      <div className="bg-gray-100 p-4 my-8 text-center border border-dashed rounded-lg">
        <Link href="/contacto">
          <Image
            src="/ads/publica.png"
            alt="¿Quieres colabrar o proponer un tema?, escríbenos"
            width={900}
            height={185}
            quality={75}
            sizes="100vw"
            className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105 rounded"
          />
        </Link>
      </div>
    </div>
  );
}
