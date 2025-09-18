import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

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
    supabase.from("categories").select("id, name"),
  ]);

  if (!posts || !categories)
    return <p className="text-center mt-12">No hay publicaciones.</p>;

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  const porCategoria = posts.reduce<Record<string, typeof posts>>(
    (acc, post) => {
      const catName = catMap[post.category_id] ?? "Sin categoría";
      if (!acc[catName]) acc[catName] = [];
      acc[catName].push(post);
      return acc;
    },
    {},
  );

  return (
    <main className="max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8 border-b pb-4">{titulo}</h1>

      <div className="space-y-10">
        {Object.entries(porCategoria).map(([categoria, lista]) => (
          <section key={categoria}>
            <h2 className="text-2xl font-semibold mb-4">
              {categoria}{" "}
              <span className="text-gray-500 text-base">({lista.length})</span>
            </h2>
            <ul className="space-y-2">
              {lista.map((post) => (
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
        ))}
      </div>
    </main>
  );
}
