import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import type { Metadata } from "next";
import { Suspense } from "react";
import React from "react";

// 🔹 Metadata condicional
export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { modo?: string } | Promise<{ modo?: string }>;
}): Promise<Metadata> {
  let params: { modo?: string } | undefined = searchParams as { modo?: string } | undefined;
  if (searchParams && typeof (searchParams as Promise<any>).then === "function") {
    params = await searchParams as { modo?: string };
  }
  const isCategorias = params?.modo === "categorias";

  const pageTitle = isCategorias
    ? "Categorías | Blog de tecnología en español"
    : "Mapa del sitio | Blog de tecnología en español";

  const pageDesc = isCategorias
    ? "Explora todas las categorías de Flik. Blog de tecnología en español."
    : "Encuentra todos los artículos y categorías en Flik. Blog de tecnología en español.";

  return {
    title: pageTitle,
    description: pageDesc,
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: isCategorias
        ? "https://flik.cl/mapa?modo=categorias"
        : "https://flik.cl/mapa",
      siteName: "Flik Blog",
      images: [
        {
          url: "https://flik.cl/og_logo.png",
          width: 1200,
          height: 630,
          alt: "Flik Blog",
        },
      ],
      locale: "es_CL",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDesc,
      images: ["https://flik.cl/og_logo.png"],
    },
  };
}

// 🔹 Client Component para usar hooks
function TituloClient({ modo }: { modo?: string }) {
  "use client";
  return (
    <h1 className="text-4xl font-bold mb-8 border-b pb-4">
      {modo === "categorias"
        ? "Blog de tecnología en español"
        : "Mapa del sitio"}
    </h1>
  );
}

// 🔹 Server Component (puede usar supabase y fetch SSR)
export default async function MapaPage({
  searchParams,
}: {
  searchParams?: { modo?: string } | Promise<{ modo?: string }>;
}) {
  let params: { modo?: string } | undefined = searchParams as { modo?: string } | undefined;
  if (searchParams && typeof (searchParams as Promise<any>).then === "function") {
    params = await searchParams as { modo?: string };
  }
  const { data: posts } = await supabase
    .from("posts")
    .select("title, slug, category_id")
    .order("date", { ascending: false });

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug");

  if (!posts?.length || !categories?.length) {
    return <p className="text-center mt-12">No hay publicaciones.</p>;
  }

  const catMap = Object.fromEntries(
    categories.map((c) => [c.id, { name: c.name, slug: c.slug }]),
  );
  const porCategoria = posts.reduce<Record<string, typeof posts>>(
    (acc, post) => {
      const cat = catMap[post.category_id ?? ""];
      const catKey = cat ? cat.slug : "sin-categoria";
      (acc[catKey] ||= []).push(post);
      return acc;
    },
    {},
  );

  return (
    <main className="max-w-4xl mx-auto px-4">
      <Suspense fallback={<h1>Cargando título...</h1>}>
  <TituloClient modo={params?.modo} />
      </Suspense>

      <div className="space-y-10">
        {Object.entries(porCategoria).map(([catSlug, lista]) => {
          const cat = categories.find((c) => c.slug === catSlug);
          return (
            <section key={catSlug}>
              <h2 className="text-2xl text-green-600 font-semibold mb-4">
                <Link href={`/categories/${catSlug}`}>
                  {cat?.name || "Sin categoría"}
                </Link>
                <span className="text-gray-500 text-base">
                  {" "}
                  ({lista.length})
                </span>
              </h2>
              <ul className="space-y-2">
                {lista.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="text-white hover:underline"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="bg-gray-100 p-4 my-8 text-center border border-dashed  rounded-lg">
        <Link
          href="https://www.linkedin.com/sharing/share-offsite/?url=https://flik.cl"
          target="_blank"
        >
          <Image
            src="/ads/ayudanos.png"
            alt="Ayúdamos a crecer. comparte este Blog con tus amigos y Colegas"
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
