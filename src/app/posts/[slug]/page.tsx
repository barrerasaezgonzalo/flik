import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { Post } from "@/types";
import { getCommentsByPostId } from "@/lib/comments";
import Comments from "@/components/Comments";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Flik - Un blog random de tecnología",
      description: "Contenido aleatorio sobre tecnología",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function PostPage(props: any) {
  const { slug } = props.params;

  const post = await getPostBySlug(slug);
  if (!post) notFound();

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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mt-8">
            {post.title}
          </h1>
        </header>

        <div className="w-full mb-8 rounded-lg overflow-hidden bg-gray-200">
          <Image
            src={post.image}
            alt={post.title}
            width={1200}
            height={600}
            className="w-full h-auto rounded-lg"
            fetchPriority="high"
            quality={75}
          />
        </div>

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

        <div
          className="prose dark:prose-dark max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

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
      <Comments postId={post.id} initialComments={comments} />

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
