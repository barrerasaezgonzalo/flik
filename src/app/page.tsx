import Link from "next/link";
import { getPosts } from "@/lib/posts";
import AdBanner from "@/components/AddBanner";
import { getCommentsByPostId } from "@/lib/comments";
import PostListItem from "@/components/PostListItem";

const PAGE_SIZE = 15;

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const posts = await getPosts();
  const page = parseInt(searchParams?.page || "1", 10);
  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const visiblePosts = posts.slice(start, end);
  const commentCounts: Record<string, number> = {};

  // Get comment counts for all visible posts
  await Promise.all(
    visiblePosts.map(async (post) => {
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

      <div className="bg-gray-100 p-4 my-8 text-center border border-dashed border-gray-300 rounded-lg">
        <p className="text-sm text-gray-700 mb-2">Advertisement</p>
        <div className="h-[90px] bg-gray-200 flex items-center justify-center rounded">
          <AdBanner />
        </div>
      </div>
    </div>
  );
}
