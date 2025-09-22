import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // ⚠️ Service Role
);

test("un usuario puede enviar un comentario", async ({ page }) => {
  await page.goto("/posts/accesibilidad-web-no-es-opcional-es-esencial"); // slug de prueba que exista

  await page.getByLabel("Correo electrónico").fill("e2e@test.com");
  await page
    .getByRole("textbox", { name: "Comentario" })
    .fill("Comentario E2E de prueba");

  // Seleccionamos el form correcto (el de comentarios)
  const commentForm = page.locator("form", { hasText: "Correo electrónico" });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-expect-error */
  await commentForm.evaluate((form) => form.requestSubmit());

  // Validamos que aparece
  await expect(page.getByText(/Comentario E2E de prueba/)).toBeVisible({
    timeout: 20000,
  });
});

test.afterEach(async () => {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("email", "e2e@test.com");

  if (error) {
    console.error("❌ Error al eliminar comentario de prueba:", error);
  } else {
    console.log("🧹 Comentarios de e2e@test.com eliminados");
  }
});
