import { formatDate } from "./utils";

describe("formatDate", () => {
  it("formatea una fecha válida en español (mes y año)", () => {
    const result = formatDate("2025-09-21T00:00:00Z");
    // no validamos el día exacto por zona horaria, solo mes + año
    expect(result).toMatch(/septiembre de 2025/);
  });

  it("funciona con otra fecha (enero)", () => {
    const result = formatDate("2024-01-05");
    expect(result).toMatch(/enero de 2024/);
  });

  it("funciona con fechas ISO generadas por Date", () => {
    const iso = new Date(2023, 6, 15).toISOString(); // 15 julio 2023 local
    const result = formatDate(iso);
    expect(result).toMatch(/julio de 2023/);
  });

  it("lanza error si el string no es una fecha válida", () => {
    expect(() => formatDate("no-es-una-fecha")).toThrow();
  });
});
