
import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts, getAdjacentPosts } from "@/lib/posts";
import { Post } from "@/types";
import Comments from "@/components/Comments";
import { getCommentsByPostId } from "@/lib/comments";
import { formatDate, getReadingTime } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import * as Sentry from "@sentry/nextjs";
import { PostTag } from "@/types/tags";
import React from "react";
import { FaRegCopy  } from "react-icons/fa";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Flik - Blog de tecnología en español",
      description: "Blog de tecnología en español",
    };
  }

  return {
    title: post.title + " | Blog de tecnología en español",
    description: post.excerpt,
    alternates: {
      canonical: `https://flik.cl/posts/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://flik.cl/posts/${post.slug}`,
      images: [
        {
          url: post.image.startsWith("http")
            ? post.image
            : `https://flik.cl${post.image}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [
        post.image.startsWith("http")
          ? post.image
          : `https://flik.cl${post.image}`,
      ],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const { prev, next } = await getAdjacentPosts(slug);

  if (!post) {
    Sentry.captureMessage("❌ Post no encontrado", {
      level: "error",
      extra: { slug },
    });
    notFound();
  }
  const comments = await getCommentsByPostId(post.id);
  const relatedPosts = await getRelatedPosts(
    post.category?.slug ?? "",
    post.slug,
  );


  return (
    <div className="max-w-4xl mx-auto">
      <article>
        <header className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Link href={`/categories/${post.category?.slug ?? ""}`}>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded hover:bg-green-200 transition-colors">
                {post.category?.name ?? ""}
              </span>
            </Link>
            <span className="mx-2">•</span>
            <span>{formatDate(post.date)}</span>
          </div>
          <div className="text-sm mb-4 mt-4">
            <Link href="/" className="hover:text-green-600">
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/categories/${post.category?.slug ?? ""}`}
              className="hover:text-green-600"
            >
              {post.category?.name ?? "Categoría"}
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium">{post.title}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mt-4  ">
            {post.title}
            <span
              role="button"
              tabIndex={0}
              title="Copiar enlace"
              aria-label="Copiar enlace del post al portapapeles"
              data-copy-current-url
              className="inline-flex cursor-pointer ml-4"            >
              <FaRegCopy  className="w-8 h-8" />
            </span>
          </h1>

          <div className="text-sm text-white mb-2 mt-2 flex items-center">
            <span> {formatDate(post.created_at)}</span>
            <span>⏱ {getReadingTime(post.content)}</span>
          </div>
        </header>

        <div className="grid-element mb-8 rounded-lg  bg-gray-200 border border-black">
          <Image
            src={post.image}
            alt={post.title}
            width={1200}
            height={600}
            className="w-full h-auto object-contain"
            priority
            fetchPriority="high"
            quality={75}
          />

        </div>

        <h2 className="text-lg leading my-8">{post.excerpt}</h2>

        {/* <div className="bg-gray-100 p-4 my-8 text-center border border-dashed  rounded-lg">
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
        </div> */}

        <div
          className="prose dark:prose-dark max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <div className="mt-8 flex gap-4 flex-wrap">
        {post.post_tags?.map((pt: PostTag) => (
          <Link
            key={pt.tags.id}
            href={`/tags/${pt.tags.slug}`}
            className="px-3 py-1 ml-2 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
          >
            #{pt.tags.name}
          </Link>
        ))}
      </div>



      <div className="bg-gray-100 p-4 my-8 text-center border border-dashed  rounded-lg">
        <Link
          href="https://www.linkedin.com/sharing/share-offsite/?url=https://flik.cl"
          target="_blank"
        >
          <Image
            src="/ads/ayudanos.png"
            alt="Ayúdamos a crecer. comparte este Blog con tus amigos y Colegas"
            width={900}
            height={185}
            quality={75}
            sizes="100vw"
            className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105 rounded"
          />
        </Link>
      </div>

      <div className="flex text-black justify-between mt-12 pt-6 gap-4 border-t">
        {prev && (
          <Link
            href={`/posts/${prev.slug}`}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 hover:shadow-md transition hover:text-green-600 transition text-sm"
          >
            <div className="text-xs text-gray-500">← Anterior</div>
            {prev.title}
          </Link>
        )}
        {next && (
          <Link
            href={`/posts/${next.slug}`}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 hover:shadow-md transition hover:text-green-600 transition text-sm ml-auto"
          >
            <div className="text-xs text-gray-500">Siguiente →</div>
            {next.title}
          </Link>
        )}
      </div>

      <Comments postId={post.id} comments={comments} />

      {relatedPosts.length > 0 && (
        <section className="border-t pt-8 mt-12">
          <h2 className="text-2xl font-bold mb-4">Relacionados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <RelatedPostCard key={relatedPost.slug} post={relatedPost} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function RelatedPostCard({ post }: { post: Post }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <Link href={`/posts/${post.slug}`}>
        <div className="relative h-40 bg-gray-200">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-green-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-gray-500">{formatDate(post.date)}</p>
        </div>
      </Link>
    </div>
  );
}
