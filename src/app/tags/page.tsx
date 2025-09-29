import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Explora temas por etiquetas | Flik",
    description:
      "Descubre todos los artículos organizados por etiquetas en Flik. Encuentra posts sobre React, Next.js, JavaScript, Supabase y más.",
    openGraph: {
      title: "Explora temas por etiquetas | Flik",
      description:
        "Listado de etiquetas de Flik para navegar fácilmente por categorías de tecnología y programación.",
      url: "https://flik.cl/tags",
      siteName: "Flik",
      locale: "es_CL",
      type: "website",
    },
  };
}

export default async function TagsPage() {
  const { data: tags, error } = await supabase.from("tags").select(`
      id,
      name,
      slug,
      post_tags ( post_id )
    `);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-10">Error al cargar los tags</div>
    );
  }

  if (!tags || tags.length === 0) {
    return <div className="max-w-3xl mx-auto py-10">No hay tags aún</div>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8 border-b pb-4">Todos los tags</h1>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/tags/${tag.slug}`}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 text-sm"
          >
            #{tag.name}
            <span className="ml-2 text-gray-500 text-xs">
              ({tag.post_tags.length})
            </span>
          </Link>
        ))}
      </div>
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
    </main>
  );
}
