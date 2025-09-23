// e2e/search.spec.ts
import { test, expect } from "@playwright/test";

test("un usuario puede buscar un post real en Supabase", async ({ page }) => {
  await page.goto("/");

  // Completar búsqueda con algo que sabes que existe en la base
  await page.getByRole("textbox").fill("accesibilidad");
  await page.getByRole("button", { name: "Search" }).click();

  // Validar redirección
  await expect(page).toHaveURL(/\/search\?q=accesibilidad/);

  // Validar que aparece un resultado real
  await expect(
    page.getByRole("heading", { name: /accesibilidad web/i }),
  ).toBeVisible();
});
