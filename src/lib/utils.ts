import { format } from "date-fns";
import { es } from "date-fns/locale";

export function formatDate(dateString: string): string {
  return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: es });
}
