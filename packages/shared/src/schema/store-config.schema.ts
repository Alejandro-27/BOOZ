import { z } from "zod";

const hexColorSchema = z
  .string()
  .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Color hexadecimal inválido");

export const brandColorsSchema = z.object({
  primary: hexColorSchema,
  secondary: hexColorSchema,
  accent: hexColorSchema.optional(),
});

/** Actualización parcial de la configuración de la tienda (fila única). */
export const updateStoreConfigSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(120).optional(),
  slogan: z.string().max(200).optional(),
  logo_url: z.url("La URL del logo no es válida").nullable().optional(),
  whatsapp: z
    .string()
    .min(6, "El WhatsApp debe incluir código de país")
    .max(20, "El WhatsApp es demasiado largo")
    .regex(/^\d+$/, "El WhatsApp solo admite dígitos")
    .optional(),
  email: z.email("El email no es válido").nullable().optional(),
  instagram: z.string().max(100).nullable().optional(),
  address: z.string().max(200).nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  policies: z.string().max(5000).nullable().optional(),
  brand_colors: brandColorsSchema.optional(),
});

export type UpdateStoreConfigInput = z.infer<typeof updateStoreConfigSchema>;
