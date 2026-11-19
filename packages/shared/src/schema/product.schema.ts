import { z } from "zod";

/** Slug válido: minúsculas, números y guiones simples (ej: "zapato-oxford-negro"). */
const slugSchema = z
  .string()
  .min(1, "El slug es obligatorio")
  .max(120, "El slug es demasiado largo")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "El slug solo admite minúsculas, números y guiones");

/** Color hexadecimal de 3 o 6 dígitos (ej: "#000" o "#1A1A1A"). */
const hexColorSchema = z
  .string()
  .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Color hexadecimal inválido");

export const productStatusSchema = z.enum(["available", "soldout", "featured", "coming"]);

export const productColorSchema = z.object({
  name: z.string().min(1, "El color debe tener un nombre").max(60),
  hex: hexColorSchema,
});

export const productImageSchema = z.object({
  url: z.url("La URL de la imagen no es válida"),
  alt: z.string().max(200),
});

/**
 * Campos base sin defaults. Los defaults se aplican solo al crear: si se
 * aplicaran al actualizar, un PUT parcial sobrescribiría campos no enviados.
 */
const camposProducto = {
  slug: slugSchema,
  name: z.string().min(1, "El nombre es obligatorio").max(150),
  short_description: z.string().max(300),
  long_description: z.string(),
  // Los precios se guardan en centavos para evitar errores de punto flotante
  price: z
    .number()
    .int("El precio debe ser un entero en centavos")
    .min(0, "El precio no puede ser negativo"),
  sale_price: z
    .number()
    .int("El precio de oferta debe ser un entero en centavos")
    .min(0, "El precio de oferta no puede ser negativo")
    .nullable(),
  sku: z.string().min(1, "El SKU es obligatorio").max(60),
  category_id: z.uuid("El ID de categoría no es válido"),
  sizes: z.array(z.string().min(1)),
  colors: z.array(productColorSchema),
  images: z.array(productImageSchema),
  tags: z.array(z.string().min(1)),
  material: z.string().max(120),
  status: productStatusSchema,
  stock: z.number().int().min(0, "El stock no puede ser negativo").nullable(),
  is_active: z.boolean(),
};

/** Datos necesarios para crear un producto. Los campos con default son opcionales. */
export const createProductSchema = z.object({
  ...camposProducto,
  short_description: camposProducto.short_description.default(""),
  long_description: camposProducto.long_description.default(""),
  sale_price: camposProducto.sale_price.default(null),
  sizes: camposProducto.sizes.default([]),
  colors: camposProducto.colors.default([]),
  images: camposProducto.images.default([]),
  tags: camposProducto.tags.default([]),
  material: camposProducto.material.default(""),
  status: camposProducto.status.default("available"),
  stock: camposProducto.stock.default(null),
  is_active: camposProducto.is_active.default(true),
});

/** Actualización parcial: todos los campos son opcionales y sin defaults. */
export const updateProductSchema = z.object(camposProducto).partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
