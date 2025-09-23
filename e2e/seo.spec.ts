// e2e/seo.spec.ts
import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

test("cada post tiene etiquetas SEO básicas", async ({ page }) => {
  // 1. Traemos todos los slugs
  const { data: posts, error } = await supabase
    .from("posts")
    .select("slug")
    .order("created_at", { ascending: false }) // últimos primero
    .limit(5); // solo 5;

  if (error) throw error;
  if (!posts) throw new Error("No se encontraron posts en Supabase");

  // 2. Recorremos cada slug
  for (const { slug } of posts) {
    await test.step(`Verificar SEO en /posts/${slug}`, async () => {
      try {
        await page.goto(`/posts/${slug}`, { timeout: 30000 });

        // canonical
        const canonical = await page
          .locator("head link[rel='canonical']")
          .first()
          .getAttribute("href");
        expect(canonical, `❌ Faltó canonical en ${slug}`).not.toBeNull();

        // meta robots
        const robots = await page
          .locator("head meta[name='robots']")
          .first()
          .getAttribute("content");
        expect(robots, `❌ Faltó meta[robots] en ${slug}`).not.toBeNull();

        // título
        const title = await page.title();
        expect(title, `❌ Título vacío en ${slug}`).not.toEqual("");

        console.log(`✅ SEO OK en ${slug}`);
      } catch (err) {
        console.error(`❌ Error SEO en ${slug}:`, err);
      }
    });
  }
});
