import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Post } from "@/types";
import Image from "next/image";

type Category = {
  id: string;
  name: string;
};
export default async function MapaPage({
  searchParams,
}: {
  searchParams?: { modo?: string };
}) {
  const titulo =
    searchParams?.modo === "categorias" ? "Categorías" : "Mapa del sitio";

  const [{ data: posts }, { data: categories }] = await Promise.all([
    supabase
      .from("posts")
      .select("title, slug, category_id")
      .order("date", { ascending: false }),
    supabase.from("categories").select("id, name") as unknown as Promise<{
      data: Category[] | null;
    }>,
  ]);

  if (!posts || !categories)
    return <p className="text-center mt-12">No hay publicaciones.</p>;

  const catMap = Object.fromEntries(
    categories.map((c: Category) => [c.id, c.name]),
  );

  type MinimalPost = Pick<Post, "title" | "slug" | "category_id">;
  const porCategoria = posts.reduce<Record<string, MinimalPost[]>>(
    (acc, post) => {
      const catName = catMap[post.category_id ?? ""] ?? "Sin categoría";
      (acc[catName] ||= []).push(post);
      return acc;
    },
    {},
  );

  return (
    <main className="max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8 border-b pb-4">{titulo}</h1>

      <div className="space-y-10">
        {(Object.entries(porCategoria) as [string, Post[]][]).map(
          ([categoria, lista]) => (
            <section key={categoria}>
              <h2 className="text-2xl font-semibold mb-4">
                {categoria}{" "}
                <span className="text-gray-500 text-base">
                  ({lista.length})
                </span>
              </h2>
              <ul className="space-y-2">
                {lista.map((post: Post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="text-green-500 hover:underline"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ),
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
    </main>
  );
}
