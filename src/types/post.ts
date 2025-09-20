import { Category } from "./category";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string; // fecha de publicación (ISO string)
  created_at: string; // fecha de creación en la BD (ISO string)
  category_id: string;
  featured?: boolean;
  category?: Category; // se completa en los mappers con getPosts, getPostBySlug, etc.
};
