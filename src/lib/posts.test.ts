import {
  getPosts,
  getPostBySlug,
  getPostsByCategory,
  searchPosts,
  getRelatedPosts,
} from "./posts";
import { vi, describe, it, expect, beforeEach } from "vitest";

// ---- Mock de supabase ----
// definimos el mock dentro del factory y lo exportamos como __fromMock
vi.mock("./supabaseClient", () => {
  const fromMock = vi.fn();
  return {
    supabase: { from: fromMock },
    __fromMock: fromMock,
  };
});

// ---- Mock de next/cache ----
vi.mock("next/cache", () => ({
  unstable_noStore: vi.fn(),
}));

// 👇 Importamos el mock expuesto
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* @ts-expect-error */
import { __fromMock as fromMock } from "./supabaseClient";

describe("posts lib", () => {
  beforeEach(() => {
    fromMock.mockReset();
  });

  // ------------------------
  // getPosts
  // ------------------------
  it("getPosts devuelve posts con categorías", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "posts") {
        return {
          select: () => ({
            order: () =>
              Promise.resolve({
                data: [
                  { id: "1", slug: "p1", category_id: "c1" },
                  { id: "2", slug: "p2", category_id: "c2" },
                ],
                error: null,
              }),
          }),
        };
      }
      if (table === "categories") {
        return {
          select: () =>
            Promise.resolve({
              data: [
                { id: "c1", slug: "tech", name: "Tech" },
                { id: "c2", slug: "life", name: "Life" },
              ],
              error: null,
            }),
        };
      }
    });

    const result = await getPosts();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /* @ts-expect-error */
    expect(result[0].category.name).toBe("Tech");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /* @ts-expect-error */
    expect(result[1].category.slug).toBe("life");
  });

  it("getPosts devuelve [] si hay error", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "posts") {
        return {
          select: () => ({
            order: () =>
              Promise.resolve({ data: null, error: new Error("fail") }),
          }),
        };
      }
      if (table === "categories") {
        return { select: () => Promise.resolve({ data: [], error: null }) };
      }
    });

    const result = await getPosts();
    expect(result).toEqual([]);
  });

  // ------------------------
  // getPostBySlug
  // ------------------------
  it("getPostBySlug devuelve un post", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "posts") {
        return {
          select: () => ({
            eq: () => ({
              single: () =>
                Promise.resolve({
                  data: { id: "1", slug: "p1", category_id: "c1" },
                  error: null,
                }),
            }),
          }),
        };
      }
      if (table === "categories") {
        return {
          select: () =>
            Promise.resolve({
              data: [{ id: "c1", slug: "tech", name: "Tech" }],
              error: null,
            }),
        };
      }
    });

    const result = await getPostBySlug("p1");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /* @ts-expect-error */
    expect(result?.category.name).toBe("Tech");
  });

  it("getPostBySlug devuelve undefined si no hay data", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "posts") {
        return {
          select: () => ({
            eq: () => ({
              single: () =>
                Promise.resolve({ data: null, error: new Error("not found") }),
            }),
          }),
        };
      }
    });

    const result = await getPostBySlug("x");
    expect(result).toBeUndefined();
  });

  // ------------------------
  // getPostsByCategory
  // ------------------------
  it("getPostsByCategory filtra por categoría", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "categories") {
        return {
          select: () =>
            Promise.resolve({
              data: [{ id: "c1", slug: "tech", name: "Tech" }],
              error: null,
            }),
        };
      }
      if (table === "posts") {
        return {
          select: () => ({
            order: () =>
              Promise.resolve({
                data: [
                  { id: "1", slug: "p1", category_id: "c1" },
                  { id: "2", slug: "p2", category_id: "c2" },
                ],
                error: null,
              }),
          }),
        };
      }
    });

    const result = await getPostsByCategory("tech");
    expect(result).toHaveLength(1);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /* @ts-expect-error */
    expect(result[0].category.name).toBe("Tech");
  });

  it("getPostsByCategory devuelve [] si categoría no existe", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "categories") {
        return { select: () => Promise.resolve({ data: [], error: null }) };
      }
      if (table === "posts") {
        return {
          select: () => ({
            order: () =>
              Promise.resolve({
                data: [{ id: "1", slug: "p1", category_id: "c1" }],
                error: null,
              }),
          }),
        };
      }
    });

    const result = await getPostsByCategory("fake");
    expect(result).toEqual([]);
  });

  // ------------------------
  // searchPosts
  // ------------------------
  it("searchPosts devuelve posts con match", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "posts") {
        return {
          select: () => ({
            or: () => ({
              order: () =>
                Promise.resolve({
                  data: [
                    { id: "1", slug: "p1", title: "hola", category_id: "c1" },
                  ],
                  error: null,
                }),
            }),
          }),
        };
      }
      if (table === "categories") {
        return {
          select: () =>
            Promise.resolve({
              data: [{ id: "c1", slug: "tech", name: "Tech" }],
              error: null,
            }),
        };
      }
    });

    const result = await searchPosts("hola");
    expect(result[0].title).toBe("hola");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /* @ts-expect-error */
    expect(result[0].category.slug).toBe("tech");
  });

  it("searchPosts devuelve [] si hay error", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "posts") {
        return {
          select: () => ({
            or: () => ({
              order: () =>
                Promise.resolve({ data: null, error: new Error("fail") }),
            }),
          }),
        };
      }
      if (table === "categories") {
        return { select: () => Promise.resolve({ data: [], error: null }) };
      }
    });

    const result = await searchPosts("fail");
    expect(result).toEqual([]);
  });

  // ------------------------
  // getRelatedPosts
  // ------------------------
  it("getRelatedPosts excluye slug actual y limita a 3", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "categories") {
        return {
          select: () =>
            Promise.resolve({
              data: [{ id: "c1", slug: "tech", name: "Tech" }],
              error: null,
            }),
        };
      }
      if (table === "posts") {
        return {
          select: () => ({
            neq: () => ({
              order: () => ({
                limit: () =>
                  Promise.resolve({
                    data: [
                      { id: "1", slug: "p1", category_id: "c1" },
                      { id: "2", slug: "p2", category_id: "c1" },
                      { id: "3", slug: "p3", category_id: "c1" },
                      { id: "4", slug: "p4", category_id: "c1" },
                    ],
                    error: null,
                  }),
              }),
            }),
          }),
        };
      }
    });

    const result = await getRelatedPosts("tech", "pX");
    expect(result).toHaveLength(3);
  });

  it("getRelatedPosts devuelve [] si hay error", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "categories") {
        return { select: () => Promise.resolve({ data: [], error: null }) };
      }
      if (table === "posts") {
        return {
          select: () => ({
            neq: () => ({
              order: () => ({
                limit: () =>
                  Promise.resolve({ data: null, error: new Error("fail") }),
              }),
            }),
          }),
        };
      }
    });

    const result = await getRelatedPosts("tech", "p1");
    expect(result).toEqual([]);
  });

  it("getPosts devuelve [] si getCategories falla", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "posts") {
        return {
          select: () => ({
            order: () =>
              Promise.resolve({
                data: [{ id: "1", slug: "p1", category_id: "c1" }],
                error: null,
              }),
          }),
        };
      }
      if (table === "categories") {
        return {
          select: () =>
            Promise.resolve({ data: null, error: new Error("fail cats") }),
        };
      }
    });

    const result = await getPosts();
    // debería mapear posts pero categorías = []
    expect(result[0].category).toEqual({ slug: "", name: "" });
  });

  it("getPostBySlug devuelve post con categoría vacía si no encuentra match", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "posts") {
        return {
          select: () => ({
            eq: () => ({
              single: () =>
                Promise.resolve({
                  data: { id: "1", slug: "p1", category_id: "cX" },
                  error: null,
                }),
            }),
          }),
        };
      }
      if (table === "categories") {
        return {
          select: () =>
            Promise.resolve({
              data: [{ id: "c1", slug: "tech", name: "Tech" }], // 👈 no coincide
              error: null,
            }),
        };
      }
    });

    const result = await getPostBySlug("p1");
    expect(result?.category).toEqual({ slug: "", name: "" });
  });

  it("getPostsByCategory devuelve [] si postsError está presente", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "categories") {
        return {
          select: () =>
            Promise.resolve({
              data: [{ id: "c1", slug: "tech", name: "Tech" }],
              error: null,
            }),
        };
      }
      if (table === "posts") {
        return {
          select: () => ({
            order: () =>
              Promise.resolve({ data: null, error: new Error("fail posts") }),
          }),
        };
      }
    });

    const result = await getPostsByCategory("tech");
    expect(result).toEqual([]);
  });

  it("searchPosts devuelve post con categoría vacía si no encuentra match", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "posts") {
        return {
          select: () => ({
            or: () => ({
              order: () =>
                Promise.resolve({
                  data: [
                    {
                      id: "1",
                      slug: "p1",
                      title: "post raro",
                      category_id: "cX",
                    },
                  ],
                  error: null,
                }),
            }),
          }),
        };
      }
      if (table === "categories") {
        return {
          select: () =>
            Promise.resolve({
              data: [{ id: "c1", slug: "tech", name: "Tech" }], // 👈 no coincide
              error: null,
            }),
        };
      }
    });

    const result = await searchPosts("raro");
    expect(result[0].category).toEqual({ slug: "", name: "" });
  });
  it("getRelatedPosts devuelve [] si la categoría no existe (branch !category)", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "categories") {
        // No hay categoría con el slug solicitado
        return {
          select: () =>
            Promise.resolve({
              data: [{ id: "c1", slug: "tech", name: "Tech" }],
              error: null,
            }),
        };
      }
      if (table === "posts") {
        // Posts válidos para que no corte antes por postsError/!posts
        return {
          select: () => ({
            neq: () => ({
              order: () => ({
                limit: () =>
                  Promise.resolve({
                    data: [
                      { id: "1", slug: "p1", category_id: "c1" },
                      { id: "2", slug: "p2", category_id: "c1" },
                    ],
                    error: null,
                  }),
              }),
            }),
          }),
        };
      }
    });

    const result = await getRelatedPosts("no-existe", "pX");
    expect(result).toEqual([]);
  });
});
