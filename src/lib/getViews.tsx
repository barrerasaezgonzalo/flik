import { createClient } from "@supabase/supabase-js";

export const supabaseServer = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function getViews(slug: string) {
  const { count } = await supabaseServer
    .from("page_views")
    .select("*", { count: "exact", head: true })
    .eq("slug", slug);

  return count || 0;
}
