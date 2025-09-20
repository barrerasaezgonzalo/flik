import { searchPosts } from "@/lib/posts";
import { Suspense } from "react";
import { getCommentsByPostId } from "@/lib/comments";
import PostListItem from "@/components/PostListItem";
import Link from "next/link";
import Image from "next/image";

// This component is wrapped in Suspense to handle streaming UI
function SearchResults({ query }: { query: string }) {
  return <SearchResultsComponent query={query} />;
}

async function SearchResultsComponent({ query }: { query: string }) {
  const posts = await searchPosts(query);
  const commentCounts: Record<string, number> = {};

  await Promise.all(
    posts.map(async (post) => {
      const comments = await getCommentsByPostId(post.id);
      commentCounts[post.id] = Array.isArray(comments) ? comments.length : 0;
    }),
  );

  return (
    <div className="space-y-8">
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostListItem
            key={post.slug}
            post={post}
            commentCount={commentCounts[post.id] || 0}
          />
        ))
      ) : (
        <p className="text-gray-600 text-center">
          No posts found for your search.
        </p>
      )}
    </div>
  );
}

export default function SearchPage(props: unknown) {
  const { searchParams } = props as {
    searchParams?: Record<string, string | string[] | undefined>;
  };
  const query = typeof searchParams?.q === "string" ? searchParams.q : "";
  return (
    <div className="max-w-4xl mx-auto">
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
      <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4">
        Search Results for: <span className="text-green-600">{query}</span>
      </h1>
      <Suspense fallback={<p>Loading search results...</p>}>
        <SearchResults query={query} />
      </Suspense>
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
