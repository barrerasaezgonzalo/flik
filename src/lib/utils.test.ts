import { formatDate, getPaginatedItems } from "./utils";

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

  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  it("devuelve la primera página correctamente", () => {
    const result = getPaginatedItems(items, 1, 3);
    expect(result.items).toEqual([1, 2, 3]);
    expect(result.totalPages).toBe(3);
    expect(result.currentPage).toBe(1);
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(false);
  });

  it("devuelve la segunda página correctamente", () => {
    const result = getPaginatedItems(items, 2, 3);
    expect(result.items).toEqual([4, 5, 6]);
    expect(result.currentPage).toBe(2);
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(true);
  });

  it("devuelve la última página correctamente", () => {
    const result = getPaginatedItems(items, 3, 3);
    expect(result.items).toEqual([7, 8, 9]);
    expect(result.currentPage).toBe(3);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(true);
  });

  it("ajusta currentPage si es menor que 1", () => {
    const result = getPaginatedItems(items, -5, 4);
    expect(result.currentPage).toBe(1);
    expect(result.items).toEqual([1, 2, 3, 4]);
  });

  it("ajusta currentPage si es mayor que totalPages", () => {
    const result = getPaginatedItems(items, 999, 4);
    expect(result.currentPage).toBe(3);
    expect(result.items).toEqual([9]); // la última página incompleta
  });

  it("maneja lista vacía", () => {
    const result = getPaginatedItems([], 1, 5);
    expect(result.items).toEqual([]);
    expect(result.totalPages).toBe(1);
    expect(result.currentPage).toBe(1);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
  });
});
