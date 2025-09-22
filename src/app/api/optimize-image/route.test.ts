/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import type * as OptimizeRoute from "./route";

// Mocks
const existsSyncMock = vi.fn();
const writeFileMock = vi.fn();
const resizeMock = vi.fn();
const pngMock = vi.fn();
const toBufferMock = vi.fn();

// Mock fs
vi.mock("fs", () => ({
  default: {
    existsSync: existsSyncMock,
    promises: {
      writeFile: writeFileMock,
    },
  },
  existsSync: existsSyncMock,
  promises: {
    writeFile: writeFileMock,
  },
}));

// Mock sharp
vi.mock("sharp", () => ({
  default: vi.fn(() => ({
    resize: resizeMock.mockReturnThis(),
    png: pngMock.mockReturnThis(),
    toBuffer: toBufferMock,
  })),
}));

let POST: typeof OptimizeRoute.POST;

describe("API /optimize route", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const route = await import("./route");
    POST = route.POST;
  });

  it("devuelve 404 si el archivo no existe", async () => {
    existsSyncMock.mockReturnValue(false);

    const req = new Request("http://localhost/api/optimize", {
      method: "POST",
      body: JSON.stringify({ fileName: "missing.png" }),
    });

    const res = await POST(req as any);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json).toEqual({
      ok: false,
      error: "El archivo no existe en /public",
    });
  });

  it("optimiza la imagen correctamente", async () => {
    existsSyncMock.mockReturnValue(true);
    toBufferMock.mockResolvedValue(Buffer.from("fakeimg"));

    const req = new Request("http://localhost/api/optimize", {
      method: "POST",
      body: JSON.stringify({ fileName: "test.png" }),
    });

    const res = await POST(req as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true });
    expect(writeFileMock).toHaveBeenCalled();
  });

  it("devuelve 500 si ocurre un error inesperado", async () => {
    existsSyncMock.mockImplementation(() => {
      throw new Error("fs error");
    });

    const req = new Request("http://localhost/api/optimize", {
      method: "POST",
      body: JSON.stringify({ fileName: "test.png" }),
    });

    const res = await POST(req as any);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.ok).toBe(false);
    expect(json.error).toContain("Error: fs error");
  });
});
