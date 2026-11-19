/** Categoría del catálogo (ej: "Zapatos de vestir", "Botas"). */
export interface Category {
  id: string;
  name: string;
  slug: string;
  /** Orden de aparición en el catálogo (menor primero). */
  display_order: number;
  active: boolean;
  created_at: string;
}
