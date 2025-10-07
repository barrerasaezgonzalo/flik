import Link from "next/link";
import Image from "next/image";
import { getPosts } from "@/lib/posts";
import { getPaginatedItems } from "@/lib/utils";
import PostListItem from "@/components/PostListItem";
import { notFound } from "next/navigation";
import {
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_URL,
  SITE_OG_IMAGE,
} from "@/lib/constants";

const PAGE_SIZE = 10;

export const metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Flik",
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
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

  if ((rawPage && !/^\d+$/.test(rawPage)) || page < 1 || page > totalPages) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4">
        {SITE_TITLE}
      </h1>

      <div className="bg-gray-100 p-4 my-8 text-center border border-dashed rounded-lg">
        <Link href="/mapa?modo=categorias">
          <Image
            src="/ads/categorias-destacadas.png"
            alt="Categorías destacadas"
            width={900}
            height={185}
            quality={75}
            className="w-full h-auto object-cover rounded transition-transform hover:scale-105"
          />
        </Link>
      </div>

      <div className="space-y-8">
        {visiblePosts.map((post, i) => (
          <PostListItem
            key={post.slug}
            post={post}
            fetchpriority={i === 0 ? "high" : "low"}
          />
        ))}
      </div>

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

      <div className="bg-gray-100 p-4 my-8 text-center border border-dashed rounded-lg">
        <Link href="/contact">
          <Image
            src="/ads/publica.png"
            alt="¿Quieres colaborar o proponer un tema?, escríbenos"
            width={900}
            height={185}
            quality={75}
            className="w-full h-auto object-cover rounded transition-transform hover:scale-105"
          />
        </Link>
      </div>
    </div>
  );
}
