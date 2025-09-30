// PostsPage.test.tsx

import { vi, describe, it, expect } from "vitest";
// mock redirect antes de importar la página
vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    // simular que lanza para cortar ejecución
    throw new Error("REDIRECT");
  }),
}));

import PostsPage from "./page";

describe("PostsPage redirect", () => {
  it("llama redirect a /", async () => {
    expect(() => {
      PostsPage();
    }).toThrow("REDIRECT");
    const { redirect } = await import("next/navigation");
    expect(redirect).toHaveBeenCalledWith("/");
  });
});
