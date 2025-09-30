// robots.test.ts

import { GET } from "./route"; // ajusta la ruta al archivo donde define GET

describe("Robots.txt GET", () => {
  it("devuelve contenido correcto con headers", async () => {
    const response = await GET();

    // Verificar que el body contiene lo esperado
    const text = await response.text();
    expect(text).toContain("User-agent: *");
    expect(text).toContain("Allow: /");
    expect(text).toContain("Sitemap: https://flik.cl/sitemap.xml");

    // Verificar headers
    const headers = response.headers;
    expect(headers.get("Content-Type")).toBe("text/plain");
    expect(headers.get("Cache-Control")).toBe("no-transform");
    expect(headers.get("X-Robots-Tag")).toBe("noai, noimageai");

    // Verificar que el status por defecto es 200
    expect(response.status).toBe(200);
  });
});
