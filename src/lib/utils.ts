import { format } from "date-fns";
import { es } from "date-fns/locale";

// 📅 Formatear fecha en español
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const formatted = format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

// ⏱ Tiempo estimado de lectura (200 palabras/minuto)
export function getReadingTime(content: string): string {
  if (!content) return "0 min de lectura";

  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min de lectura`;
}

// 🔄 Resultado de paginación tipado
export type PaginationResult<T> = {
  items: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

// 🔄 Paginación con ajuste de página fuera de rango
export function getPaginatedItems<T>(
  items: T[],
  page: number,
  pageSize: number,
): PaginationResult<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages); // clamp primero

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const paginatedItems = items.slice(start, end);

  return {
    items: paginatedItems,
    total,
    totalPages,
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}
