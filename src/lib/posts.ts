import { Post, Category } from "@/types";
import { supabase } from "./supabaseClient";

async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id,slug,name");
  if (error || !data) {
    console.error(error);
    return [];
  }
  return data;
}

export async function getPosts(): Promise<Post[]> {
  const { unstable_noStore } = await import("next/cache");
  unstable_noStore();

  const [{ data: posts, error: postsError }, categories] = await Promise.all([
    supabase
      .from("posts")
      .select(
        "id, slug, title, date, image, excerpt, content, featured, category_id, created_at",
      ) // 👈 ahora incluye created_at
      .order("created_at", { ascending: false }),
    getCategories(),
  ]);

  if (postsError || !posts) {
    if (postsError) console.error("Error al cargar posts:", postsError.message);
    return [];
  }

  return posts.map((p) => ({
    ...p,
    category: categories.find((c) => c.id === p.category_id) ?? {
      slug: "",
      name: "",
    },
  }));
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const { data, error } = await supabase
    .from("posts")
    .select("id,slug,title,date,image,excerpt,content,featured,category_id")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error(error as unknown);
    return undefined;
  }

  // obtener categorías para mapear
  const { data: cats } = await supabase
    .from("categories")
    .select("id,slug,name");

  return {
    ...data,
    category: cats?.find((c) => c.id === data.category_id) ?? {
      slug: "",
      name: "",
    },
  } as Post;
}

export async function getPostsByCategory(
  categorySlug: string,
): Promise<Post[]> {
  const [categories, { data: posts, error: postsError }] = await Promise.all([
    getCategories(),
    supabase
      .from("posts")
      .select(
        "id,slug,title,date,image,excerpt,content,featured,category_id,created_at",
      )
      .order("created_at", { ascending: false }),
  ]);

  if (postsError || !posts) {
    console.error(postsError);
    return [];
  }

  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) return [];

  return posts
    .filter((p) => p.category_id === category.id)
    .map((p) => ({
      ...p,
      category: category,
    }));
}

export async function searchPosts(query: string): Promise<Post[]> {
  const [{ data: posts, error: postsError }, categories] = await Promise.all([
    supabase
      .from("posts")
      .select(
        "id,slug,title,date,image,excerpt,content,featured,category_id,created_at",
      )
      .or(
        `title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`,
      )
      .order("created_at", { ascending: false }),
    getCategories(),
  ]);

  if (postsError || !posts) {
    console.error(postsError);
    return [];
  }

  return posts.map((p) => ({
    ...p,
    category: categories.find((c) => c.id === p.category_id) ?? {
      slug: "",
      name: "",
    },
  }));
}

export async function getRelatedPosts(
  categorySlug: string,
  currentSlug: string,
): Promise<Post[]> {
  const [categories, { data: posts, error: postsError }] = await Promise.all([
    getCategories(),
    supabase
      .from("posts")
      .select(
        "id,slug,title,date,image,excerpt,content,featured,category_id,created_at",
      )
      .neq("slug", currentSlug)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  if (postsError || !posts) {
    console.error(postsError);
    return [];
  }

  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) return [];

  return posts
    .filter((p) => p.category_id === category.id)
    .slice(0, 3)
    .map((p) => ({
      ...p,
      category: category,
    }));
}
