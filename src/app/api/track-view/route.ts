import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function POST(req: Request) {
  const { slug } = await req.json();

  const { error } = await supabase.from("page_views").insert({ slug });

  if (error) {
    console.error("Supabase insert error:", error);
    return new Response("error", { status: 500 });
  }

  return new Response("ok");
}
