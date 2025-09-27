// src/app/api/track-view/route.test.ts
import { vi } from "vitest";
import { POST } from "./route";

const mockInsert = vi.fn();

vi.mock("@supabase/supabase-js", () => {
  return {
    createClient: vi.fn(() => ({
      from: () => ({ insert: mockInsert }),
    })),
  };
});

describe("POST /api/track-view", () => {
  beforeEach(() => {
    mockInsert.mockReset();
  });

  it("inserta correctamente y devuelve ok", async () => {
    mockInsert.mockResolvedValueOnce({ error: null });

    const req = new Request("http://localhost/api/track-view", {
      method: "POST",
      body: JSON.stringify({ slug: "mi-post" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("ok");
    expect(mockInsert).toHaveBeenCalledWith({ slug: "mi-post" });
  });

  it("devuelve error si supabase falla", async () => {
    mockInsert.mockResolvedValueOnce({ error: { message: "fail" } });

    const req = new Request("http://localhost/api/track-view", {
      method: "POST",
      body: JSON.stringify({ slug: "otro-post" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    expect(await res.text()).toBe("error");
    expect(mockInsert).toHaveBeenCalledWith({ slug: "otro-post" });
  });
});
