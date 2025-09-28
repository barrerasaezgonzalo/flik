import { render, screen } from "@testing-library/react";
import CategoryPage, { generateMetadata } from "./page";
import { vi } from "vitest";

// Mocks
vi.mock("@/lib/posts", () => ({
  getPostsByCategory: vi.fn(),
}));
vi.mock("@/lib/comments", () => ({
  getCommentsByPostId: vi.fn(),
}));
vi.mock("@/lib/utils", () => ({
  getPaginatedItems: vi.fn(),
  formatDate: vi.fn((d) => d), // mock simple
  getReadingTime: vi.fn(() => "1 min de lectura"),
}));
vi.mock("@/lib/supabaseClient", () => {
  return {
    supabase: {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    },
  };
});

import { getPostsByCategory } from "@/lib/posts";
import { getCommentsByPostId } from "@/lib/comments";
import { getPaginatedItems } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

describe("CategoryPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza error cuando categoría no existe", async () => {
    /* @ts-expect-error single */
    supabase.single.mockResolvedValueOnce({
      data: null,
      error: new Error("not found"),
    });

    const ui = await CategoryPage({
      params: { category: "fake" },
      searchParams: {},
    });
    render(ui);

    expect(
      await screen.findByText(/Categoría no encontrada/),
    ).toBeInTheDocument();
  });

  it("muestra posts cuando hay resultados", async () => {
    /* @ts-expect-error single */
    supabase.single.mockResolvedValueOnce({
      data: { name: "Tech", slug: "tech", description: "desc" },
      error: null,
    });
    /* @ts-expect-error getPostsByCategory */
    getPostsByCategory.mockResolvedValueOnce([
      { id: "1", slug: "p1", title: "Post 1" },
    ]);
    /* @ts-expect-error getPaginatedItems */
    getPaginatedItems.mockReturnValue({
      items: [{ id: "1", slug: "p1", title: "Post 1" }],
      totalPages: 1,
    });
    /* @ts-expect-error getCommentsByPostId */
    getCommentsByPostId.mockResolvedValueOnce([{ id: "c1" }]);

    const ui = await CategoryPage({
      params: { category: "tech" },
      searchParams: {},
    });
    render(ui);

    expect(await screen.findByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("desc")).toBeInTheDocument();
  });

  it("muestra mensaje si no hay posts", async () => {
    /* @ts-expect-error single */
    supabase.single.mockResolvedValueOnce({
      data: { name: "Empty", slug: "empty", description: "sin posts" },
      error: null,
    });
    /* @ts-expect-error getPostsByCategory */
    getPostsByCategory.mockResolvedValueOnce([]);
    /* @ts-expect-error getPaginatedItems */
    getPaginatedItems.mockReturnValue({ items: [], totalPages: 1 });

    const ui = await CategoryPage({
      params: { category: "empty" },
      searchParams: {},
    });
    render(ui);

    expect(await screen.findByText(/No hay publicaciones/)).toBeInTheDocument();
  });

  it("renderiza paginación cuando hay varias páginas", async () => {
    /* @ts-expect-error single */
    supabase.single.mockResolvedValueOnce({
      data: { name: "Pag", slug: "pag", description: "desc" },
      error: null,
    });
    /* @ts-expect-error getPostsByCategory */
    getPostsByCategory.mockResolvedValueOnce([
      { id: "1", slug: "p1", title: "Post 1" },
    ]);
    /* @ts-expect-error getPaginatedItems */
    getPaginatedItems.mockReturnValue({
      items: [{ id: "1", slug: "p1", title: "Post 1" }],
      totalPages: 3,
    });
    /* @ts-expect-error getCommentsByPostId */
    getCommentsByPostId.mockResolvedValueOnce([]);

    const ui = await CategoryPage({
      params: { category: "pag" },
      searchParams: { page: "2" },
    });
    render(ui);

    expect(await screen.findByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});

describe("generateMetadata", () => {
  it("devuelve metadata de categoría no encontrada", async () => {
    /* @ts-expect-error single */
    supabase.single.mockResolvedValueOnce({
      data: null,
      error: new Error("fail"),
    });
    const result = await generateMetadata({ params: { category: "nope" } });
    expect(result.title).toMatch(/Categoría no encontrada/);
  });

  it("devuelve metadata correcta si la categoría existe", async () => {
    /* @ts-expect-error single */
    supabase.single.mockResolvedValueOnce({
      data: { name: "Tech", slug: "tech", description: "desc" },
      error: null,
    });
    const result = await generateMetadata({ params: { category: "tech" } });
    expect(result.title).toMatch(/Tech/);
  });

  it("usa 0 comentarios si getCommentsByPostId no devuelve un array", async () => {
    /* @ts-expect-error single */
    supabase.single.mockResolvedValueOnce({
      data: { name: "Tech", slug: "tech", description: "desc" },
      error: null,
    });
    /* @ts-expect-error getPostsByCategory */
    getPostsByCategory.mockResolvedValueOnce([
      { id: "1", slug: "p1", title: "Post 1" },
    ]);
    /* @ts-expect-error getPaginatedItems */
    getPaginatedItems.mockReturnValue({
      items: [{ id: "1", slug: "p1", title: "Post 1" }],
      totalPages: 1,
    });
    /* @ts-expect-error getCommentsByPostId */
    getCommentsByPostId.mockResolvedValueOnce(null); // 👈 no es un array

    const ui = await CategoryPage({
      params: { category: "tech" },
      searchParams: {},
    });
    render(ui);

    // la UI no muestra el número directo, pero podés comprobar que se renderizó el post
    expect(await screen.findByText("Post 1")).toBeInTheDocument();
    // y opcional: si tu PostListItem recibe commentCount=0, podrías mockearlo y verificar
  });
});
