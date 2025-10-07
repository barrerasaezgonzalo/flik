import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PostListItem from "@/components/PostListItem";
import { Post } from "@/types";
import { supabase } from "@/lib/supabaseClient";
import React from "react";
import { SITE_TITLE } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_SIZE = 15;

/* =====================
    FUNCIONES SERVER
   ===================== */

// Trae todos los posts por categoría (ordenados por fecha desc)
async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `id, title, slug, excerpt, image, date, created_at,
      category:categories(name, slug),
      post_tags(tags(name, slug))`,
    )
    .eq("category.slug", categorySlug)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching posts by category:", error);
    return [];
  }

  return data as unknown as Post[];
}

// Paginar resultados localmente
function getPaginatedItems<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const totalPages = Math.ceil(items.length / pageSize);
  return { items: items.slice(start, end), totalPages };
}

/* =====================
    METADATA DINÁMICA
   ===================== */

export async function generateMetadata({
  params,
}: {
  params: { category: string } | Promise<{ category: string }>;
}): Promise<Metadata> {
  let resolvedParams: { category: string } | undefined = params as
    | { category: string }
    | undefined;
  if (params && typeof (params as Promise<any>).then === "function") {
    resolvedParams = (await params) as { category: string };
  }
  const categorySlug = resolvedParams?.category;

  const { data: category } = await supabase
    .from("categories")
    .select("name, slug, description")
    .eq("slug", categorySlug)
    .single();

  if (!category) {
    return {
      title: `Categoría no encontrada |  ${SITE_TITLE}`,
      description: "Esta categoría no existe en Flik.",
    };
  }

  return {
    title: `${category.name} | ${SITE_TITLE}`,
    description: `Artículos sobre ${category.name} en Flik.`,
    alternates: { canonical: `https://flik.cl/categories/${category.slug}` },
    openGraph: {
      title: `${category.name} |  ${SITE_TITLE}`,
      description: `Artículos sobre ${category.name} en Flik.`,
      url: `https://flik.cl/categories/${category.slug}`,
      siteName: "Flik Blog",
      images: [
        { url: "https://flik.cl/og_logo.png", width: 1200, height: 630 },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} |  ${SITE_TITLE}`,
      description: `Artículos sobre ${category.name} en Flik.`,
      images: ["https://flik.cl/og_logo.png"],
    },
  };
}

/* =====================
    PAGE COMPONENT
   ===================== */

export default async function CategoryPage(props: any) {
  let params: { category: string } | undefined = props.params as
    | { category: string }
    | undefined;
  if (
    props.params &&
    typeof (props.params as Promise<any>).then === "function"
  ) {
    params = (await props.params) as { category: string };
  }

  const categorySlug = params?.category;
  let searchParams: { page?: string } | undefined = props.searchParams as
    | { page?: string }
    | undefined;

  if (
    props.searchParams &&
    typeof (props.searchParams as Promise<any>).then === "function"
  ) {
    searchParams = (await props.searchParams) as { page?: string };
  }

  const page = parseInt(searchParams?.page || "1", 10);

  const { data: category, error } = await supabase
    .from("categories")
    .select("name, slug, description")
    .eq("slug", categorySlug)
    .single();

  if (error || !category) {
    console.error(error);
    return <div>Categoría no encontrada</div>;
  }

  const posts = await getPostsByCategory(categorySlug ?? "");
  const { items: paginatedPosts, totalPages } = getPaginatedItems(
    posts,
    page,
    PAGE_SIZE,
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4">
        <Link href={`/categories/${category.slug}`}>
          <span className="text-green-600">{category.name}</span>
        </Link>
      </h1>

      <h2 className="mb-8">{category.description}</h2>

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

      {paginatedPosts.length === 0 ? (
        <p className="text-gray-600">No hay publicaciones en esta categoría.</p>
      ) : (
        <div className="space-y-8">
          {paginatedPosts.map((post: Post) => (
            <PostListItem key={post.slug} post={post} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          {page > 1 && (
            <Link
              href={`/categories/${categorySlug}?page=${page - 1}`}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              ←
            </Link>
          )}

          {Array.from({ length: totalPages }).map((_, i) => (
            <Link
              key={i}
              href={`/categories/${categorySlug}?page=${i + 1}`}
              className={`px-3 py-1 border rounded hover:bg-gray-100 ${
                page === i + 1 ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {i + 1}
            </Link>
          ))}

          {page < totalPages && (
            <Link
              href={`/categories/${categorySlug}?page=${page + 1}`}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
