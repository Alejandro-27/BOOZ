import {
  brandColorsSchema,
  createProductSchema,
  updateStoreConfigSchema,
} from "@zapateria/shared";
import { z } from "zod";

/**
 * Los precios se editan en pesos y la API los espera en centavos.
 * Se extiende el esquema compartido para conservar sus validaciones.
 */
const precioPesos = z
  .string()
  .trim()
  .min(1, "El precio es obligatorio")
  .regex(/^\d+(\.\d{1,2})?$/, "Usa un número válido, por ejemplo 1899.00")
  .transform((valor) => Math.round(Number(valor) * 100));

const precioOfertaPesos = z
  .string()
  .trim()
  .regex(/^(\d+(\.\d{1,2})?)?$/, "Usa un número válido o déjalo vacío")
  .transform((valor) => (valor === "" ? null : Math.round(Number(valor) * 100)));

const stockTexto = z
  .string()
  .trim()
  .regex(/^\d*$/, "El stock debe ser un número entero")
  .transform((valor) => (valor === "" ? null : Number(valor)));

/** Formulario de producto: mismos campos que la API, con montos en pesos. */
export const esquemaProducto = createProductSchema
  .extend({
    price: precioPesos,
    sale_price: precioOfertaPesos,
    stock: stockTexto,
  })
  .refine((datos) => datos.sale_price === null || datos.sale_price < datos.price, {
    message: "El precio de oferta debe ser menor que el precio normal",
    path: ["sale_price"],
  });

export type EntradaProducto = z.input<typeof esquemaProducto>;
export type SalidaProducto = z.output<typeof esquemaProducto>;

const hexColor = z
  .string()
  .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Color hexadecimal inválido");

/** Texto opcional: un campo vacío se guarda como null. */
function textoOpcional(maximo: number) {
  return z
    .string()
    .max(maximo)
    .transform((valor) => (valor.trim() === "" ? null : valor.trim()));
}

/** Formulario de configuración: todos los campos visibles son obligatorios. */
export const esquemaConfiguracion = updateStoreConfigSchema.extend({
  name: z.string().min(1, "El nombre es obligatorio").max(120),
  slogan: z.string().max(200),
  whatsapp: z
    .string()
    .min(6, "Incluye el código de país")
    .max(20, "El WhatsApp es demasiado largo")
    .regex(/^\d+$/, "El WhatsApp solo admite dígitos"),
  email: z
    .union([z.literal(""), z.email("El email no es válido")])
    .transform((valor) => (valor === "" ? null : valor)),
  instagram: textoOpcional(100),
  address: textoOpcional(200),
  city: textoOpcional(100),
  policies: textoOpcional(5000),
  brand_colors: brandColorsSchema.extend({
    accent: z
      .union([z.literal(""), hexColor])
      .transform((valor) => (valor === "" ? undefined : valor)),
  }),
});

export type EntradaConfiguracion = z.input<typeof esquemaConfiguracion>;
export type SalidaConfiguracion = z.output<typeof esquemaConfiguracion>;
