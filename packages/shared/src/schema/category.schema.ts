import { z } from "zod";

/**
 * Campos base sin defaults. Los defaults se aplican solo al crear: si se
 * aplicaran al actualizar, un PUT parcial sobrescribiría campos no enviados.
 */
const camposCategoria = {
  name: z.string().min(1, "El nombre es obligatorio").max(80),
  slug: z
    .string()
    .min(1, "El slug es obligatorio")
    .max(120, "El slug es demasiado largo")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "El slug solo admite minúsculas, números y guiones"),
  display_order: z.number().int().min(0),
  active: z.boolean(),
};

/** Datos necesarios para crear una categoría. */
export const createCategorySchema = z.object({
  ...camposCategoria,
  display_order: camposCategoria.display_order.default(0),
  active: camposCategoria.active.default(true),
});

/** Actualización parcial de una categoría (sin defaults). */
export const updateCategorySchema = z.object(camposCategoria).partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
