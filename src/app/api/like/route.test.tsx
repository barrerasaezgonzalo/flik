import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST, GET } from "./route";

const maybeSingle = vi.fn();
const single = vi.fn();
const upsert = vi.fn();
const select = vi.fn();
const eq = vi.fn();

vi.mock("@supabase/supabase-js", () => {
  return {
    createClient: vi.fn(() => ({
      from: () => ({
        select,
        upsert,
      }),
    })),
  };
});

beforeEach(() => {
  maybeSingle.mockReset();
  single.mockReset();
  upsert.mockReset();
  select.mockReset();
  eq.mockReset();
});

describe("POST /api/like", () => {
  it("incrementa likes correctamente", async () => {
    // Supabase: lectura
    select.mockReturnValue({
      eq: () => ({ maybeSingle }),
    });
    maybeSingle.mockResolvedValue({ data: { likes: 5 }, error: null });

    // Supabase: escritura
    upsert.mockReturnValue({
      select: () => ({ single }),
    });
    single.mockResolvedValue({ data: { likes: 6 }, error: null });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req = { json: async () => ({ postId: "123" }) } as any;
    const res = await POST(req);
    const body = await res.json();

    expect(body).toEqual({ likes: 6 });
  });

  it("retorna error si Supabase falla", async () => {
    select.mockReturnValue({
      eq: () => ({ maybeSingle }),
    });
    maybeSingle.mockResolvedValue({ data: null, error: { message: "fail" } });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req = { json: async () => ({ postId: "123" }) } as any;
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body).toEqual({ error: "fail" });
  });
});

describe("GET /api/like", () => {
  it("devuelve likes actuales", async () => {
    select.mockReturnValue({
      eq: () => ({ maybeSingle }),
    });
    maybeSingle.mockResolvedValue({ data: { likes: 42 }, error: null });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req = { url: "http://localhost/api/like?postId=123" } as any;
    const res = await GET(req);
    const body = await res.json();

    expect(body).toEqual({ likes: 42 });
  });

  it("devuelve 0 si no hay data", async () => {
    select.mockReturnValue({
      eq: () => ({ maybeSingle }),
    });
    maybeSingle.mockResolvedValue({ data: null, error: null });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req = { url: "http://localhost/api/like?postId=123" } as any;
    const res = await GET(req);
    const body = await res.json();

    expect(body).toEqual({ likes: 0 });
  });

  it("retorna error si falla el upsert", async () => {
    // Simula lectura OK
    select.mockReturnValue({
      eq: () => ({ maybeSingle }),
    });
    maybeSingle.mockResolvedValue({ data: { likes: 5 }, error: null });

    // Simula escritura con error
    upsert.mockReturnValue({
      select: () => ({ single }),
    });
    single.mockResolvedValue({
      data: null,
      error: { message: "upsert failed" },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req = { json: async () => ({ postId: "123" }) } as any;
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body).toEqual({ error: "upsert failed" });
  });
  it("usa 0 como valor inicial si no existe el post en la tabla", async () => {
    // Simula lectura sin fila (row null)
    select.mockReturnValue({
      eq: () => ({ maybeSingle }),
    });
    maybeSingle.mockResolvedValue({ data: null, error: null }); // 👈 no hay likes

    // Simula escritura: crea fila con likes=1
    upsert.mockReturnValue({
      select: () => ({ single }),
    });
    single.mockResolvedValue({ data: { likes: 1 }, error: null });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req = { json: async () => ({ postId: "nuevo-post" }) } as any;
    const res = await POST(req);
    const body = await res.json();

    expect(body).toEqual({ likes: 1 });
  });

  it("POST usa 0 si upsert devuelve likes: null", async () => {
    // lectura OK (p. ej. tenía 5)
    select.mockReturnValue({
      eq: () => ({ maybeSingle }),
    });
    maybeSingle.mockResolvedValue({ data: { likes: 5 }, error: null });

    // escritura responde con likes: null
    upsert.mockReturnValue({
      select: () => ({ single }),
    });
    single.mockResolvedValue({ data: { likes: null }, error: null });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req = { json: async () => ({ postId: "123" }) } as any;
    const res = await POST(req);
    const body = await res.json();

    expect(body).toEqual({ likes: 0 });
  });

  // --- POST: fallback cuando upsert responde sin campo likes
  it("POST usa 0 si upsert no incluye el campo likes", async () => {
    // lectura OK
    select.mockReturnValue({
      eq: () => ({ maybeSingle }),
    });
    maybeSingle.mockResolvedValue({ data: { likes: 2 }, error: null });

    // escritura responde sin likes
    upsert.mockReturnValue({
      select: () => ({ single }),
    });
    single.mockResolvedValue({ data: {} as any, error: null });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req = { json: async () => ({ postId: "123" }) } as any;
    const res = await POST(req);
    const body = await res.json();

    expect(body).toEqual({ likes: 0 });
  });
  it("GET usa 0 si la fila existe pero likes es null", async () => {
    select.mockReturnValue({
      eq: () => ({ maybeSingle }),
    });
    maybeSingle.mockResolvedValue({ data: { likes: null }, error: null });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req = { url: "http://localhost/api/like?postId=abc" } as any;
    const res = await GET(req);
    const body = await res.json();

    expect(body).toEqual({ likes: 0 });
  });

  // --- GET: fallback cuando select devuelve data sin campo likes
  it("GET usa 0 si la fila existe pero no trae el campo likes", async () => {
    select.mockReturnValue({
      eq: () => ({ maybeSingle }),
    });
    maybeSingle.mockResolvedValue({ data: {} as any, error: null });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req = { url: "http://localhost/api/like?postId=abc" } as any;
    const res = await GET(req);
    const body = await res.json();

    expect(body).toEqual({ likes: 0 });
  });
});
