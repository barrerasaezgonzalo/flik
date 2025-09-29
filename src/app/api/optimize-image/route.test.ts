/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import type * as OptimizeRoute from "./route";
import { waitFor } from "@testing-library/react";

// Mocks
const mkdirMock = vi.fn();
const toFileMock = vi.fn();

vi.mock("fs/promises", () => ({
  default: {
    mkdir: mkdirMock,
  },
  mkdir: mkdirMock,
}));

vi.mock("sharp", () => {
  return {
    default: vi.fn(() => ({
      resize: vi.fn().mockReturnThis(),
      png: vi.fn().mockReturnThis(),
      toFile: toFileMock,
    })),
  };
});

let POST: typeof OptimizeRoute.POST;

describe("API /optimize-image route", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const route = await import("./route");
    POST = route.POST;
  });

  it("devuelve 400 si no se envía archivo", async () => {
    const req: any = {
      formData: async () => new FormData(), // vacío
    };

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({ ok: false, error: "No se envió archivo" });
  });

  it("optimiza la imagen y devuelve la URL", async () => {
    const fakeFile = new File(["fakecontent"], "test.png", {
      type: "image/png",
    });
    // forzamos un arrayBuffer válido
    /* @ts-expect-error sobreescribimos un método */
    fakeFile.arrayBuffer = async () => Buffer.from("fakecontent");

    const form = new FormData();
    form.set("file", fakeFile);

    toFileMock.mockResolvedValue(undefined);

    const req: any = {
      formData: async () => form,
    };

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.url).toMatch(/^\/uploads\/\d+-test\.png$/);
    expect(mkdirMock).toHaveBeenCalled();
    expect(toFileMock).toHaveBeenCalled();
  });

  it("devuelve 500 si ocurre un error inesperado", async () => {
    const fakeFile = new File(["fakecontent"], "fail.png", {
      type: "image/png",
    });
    // sobreescribimos arrayBuffer para que sea válido
    /* @ts-expect-error sobreescribimos un método */
    fakeFile.arrayBuffer = async () => Buffer.from("fakecontent");

    const form = new FormData();
    form.set("file", fakeFile);

    toFileMock.mockRejectedValue(new Error("sharp error"));

    const req: any = {
      formData: async () => form,
    };

    const res = await POST(req);
    const json = await res.json();
    await waitFor(() => {
      expect(res.status).toBe(500);
      expect(json.ok).toBe(false);
      expect(json.error).toContain("sharp error");
    });
  });
});
