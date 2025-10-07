import { SITE_TITLE } from "@/lib/constants";
import React from "react";

export const metadata = {
  title: "Política de Privacidad | " + SITE_TITLE,
  description:
    "Lee la política de privacidad de Flik y cómo protegemos tu información. Blog de tecnología en español.",
};

export default async function privacyPage() {
  return (
    <div className="max-w-4xl mx-auto prose prose-lg">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4">
        Política de Privacidad
      </h1>

      <p className="mb-4">
        En Flik valoramos y respetamos tu privacidad. Esta política explica cómo
        recopilamos, usamos y protegemos tu información personal al utilizar
        nuestro sitio web.
      </p>
      <h2 className="mb-4 font-bold text-xl">Información que recopilamos</h2>
      <ul>
        <li>
          - Datos proporcionados voluntariamente al enviar formularios (nombre,
          correo electrónico).
        </li>
        <li>
          - Datos de uso recopilados automáticamente (dirección IP, navegador,
          páginas visitadas) mediante herramientas como Cloudflare y cookies.
        </li>
      </ul>
      <h2 className="mb-4 font-bold text-xl mt-4">Uso de la información</h2>
      <ul>
        <li>- Mejorar el contenido y funcionamiento del sitio.</li>
        <li>- Personalizar tu experiencia de usuario.</li>
        <li>- Mostrar anuncios personalizados de Google AdSense.</li>
      </ul>
      <h2 className="mb-4 font-bold text-xl mt-4">Cookies</h2>
      <p>
        Utilizamos cookies y tecnologías similares para analizar el tráfico,
        recordar tus preferencias y mostrar anuncios relevantes. Puedes
        desactivarlas desde la configuración de tu navegador, aunque algunas
        funciones podrían dejar de estar disponibles.
      </p>
      <h2 className="mb-4 font-bold text-xl mt-4">Google AdSense</h2>
      <p>
        Los proveedores externos, incluido Google, utilizan cookies para mostrar
        anuncios basados en tus visitas anteriores a este y otros sitios web.
        Puedes inhabilitar la publicidad personalizada desde Configuración de
        anuncios de Google.
      </p>
      <h2 className="mb-4 font-bold text-xl mt-4">Seguridad de los datos</h2>
      <p>
        Tomamos medidas razonables para proteger tu información, aunque ningún
        método de transmisión o almacenamiento es completamente seguro.
      </p>
      <h2 className="mb-4 font-bold text-xl mt-4">Contacto</h2>
      <p>
        Si tienes preguntas sobre esta política, puedes escribirnos a:
        hola@flik.cl
      </p>
    </div>
  );
}
