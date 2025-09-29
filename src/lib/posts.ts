import { Post, Category } from "@/types";
import { supabase } from "./supabaseClient";
import * as Sentry from "@sentry/nextjs";

export async function getAdjacentPosts(slug: string) {
  const { data } = await supabase
    .from("posts")
    .select("id, slug, title, created_at")
    .order("created_at", { ascending: true });

  if (!data) return { prev: null, next: null };

  const index = data.findIndex((p) => p.slug === slug);
  return {
    prev: index > 0 ? data[index - 1] : null,
    next: index < data.length - 1 ? data[index + 1] : null,
  };
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id,slug,name");
  if (error) {
    Sentry.captureException(error);
    throw error;
  }
  return data || [];
}

export async function getPosts(): Promise<Post[]> {
  const { unstable_noStore } = await import("next/cache");
  unstable_noStore();

  const [{ data: posts, error }, categories] = await Promise.all([
    supabase
      .from("posts")
      .select(
        "id, slug, title, date, image, excerpt, content, featured, category_id, created_at",
      )
      .order("created_at", { ascending: false }),
    getCategories(),
  ]);

  if (error) {
    Sentry.captureException(error);
    return [];
  }

  return posts.map((p) => ({
    ...p,
    category: categories.find((c) => c.id === p.category_id) ?? {
      slug: "",
      name: "",
    },
    post_tags: [],
  }));
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
        id,slug,title,date,image,excerpt,content,featured,category_id,
        post_tags (
          tag_id,
          tags!inner ( id, name, slug )
        )
      `,
    )
    .eq("slug", slug)
    .single();

  if (error || !data) {
    Sentry.captureException(error);
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
    post_tags: (data.post_tags ?? []).map((pt) => {
      const tag = Array.isArray(pt.tags) ? pt.tags[0] : pt.tags;
      return {
        tag_id: pt.tag_id,
        tags: tag as { id: string; name: string; slug: string },
      };
    }),
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

  if (postsError) {
    Sentry.captureException(postsError);
    return [];
  }

  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) return [];

  return posts
    .filter((p) => p.category_id === category.id)
    .map((p) => ({
      ...p,
      category: category,
      post_tags: [],
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

  if (postsError) {
    Sentry.captureException(postsError);
    return [];
  }

  return posts.map((p) => ({
    ...p,
    category: categories.find((c) => c.id === p.category_id) ?? {
      slug: "",
      name: "",
    },
    post_tags: [],
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

  if (postsError) {
    Sentry.captureException(postsError);
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
      post_tags: [],
    }));
}
