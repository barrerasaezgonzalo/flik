import { formatDate, getReadingTime, getPaginatedItems } from "./utils";

describe("formatDate", () => {
  it("devuelve cadena vacía si dateString es null o undefined", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate(undefined)).toBe("");
  });

  it("devuelve cadena vacía si dateString no es válido", () => {
    expect(formatDate("fecha-falsa")).toBe("");
  });

  it("formatea correctamente una fecha válida", () => {
    const formatted = formatDate("2025-09-28");
    expect(formatted).toMatch(/septiembre de 2025/);
  });
});

describe("getReadingTime", () => {
  it("devuelve 0 min si el contenido está vacío", () => {
    expect(getReadingTime("")).toBe("0 min de lectura");
  });

  it("calcula el tiempo de lectura redondeado hacia arriba", () => {
    const content = "palabra ".repeat(250); // 250 palabras ≈ 1.25 min
    expect(getReadingTime(content)).toBe("2 min de lectura");
  });
});

describe("getPaginatedItems", () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  it("maneja lista vacía", () => {
    const result = getPaginatedItems([], 1, 4);
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(1);
    expect(result.currentPage).toBe(1);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
  });

  it("devuelve la primera página correctamente", () => {
    const result = getPaginatedItems(items, 1, 4);
    expect(result.items).toEqual([1, 2, 3, 4]);
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(3);
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(false);
  });

  it("devuelve la última página incompleta correctamente", () => {
    const result = getPaginatedItems(items, 3, 4);
    expect(result.items).toEqual([9]);
    expect(result.currentPage).toBe(3);
    expect(result.totalPages).toBe(3);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(true);
  });

  it("ajusta currentPage si es mayor que totalPages", () => {
    const result = getPaginatedItems(items, 999, 4);
    expect(result.currentPage).toBe(3); // última página
    expect(result.items).toEqual([9]); // último elemento de la última página
    expect(result.total).toBe(9); // total de elementos
    expect(result.totalPages).toBe(3); // total de páginas
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(true);
  });
});
