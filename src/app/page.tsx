import Link from "next/link";
import { getPosts } from "@/lib/posts";
import { getCommentsByPostId } from "@/lib/comments";
import { getPaginatedItems } from "@/lib/utils";
import PostListItem from "@/components/PostListItem";
import Image from "next/image";
import { Post } from "@/types";

const PAGE_SIZE = 15;

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams; // 👈 lo resolvemos

  const posts = await getPosts();
  const page = parseInt((params?.page as string) || "1", 10);

  const { items: visiblePosts, totalPages } = getPaginatedItems(
    posts,
    page,
    PAGE_SIZE,
  );
  const commentCounts: Record<string, number> = {};

  // Get comment counts for all visible posts
  await Promise.all(
    visiblePosts.map(async (post: Post) => {
      const comments = await getCommentsByPostId(post.id);
      commentCounts[post.id] = Array.isArray(comments) ? comments.length : 0;
    }),
  );

  return (
    <div className="max-w-4xl mx-auto">
      <section className="mb-10 text-center text-white max-w-2xl mx-auto">
        <h1 className="text-4xl font-semibold mb-4">
          Flik: un blog de tecnología en español
        </h1>
      </section>

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
