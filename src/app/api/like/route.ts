import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // usa la service role key
);

export async function POST(req: NextRequest) {
  const { postId } = await req.json();

  // 1. Leer likes actuales
  const { data: row, error: fetchError } = await supabase
    .from("post_likes")
    .select("likes")
    .eq("post_id", postId)
    .maybeSingle();

  if (fetchError) {
    console.error(fetchError);
    return Response.json({ error: fetchError.message }, { status: 500 });
  }

  const currentLikes = (row?.likes ?? 0) as number;

  // 2. Guardar likes + 1
  const { data, error } = await supabase
    .from("post_likes")
    .upsert({ post_id: postId, likes: currentLikes + 1 })
    .select("likes")
    .single();

  if (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ likes: data.likes ?? 0 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  const { data, error } = await supabase
    .from("post_likes")
    .select("likes")
    .eq("post_id", postId)
    .maybeSingle();

  if (error || !data) return Response.json({ likes: 0 });

  return Response.json({ likes: data.likes ?? 0 });
}
