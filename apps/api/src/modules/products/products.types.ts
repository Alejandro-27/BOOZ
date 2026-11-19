import type {
  CreateProductInput as CreateProductInputCompartido,
  Product as ProductoCompartido,
  ProductStatus,
  UpdateProductInput,
} from "@zapateria/shared";

export type { UpdateProductInput };

/** Categoría tal como la devuelve el join de Supabase. */
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

/** Producto con su categoría incluida. */
export type Product = ProductoCompartido & {
  category: ProductCategory | null;
};

/** Filtros de consulta. `incluir_inactivos` solo lo define el service. */
export interface ProductFilters {
  categoria?: string;
  talla?: string;
  color?: string;
  estado?: ProductStatus;
  precio_min?: number;
  precio_max?: number;
  busqueda?: string;
  incluir_inactivos?: boolean;
}

/** El slug es opcional al crear: si falta, el service lo genera desde el nombre. */
export type CreateProductInput = Omit<CreateProductInputCompartido, "slug"> & {
  slug?: string;
};

/** Datos ya normalizados que recibe el repository (slug resuelto). */
export type CreateProductData = Omit<CreateProductInput, "slug"> & { slug: string };
