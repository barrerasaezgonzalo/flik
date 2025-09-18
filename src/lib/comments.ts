import { supabase } from "./supabaseClient";

export type Comment = {
  id: string;
  postId: string;
  email: string;
  content: string;
  date: string;
};

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("postId", postId)
    .order("date", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return [];
  }

  return (data ?? []) as Comment[];
}

export async function addComment(
  comment: Omit<Comment, "id" | "date">,
): Promise<Comment> {
  const { data, error } = await supabase
    .from("comments")
    .insert(comment)
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }

  return data as Comment;
}
