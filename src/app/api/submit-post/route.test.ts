import { describe, it, expect, vi, beforeEach } from "vitest";
import type * as SubmitPostRoute from "./route";

// mocks para fs/promises
const accessMock = vi.fn();
const writeFileMock = vi.fn();
const readFileMock = vi.fn();

vi.mock("fs/promises", () => ({
  default: {
    access: accessMock,
    writeFile: writeFileMock,
    readFile: readFileMock,
  },
  access: accessMock,
  writeFile: writeFileMock,
  readFile: readFileMock,
}));

let POST: typeof SubmitPostRoute.POST;

describe("API /submit-post route", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const route = await import("./route");
    POST = route.POST;
  });

  it("devuelve 400 si faltan campos", async () => {
    const req = new Request("http://localhost/api/submit-post", {
      method: "POST",
      body: JSON.stringify({ title: "Hola" }), // faltan email, category, content
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({ message: "Missing required fields" });
  });

  it("crea un nuevo post cuando los datos son válidos", async () => {
    // fs.access no tira error (el archivo existe)
    accessMock.mockResolvedValue(undefined);

    // fs.readFile devuelve un JSON vacío
    readFileMock.mockResolvedValue("[]");

    // fs.writeFile simula guardado ok
    writeFileMock.mockResolvedValue(undefined);

    const req = new Request("http://localhost/api/submit-post", {
      method: "POST",
      body: JSON.stringify({
        title: "Nuevo Post",
        email: "a@test.com",
        category: "tech",
        content: "Contenido acá",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json).toEqual({ message: "Post submitted successfully" });
    expect(writeFileMock).toHaveBeenCalled();
  });

  it("crea el archivo si no existe", async () => {
    // fs.access lanza error → el archivo no existe
    accessMock.mockRejectedValue(new Error("not found"));

    // fs.readFile simula archivo vacío
    readFileMock.mockResolvedValue("[]");

    writeFileMock.mockResolvedValue(undefined);

    const req = new Request("http://localhost/api/submit-post", {
      method: "POST",
      body: JSON.stringify({
        title: "Post Nuevo",
        email: "x@test.com",
        category: "random",
        content: "Texto",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json).toEqual({ message: "Post submitted successfully" });
    expect(writeFileMock).toHaveBeenCalled();
  });

  it("devuelve 500 si ocurre un error inesperado", async () => {
    // forzamos que fs.readFile tire error
    accessMock.mockResolvedValue(undefined);
    readFileMock.mockRejectedValue(new Error("disk error"));

    const req = new Request("http://localhost/api/submit-post", {
      method: "POST",
      body: JSON.stringify({
        title: "Error Post",
        email: "fail@test.com",
        category: "err",
        content: "Error",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ message: "Internal Server Error" });
  });
});
