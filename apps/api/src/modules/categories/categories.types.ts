import type { Category } from "@zapateria/shared";
import type { CreateCategoryInput, UpdateCategoryInput } from "@zapateria/shared";

export type { Category, CreateCategoryInput, UpdateCategoryInput };

/** Filtros opcionales para listar categorías (por ahora sin filtros activos). */
export interface CategoryFilters {
  nombre?: string;
  activo?: boolean;
}
