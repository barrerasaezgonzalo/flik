import { format } from "date-fns";
import { es } from "date-fns/locale";

export function formatDate(dateString: string): string {
  return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: es });
}

export interface PaginationResult<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function getPaginatedItems<T>(
  items: T[],
  currentPage: number,
  pageSize: number
): PaginationResult<T> {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  // Validar página actual
  const validPage = Math.min(Math.max(1, currentPage), totalPages || 1);
  const startIdx = (validPage - 1) * pageSize;
  const paginatedItems = items.slice(startIdx, startIdx + pageSize);
  
  return {
    items: paginatedItems,
    totalPages: totalPages || 1,
    currentPage: validPage,
    hasNextPage: validPage < totalPages,
    hasPreviousPage: validPage > 1
  };
}