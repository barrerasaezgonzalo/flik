import { getPosts } from "@/lib/posts";
import { supabase } from "@/lib/supabaseClient";

export const contentType = "application/xml";

export default async function sitemap() {
  // 1. Posts
  const posts = await getPosts();
  const postEntries = posts
    .filter((p) => p.slug)
    .map((post) => ({
      url: `https://flik.cl/posts/${post.slug}`,
      lastModified: new Date(post.date).toISOString().split("T")[0],
    }));

  // 2. Categorías (sin updated_at → usamos fecha actual)
  const { data: categories, error } = await supabase
    .from("categories")
    .select("slug");

  if (error) {
    console.error("Error cargando categorías para sitemap:", error);
  }

  const categoryEntries =
    categories
      ?.filter((c) => c.slug)
      .map((cat) => ({
        url: `https://flik.cl/categories/${cat.slug}`,
        lastModified: new Date().toISOString().split("T")[0],
      })) || [];

  // 3. Páginas estáticas
  const staticEntries = [
    {
      url: "https://flik.cl/",
      lastModified: new Date().toISOString().split("T")[0],
    },
    {
      url: "https://flik.cl/about",
      lastModified: new Date().toISOString().split("T")[0],
    },
    {
      url: "https://flik.cl/contact",
      lastModified: new Date().toISOString().split("T")[0],
    },
    {
      url: "https://flik.cl/privacy",
      lastModified: new Date().toISOString().split("T")[0],
    },
    {
      url: "https://flik.cl/terminos",
      lastModified: new Date().toISOString().split("T")[0],
    },
    {
      url: "https://flik.cl/mapa",
      lastModified: new Date().toISOString().split("T")[0],
    },
  ];

  // 4 -tags
  const { data: rawTags, error: tagsError } = await supabase
    .from("tags")
    .select("slug");

  if (tagsError) {
    console.error("Error cargando tags para sitemap:", tagsError);
  }

  const tagsUrls =
    rawTags?.map((t) => ({
      url: `https://flik.cl/tags/${t.slug}`,
      lastModified: new Date().toISOString().split("T")[0], // usamos fecha actual
    })) || [];

  return [...staticEntries, ...postEntries, ...categoryEntries, ...tagsUrls];
}
