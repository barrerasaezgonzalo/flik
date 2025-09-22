import { vi } from "vitest";

describe("supabaseClient", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    vi.resetModules(); // limpia caché de imports
    process.env = { ...OLD_ENV }; // clona
  });

  afterEach(() => {
    process.env = OLD_ENV; // restaura
  });

  it("llama a createClient con undefined si falta la URL", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";

    const createClientMock = vi.fn().mockReturnValue("FAKE_CLIENT");
    vi.doMock("@supabase/supabase-js", () => ({
      createClient: createClientMock,
    }));

    const { supabase } = await import("./supabaseClient");

    expect(createClientMock).toHaveBeenCalledWith(undefined, "anon-key");
    expect(supabase).toBe("FAKE_CLIENT");
  });
});
