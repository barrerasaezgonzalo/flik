import { Category } from "./category";
import { PostTag } from "./tags";

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
  post_tags: PostTag[];
};

export interface PostListItemProps {
  post: Post;
  fetchpriority?: "high" | "low" | "auto";
}

export type PostWithCategory = Post & {
  categories?: { name: string };
};

export interface SubmittedPost {
  title: string;
  email: string;
  category: string;
  content: string;
  submittedAt: string;
}
