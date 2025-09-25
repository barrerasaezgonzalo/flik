import Link from "next/link";
import Image from "next/image";
import { getPostsByCategory } from "@/lib/posts";
import { getCommentsByPostId } from "@/lib/comments";
import { getPaginatedItems } from "@/lib/utils";
import PostListItem from "@/components/PostListItem";
import { Post } from "@/types";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_SIZE = 15;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function CategoryPage(props: any) {
  const { category: categorySlug } = props.params;
  const page = parseInt(props.searchParams?.page || "1", 10);

  const { data: category, error } = await supabase
    .from("categories")
    .select("name")
    .eq("slug", categorySlug)
    .single();

  if (error || !category) {
    console.error(error);
    return <div>Categoría no encontrada</div>;
  }

  const posts = await getPostsByCategory(categorySlug);
  
  const { 
    items: paginatedPosts, 
    totalPages 
  } = getPaginatedItems(posts, page, PAGE_SIZE);
  const commentCounts: Record<string, number> = {};

  // Get comment counts for all visible posts
  await Promise.all(
    paginatedPosts.map(async (post: Post) => {
      const comments = await getCommentsByPostId(post.id);
      commentCounts[post.id] = Array.isArray(comments) ? comments.length : 0;
    }),
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4">
        Categoría: <span className="text-green-600">{category.name}</span>
      </h1>

      <div className="bg-gray-100 p-4 my-8 text-center border border-dashed  rounded-lg">
        <Link href="https://fintual.cl/r/gonzalob6a" target="_blank">
          <Image
            src="/ads/fintual.png"
            alt="Fintual - La mejor decisión para tu plata. Tus inversiones reguladas"
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
            <PostListItem
              key={post.slug}
              post={post}
              commentCount={commentCounts[post.id] || 0}
            />
          ))}
        </div>
      )}

      {/* Controles de paginación */}
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

      <div className="bg-gray-100 p-4 my-8 text-center border border-dashed  rounded-lg">
        <Link href="https://mpago.li/1yh1MCv" target="_blank">
          <Image
            src="/ads/mercadopago.png"
            alt="Mercadopago - Gana Rendimientos diarios con la plata en tu app"
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
