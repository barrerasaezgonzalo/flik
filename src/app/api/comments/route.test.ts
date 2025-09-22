import { describe, it, expect, vi, beforeEach } from "vitest";

// Creamos mocks "vacíos" que vamos a rellenar
const fromMock = vi.fn();

// 1. Mockear supabase ANTES de importar la route
vi.mock("@/lib/supabaseClient", () => ({
  supabase: { from: fromMock },
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let GET: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let POST: any;

describe("API /comments route", () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    // 2. Importar dinámicamente la route después de mockear
    const route = await import("./route");
    GET = route.GET;
    POST = route.POST;
  });

  describe("GET", () => {
    it("devuelve comentarios cuando no hay error", async () => {
      fromMock.mockReturnValueOnce({
        select: () => ({
          order: () =>
            Promise.resolve({
              data: [{ id: "1", content: "Hola" }],
              error: null,
            }),
        }),
      });

      const res = await GET();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toEqual([{ id: "1", content: "Hola" }]);
    });

    it("devuelve 500 si supabase devuelve error", async () => {
      fromMock.mockReturnValueOnce({
        select: () => ({
          order: () =>
            Promise.resolve({ data: null, error: { message: "DB down" } }),
        }),
      });

      const res = await GET();
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json).toEqual({ error: "DB down" });
    });
  });

  describe("POST", () => {
    it("devuelve 400 si faltan campos", async () => {
      const req = new Request("http://localhost/api/comments", {
        method: "POST",
        body: JSON.stringify({ email: "a@test.com" }), // faltan campos
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json).toEqual({ error: "Faltan campos obligatorios" });
    });

    it("crea un comentario y devuelve 201 si todo va bien", async () => {
      fromMock.mockReturnValueOnce({
        insert: () => ({
          select: () => ({
            single: () =>
              Promise.resolve({
                data: {
                  id: "1",
                  postId: "p1",
                  email: "a@test.com",
                  content: "Hola",
                },
                error: null,
              }),
          }),
        }),
      });

      const req = new Request("http://localhost/api/comments", {
        method: "POST",
        body: JSON.stringify({
          postId: "p1",
          email: "a@test.com",
          content: "Hola",
        }),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json).toEqual({
        id: "1",
        postId: "p1",
        email: "a@test.com",
        content: "Hola",
      });
    });

    it("devuelve 500 si supabase devuelve error", async () => {
      fromMock.mockReturnValueOnce({
        insert: () => ({
          select: () => ({
            single: () =>
              Promise.resolve({ data: null, error: { message: "DB error" } }),
          }),
        }),
      });

      const req = new Request("http://localhost/api/comments", {
        method: "POST",
        body: JSON.stringify({
          postId: "p1",
          email: "a@test.com",
          content: "Hola",
        }),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json).toEqual({ error: "DB error" });
    });
  });
});
