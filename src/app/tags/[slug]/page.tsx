/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let resolvedParams: { slug: string } | undefined = params as
    | { slug: string }
    | undefined;
  if (
    params &&
    typeof (params as unknown as Promise<any>).then === "function"
  ) {
    resolvedParams = await (params as unknown as Promise<{ slug: string }>);
  }
  const slug = resolvedParams?.slug;

  // Opcional: buscar nombre del tag desde Supabase
  const { data: tag } = await supabase
    .from("tags")
    .select("name")
    .eq("slug", slug)
    .single();

  const tagName = tag?.name || slug;

  return {
    title: `${tagName} | Flik`,
    description: `Artículos de Flik sobre ${tagName}. Encuentra todos los posts relacionados con ${tagName}.`,
    openGraph: {
      title: `${tagName} | Flik`,
      description: `Descubre todos los artículos relacionados con ${tagName} en Flik.`,
      url: `https://flik.cl/tags/${slug}`,
      siteName: "Flik",
      locale: "es_CL",
      type: "website",
    },
  };
}
export default async function TagPage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  let resolvedParams: { slug: string } | undefined = params as
    | { slug: string }
    | undefined;
  if (
    params &&
    typeof (params as unknown as Promise<any>).then === "function"
  ) {
    resolvedParams = await (params as unknown as Promise<{ slug: string }>);
  }
  const slug = resolvedParams?.slug;
  const { data: tag, error } = await supabase
    .from("tags")
    .select(
      `
      id,
      name,
      slug,
      post_tags (
        posts (
          id,
          slug,
          title,
          excerpt,
          date,
          image
        )
      )
    `,
    )
    .eq("slug", slug)
    .single();

  if (error || !tag) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/tags"
        className="inline-block mb-4 text-green-600 hover:underline"
      >
        ← Volver a todos los tags
      </Link>
      <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4">
        Posts con tag: #{tag.name}
      </h1>

      {tag.post_tags.length === 0 && (
        <>
          <p className="text-white text-xl text-left">
            Lo sentimos, no hemos escrito nada con este Tag todavía. Pero no te
            vayas 👀, en Flik tenemos artículos sobre programación, IA,
            seguridad y mucho más.
          </p>
        </>
      )}

      <ul className="space-y-6">
        {tag.post_tags.map((pt: any) => (
          <li key={pt.posts.id}>
            <Link
              href={`/posts/${pt.posts.slug}`}
              className="text-2xl text-green-600 font-semibold mb-4"
            >
              {pt.posts.title}
            </Link>
            <p className="text-white text-md mt-4">{pt.posts.excerpt}</p>
            <span className="text-gray-400 text-xs mb-4">
              {new Date(pt.posts.date).toLocaleDateString("es-CL")}
            </span>
          </li>
        ))}
      </ul>

      <div className="bg-gray-100 p-4 my-8 text-center border border-dashed rounded-lg">
        <Link href="/contact">
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
