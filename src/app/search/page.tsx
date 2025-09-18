import { searchPosts } from "@/lib/posts";
import { Suspense } from "react";
import AdBanner from "@/components/AddBanner";
import { getCommentsByPostId } from "@/lib/comments";
import PostListItem from "@/components/PostListItem";

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
      {/* Google Ad Space */}
      <div className="bg-gray-100 p-4 my-8 text-center border border-dashed border-gray-300 rounded-lg">
        <p className="text-sm text-gray-500 mb-2">Advertisement</p>
        <div className="h-[90px] bg-gray-200 flex items-center justify-center rounded">
          <AdBanner />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4">
        Search Results for: <span className="text-green-600">{query}</span>
      </h1>
      <Suspense fallback={<p>Loading search results...</p>}>
        <SearchResults query={query} />
      </Suspense>
      {/* Google Ad Space */}
      <div className="bg-gray-100 p-4 my-8 text-center border border-dashed border-gray-300 rounded-lg">
        <p className="text-sm text-gray-500 mb-2">Advertisement</p>
        <div className="h-[90px] bg-gray-200 flex items-center justify-center rounded">
          <AdBanner />
        </div>
      </div>
    </div>
  );
}
