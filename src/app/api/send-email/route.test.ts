import { describe, it, expect, vi, beforeEach } from "vitest";
import type * as SendEmailRoute from "./route";

// Mocks
const supabaseFromMock = vi.fn();
const selectMock = vi.fn();
const eqMock = vi.fn();
const singleMock = vi.fn();
const sendMock = vi.fn();

// Mock supabase
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: supabaseFromMock,
  })),
}));

// Mock Resend
vi.mock("resend", () => ({
  Resend: vi.fn(() => ({
    emails: { send: sendMock },
  })),
}));

let POST: typeof SendEmailRoute.POST;

describe("API /send-email route", () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    const route = await import("./route");
    POST = route.POST;
  });

  it("devuelve 400 si no es un evento INSERT de comments", async () => {
    const req = new Request("http://localhost/api/send-email", {
      method: "POST",
      body: JSON.stringify({ type: "UPDATE", table: "posts", record: {} }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({ ok: false, reason: "Evento no soportado" });
  });

  it("envía un correo correctamente cuando el evento es válido", async () => {
    // Mock Supabase → retorna un post con título
    supabaseFromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve({
              data: { slug: "post-slug", title: "Título Post" },
              error: null,
            }),
        }),
      }),
    });

    // Mock Resend → simula envío exitoso
    sendMock.mockResolvedValue({ id: "email-123" });

    const req = new Request("http://localhost/api/send-email", {
      method: "POST",
      body: JSON.stringify({
        type: "INSERT",
        table: "comments",
        record: { postId: "1", email: "a@test.com", content: "Buen post!" },
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(sendMock).toHaveBeenCalled();
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining("Título Post"),
        to: "barrerasaezgonzalo@gmail.com",
      }),
    );
  });

  it("devuelve 500 si ocurre un error inesperado", async () => {
    // Mockear Supabase aunque no lo usemos
    supabaseFromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve({ data: { slug: "slug" }, error: null }),
        }),
      }),
    });

    // Forzar que Resend falle
    sendMock.mockRejectedValueOnce(new Error("SMTP down"));

    const req = new Request("http://localhost/api/send-email", {
      method: "POST",
      body: JSON.stringify({
        type: "INSERT",
        table: "comments",
        record: { postId: "1", email: "a@test.com", content: "Hola!" },
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.ok).toBe(false);
    expect(json.error).toContain("SMTP down");
  });

  it("loggea un error si Supabase falla al buscar el post", async () => {
    // Mock supabase con error
    supabaseFromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve({ data: null, error: { message: "DB error" } }),
        }),
      }),
    });

    // Mock Resend para que devuelva ok igualmente
    sendMock.mockResolvedValue({ id: "email-123" });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const req = new Request("http://localhost/api/send-email", {
      method: "POST",
      body: JSON.stringify({
        type: "INSERT",
        table: "comments",
        record: { postId: "1", email: "a@test.com", content: "Buen post!" },
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    // Igual sigue devolviendo 200 porque el branch no corta la ejecución
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);

    // Confirmamos que console.error fue llamado
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error buscando post:",
      expect.objectContaining({ message: "DB error" }),
    );

    consoleSpy.mockRestore();
  });
});
