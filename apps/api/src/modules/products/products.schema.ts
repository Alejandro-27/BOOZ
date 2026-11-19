import {
  createProductSchema as createProductSchemaCompartido,
  productStatusSchema,
  updateProductSchema,
} from "@zapateria/shared";
import { z } from "zod";

/** Al crear, el slug puede omitirse y el service lo genera desde el nombre. */
export const createProductSchema = createProductSchemaCompartido.extend({
  slug: createProductSchemaCompartido.shape.slug.optional(),
});

export { updateProductSchema };

/** Filtros públicos; `incluir_inactivos` solo lo decide el service. */
export const productFiltersSchema = z.object({
  categoria: z.string().trim().min(1).optional(),
  talla: z.string().trim().min(1).optional(),
  color: z.string().trim().min(1).optional(),
  estado: productStatusSchema.optional(),
  precio_min: z.coerce.number().int().min(0).optional(),
  precio_max: z.coerce.number().int().min(0).optional(),
  busqueda: z.string().trim().max(80).optional(),
});

export const productIdSchema = z.object({
  id: z.uuid("El ID del producto no es válido"),
});

export const productSlugSchema = z.object({
  slug: z.string().trim().min(1, "El slug es obligatorio"),
});
