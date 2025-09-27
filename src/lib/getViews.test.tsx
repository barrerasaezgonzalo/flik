// src/lib/getViews.test.ts

// 👇 usamos vi.hoisted para definir los mocks ANTES que el vi.mock
const { mockEq, mockSelect, mockFrom } = vi.hoisted(() => {
  const mockEq = vi.fn();
  const mockSelect = vi.fn(() => ({ eq: mockEq }));
  const mockFrom = vi.fn(() => ({ select: mockSelect }));
  return { mockEq, mockSelect, mockFrom };
});

// ahora mockeamos supabase-js
vi.mock("@supabase/supabase-js", () => {
  return {
    createClient: vi.fn(() => ({
      from: mockFrom,
    })),
  };
});

import { vi } from "vitest";
// importamos después del mock
import { getViews } from "./getViews";

describe("getViews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devuelve el número de visitas cuando Supabase responde con count", async () => {
    mockEq.mockResolvedValueOnce({ count: 42 });

    const result = await getViews("mi-post");

    expect(mockFrom).toHaveBeenCalledWith("page_views");
    expect(mockSelect).toHaveBeenCalledWith("*", {
      count: "exact",
      head: true,
    });
    expect(mockEq).toHaveBeenCalledWith("slug", "mi-post");
    expect(result).toBe(42);
  });

  it("devuelve 0 cuando Supabase no responde con count", async () => {
    mockEq.mockResolvedValueOnce({ count: null });

    const result = await getViews("otro-post");

    expect(result).toBe(0);
  });
});
