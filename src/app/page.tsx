import Link from "next/link";
import { getPosts } from "@/lib/posts";
import { getCommentsByPostId } from "@/lib/comments";
import { getPaginatedItems } from "@/lib/utils";
import PostListItem from "@/components/PostListItem";
import Image from "next/image";
import { Post } from "@/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const PAGE_SIZE = 15;

export const metadata: Metadata = {
  title: "Todos los posts | Blog de tecnología en español",
  description:
    "Listado completo de artículos y publicaciones en Flik, blog de tecnología en español.",
  alternates: {
    canonical: "https://flik.cl/",
  },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const rawPage = searchParams?.page;
  const page = rawPage && /^\d+$/.test(rawPage) ? parseInt(rawPage, 10) : 1;

  const posts = await getPosts();
  const { items: visiblePosts, totalPages } = getPaginatedItems(
    posts,
    page,
    PAGE_SIZE,
  );

  // 🚨 Validación de parámetros inválidos
  if (
    (rawPage && !/^\d+$/.test(rawPage)) || // ej: ?page=a
    page < 1 ||
    page > totalPages
  ) {
    notFound();
  }

  const commentCounts: Record<string, number> = {};
  await Promise.all(
    visiblePosts.map(async (post: Post) => {
      const comments = await getCommentsByPostId(post.id);
      commentCounts[post.id] = Array.isArray(comments) ? comments.length : 0;
    }),
  );

  return (
    <div className="max-w-4xl mx-auto prose prose-lg">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4">
        Blog de tecnología en español
      </h1>

      {/* Anuncio superior */}
      <div className="bg-gray-100 p-4 my-8 text-center border border-dashed  rounded-lg">
        <Link href="/mapa?modo=categorias">
          <Image
            src="/ads/categorias-destacadas.png"
            alt="Categorías destacadas"
            width={900}
            height={185}
            quality={75}
            sizes="100vw"
            className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105 rounded"
          />
        </Link>
      </div>

      {/* Posts */}
      <div className="space-y-8">
        {visiblePosts.map((post, index) => (
          <PostListItem
            key={post.slug}
            post={post}
            commentCount={commentCounts[post.id] || 0}
            fetchpriority={index === 0 ? "high" : "low"}
          />
        ))}
      </div>

      {/* Controles de paginación */}
      <div className="flex justify-center items-center gap-2 mt-10">
        {page > 1 && (
          <Link
            href={`/?page=${page - 1}`}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            ←
          </Link>
        )}

        {Array.from({ length: totalPages }).map((_, i) => (
          <Link
            key={i}
            href={`/?page=${i + 1}`}
            className={`px-3 py-1 border rounded hover:bg-gray-100 text-gray-500 ${
              page === i + 1 ? "bg-gray-200 font-semibold" : ""
            }`}
          >
            {i + 1}
          </Link>
        ))}

        {page < totalPages && (
          <Link
            href={`/?page=${page + 1}`}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            →
          </Link>
        )}
      </div>

      {/* Anuncio inferior */}
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
