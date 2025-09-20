import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Post } from "@/types";

export default function PostListItem({
  post,
  commentCount,
  fetchpriority,
}: {
  post: Post;
  commentCount: number;
  fetchpriority?: "high" | "low" | "auto" | undefined;
}) {
  return (
    <article className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col md:flex-row md:items-start">
        <div className="md:w-1/3 mb-4 md:mb-0 md:pr-6">
          <Link href={`/posts/${post.slug}`}>
            <div className="h-48 bg-gray-200 rounded overflow-hidden">
              {post.image && (
                <Image
                  loading={fetchpriority === "high" ? "eager" : "lazy"}
                  src={post.image}
                  alt={post.title}
                  width={500}
                  height={300}
                  quality={75}
                  priority={fetchpriority === "high" ? true : false}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  fetchPriority={fetchpriority}
                />
              )}
            </div>
          </Link>
        </div>
        <div className="md:w-2/3">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>{formatDate(post.date)}</span>
            <span className="mx-2">•</span>
            <Link href={`/categories/${post.category?.slug ?? ""}`}>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded hover:bg-green-200 transition-colors">
                {post.category?.name ?? ""}
              </span>
            </Link>
            <span className="ml-2">{commentCount} comentarios</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            <Link
              href={`/posts/${post.slug}`}
              className="hover:text-green-600 transition-colors"
            >
              {post.title}
            </Link>
          </h2>
          <p className="text-gray-600 mb-4">{post.excerpt}</p>
          <Link
            href={`/posts/${post.slug}`}
            className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
          >
            Sigue leyendo
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
