import { getCommentsByPostId, addComment } from "./comments";
import { vi } from "vitest";

// Creamos un mock del cliente de Supabase
const fromMock = vi.fn();
const selectMock = vi.fn();
const eqMock = vi.fn();
const orderMock = vi.fn();
const insertMock = vi.fn();
const singleMock = vi.fn();

vi.mock("./supabaseClient", () => ({
  supabase: {
    from: (table: string) => {
      if (table === "comments") {
        return {
          select: selectMock,
          insert: insertMock,
        };
      }
      throw new Error("Tabla desconocida");
    },
  },
}));

describe("comments lib", () => {
  beforeEach(() => {
    fromMock.mockReset();
    selectMock.mockReset();
    eqMock.mockReset();
    orderMock.mockReset();
    insertMock.mockReset();
    singleMock.mockReset();
  });

  describe("getCommentsByPostId", () => {
    it("devuelve comentarios cuando no hay error", async () => {
      // mock chain: select -> eq -> order
      orderMock.mockResolvedValueOnce({
        data: [
          {
            id: "1",
            content: "Hola",
            postId: "post-1",
            email: "test@test.com",
            date: "2025-01-01",
          },
        ],
        error: null,
      });
      eqMock.mockReturnValueOnce({ order: orderMock });
      selectMock.mockReturnValueOnce({ eq: eqMock });

      const result = await getCommentsByPostId("post-1");

      expect(result).toHaveLength(1);
      expect(result[0].content).toBe("Hola");
      expect(selectMock).toHaveBeenCalledWith("*");
      expect(eqMock).toHaveBeenCalledWith("postId", "post-1");
    });

    it("devuelve [] si hay error", async () => {
      orderMock.mockResolvedValueOnce({
        data: null,
        error: new Error("Fallo supabase"),
      });
      eqMock.mockReturnValueOnce({ order: orderMock });
      selectMock.mockReturnValueOnce({ eq: eqMock });

      const result = await getCommentsByPostId("post-1");

      expect(result).toEqual([]);
    });
  });

  describe("addComment", () => {
    it("inserta y devuelve un comentario", async () => {
      const fakeComment = {
        postId: "post-1",
        email: "yo@test.com",
        content: "Genial",
      };
      const fakeResponse = { id: "99", date: "2025-01-01", ...fakeComment };

      // Mock de la cadena insert -> select -> single
      insertMock.mockReturnValueOnce({
        select: () => ({
          single: () => Promise.resolve({ data: fakeResponse, error: null }),
        }),
      });

      const result = await addComment(fakeComment);

      expect(result).toEqual(fakeResponse);
      expect(insertMock).toHaveBeenCalledWith(fakeComment);
    });

    it("lanza error si supabase devuelve error", async () => {
      const fakeComment = {
        postId: "post-1",
        email: "yo@test.com",
        content: "Genial",
      };

      // Mock de la cadena completa
      insertMock.mockReturnValueOnce({
        select: () => ({
          single: () =>
            Promise.resolve({ data: null, error: new Error("DB error") }),
        }),
      });

      await expect(addComment(fakeComment)).rejects.toThrow("DB error");
    });

    it("devuelve [] si supabase no trae data ni error", async () => {
      // Mock chain: select -> eq -> order
      eqMock.mockReturnValueOnce({
        order: () => Promise.resolve({ data: null, error: null }),
      });
      selectMock.mockReturnValueOnce({ eq: eqMock });

      const result = await getCommentsByPostId("post-1");

      expect(result).toEqual([]); // cubre el branch (data ?? [])
    });
  });
});
