import { supabase } from "./supabaseClient";
import { Comment } from "@/types";
import * as Sentry from "@sentry/nextjs";

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("postId", postId)
    .order("date", { ascending: false });

  if (error) {
    Sentry.captureException(error);
    throw error;
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
    Sentry.captureException(error);
    throw error;
  }

  return data as Comment;
}
