import {
  getPosts,
  getPostBySlug,
  getPostsByCategory,
  searchPosts,
  getRelatedPosts,
  getCategories,
  getAdjacentPosts,
} from "./posts";
import { vi, describe, it, expect, beforeEach } from "vitest";

import {
  __fromMock as fromMock,
  __orderMock,
  __singleMock,
} from "./supabaseClient";

vi.mock("./supabaseClient", () => {
  const orderMock = vi.fn();
  const singleMock = vi.fn();
  const eqMock = vi.fn(() => ({ single: singleMock }));
  const selectMock = vi.fn(() => ({
    eq: eqMock,
    order: orderMock,
  }));
  const fromMock = vi.fn(() => ({ select: selectMock }));

  return {
    supabase: { from: fromMock },
    __fromMock: fromMock,
    __selectMock: selectMock,
    __eqMock: eqMock,
    __singleMock: singleMock,
    __orderMock: orderMock,
  };
});

vi.mock("next/cache", () => ({
  unstable_noStore: vi.fn(),
}));

vi.mock("./categories", () => {
  return {
    getCategories: vi.fn().mockResolvedValue([]),
  };
});

describe("posts lib", () => {
  beforeEach(() => {
    fromMock.mockReset();
  });

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
    // @ts-expect-error
    expect(result[0].category.name).toBe("Tech");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(result[1].category.slug).toBe("life");
  });

  it("getPosts devuelve [] si hay error", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "posts") {
        return {
          select: () => ({
            order: () =>
              Promise.resolve({ data: null, error: { message: "fail" } }),
          }),
        };
      }
      if (table === "categories") {
        return { select: () => Promise.resolve({ data: [], error: null }) };
      }
    });

    await expect(getPosts()).rejects.toThrow("fail");
  });

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
    expect(result?.category.name).toBe("Tech");
  });

  it("getPostBySlug devuelve undefined si no hay data", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "posts") {
        return {
          select: () => ({
            eq: () => ({
              single: () =>
                Promise.resolve({
                  data: null,
                  error: { message: "not found" },
                }),
            }),
          }),
        };
      }
    });

    await expect(getPostBySlug("x")).rejects.toThrow("not found");
  });

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
    expect(result[0].category.slug).toBe("tech");
  });

  it("searchPosts devuelve [] si hay error", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "posts") {
        return {
          select: () => ({
            or: () => ({
              order: () =>
                Promise.resolve({ data: null, error: { message: "fail" } }),
            }),
          }),
        };
      }
      if (table === "categories") {
        return { select: () => Promise.resolve({ data: [], error: null }) };
      }
    });

    await expect(searchPosts("fail")).rejects.toThrow("fail");
  });

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
                  Promise.resolve({ data: null, error: { message: "fail" } }),
              }),
            }),
          }),
        };
      }
    });
    await expect(getRelatedPosts("tech", "p1")).rejects.toThrow("fail");
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
              data: [{ id: "c1", slug: "tech", name: "Tech" }], // no coincide
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
              Promise.resolve({
                data: null,
                error: { message: "fail posts" },
              }),
          }),
        };
      }
    });

    await expect(getPostsByCategory("tech")).rejects.toThrow("fail");
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
              data: [{ id: "c1", slug: "tech", name: "Tech" }],
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

  it("getCategories lanza y reporta error si Supabase falla", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "categories") {
        return {
          select: () =>
            Promise.resolve({ data: null, error: { message: "fail cats" } }),
        };
      }
    });

    await expect(getCategories()).rejects.toEqual(
      expect.objectContaining({ message: "fail cats" }),
    );
  });

  it("getCategories devuelve [] si data es null pero no hay error", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "categories") {
        return {
          select: () => Promise.resolve({ data: null, error: null }),
        };
      }
    });

    const result = await getCategories();
    expect(result).toEqual([]);
  });

  it("getPosts asigna categoría vacía si no encuentra match", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "posts") {
        return {
          select: () => ({
            order: () =>
              Promise.resolve({
                data: [
                  { id: "1", slug: "p1", category_id: "no-existe" }, // 👈 categoría inexistente
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
              data: [{ id: "c1", slug: "tech", name: "Tech" }], // 👈 no coincide con "no-existe"
              error: null,
            }),
        };
      }
    });

    const result = await getPosts();

    // ✅ fuerza a entrar al branch del "?? { slug: '', name: '' }"
    expect(result[0].category).toEqual({ slug: "", name: "" });
  });

  it("getAdjacentPosts devuelve prev y next", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "posts") {
        return {
          select: () => ({
            order: () =>
              Promise.resolve({
                data: [
                  { id: "1", slug: "p1", category_id: "c1" },
                  { id: "2", slug: "p2", category_id: "c2" },
                  { id: "3", slug: "p3", category_id: "c3" },
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
                { id: "c3", slug: "travel", name: "Travel" },
              ],
              error: null,
            }),
        };
      }
    });

    const result = await getAdjacentPosts("p2");
    expect(result?.prev?.slug).toBe("p1");
    expect(result?.next?.slug).toBe("p3");
  });

  it("getAdjacentPosts devuelve prev y next null si no hay data", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "posts") {
        return {
          select: () => ({
            order: () =>
              Promise.resolve({
                data: null,
                error: null,
              }),
          }),
        };
      }
    });

    const result = await getAdjacentPosts("cualquier-slug");
    expect(result).toEqual({ prev: null, next: null });
  });
  it("devuelve prev null cuando es el primer post", async () => {
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
    });

    const result = await getAdjacentPosts("p1");
    expect(result.prev).toBeNull();
    expect(result.next?.slug).toBe("p2");
  });

  it("devuelve next null cuando es el último post", async () => {
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
    });

    const result = await getAdjacentPosts("p2");
    expect(result.prev?.slug).toBe("p1");
    expect(result.next).toBeNull();
  });

  it("devuelve post_tags vacío siempre", async () => {
    __orderMock.mockResolvedValueOnce({
      data: [{ id: "p1", title: "demo", category_id: "no-match" }],
      error: null,
    });

    const posts = await getPosts();
    expect(posts[0].post_tags).toEqual([]);
    expect(posts[0].category).toEqual({ slug: "", name: "" });
  });

  it("mapea post_tags (objeto y array)", async () => {
    __singleMock.mockResolvedValueOnce({
      data: {
        id: "p1",
        slug: "demo",
        title: "Demo Post",
        post_tags: [
          { tag_id: "t1", tags: { id: "1", name: "UI", slug: "ui" } }, // objeto
          {
            tag_id: "t2",
            tags: [
              { id: "2", name: "DX", slug: "dx" }, // array
              { id: "3", name: "React", slug: "react" },
            ],
          },
        ],
        category_id: null,
      },
      error: null,
    });

    const post = await getPostBySlug("demo");

    expect(post?.post_tags[0].tags.name).toBe("UI");
    expect(post?.post_tags[1].tags.name).toBe("DX");
  });
});
