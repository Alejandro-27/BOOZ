/** Catálogo maestro de tallas (se guardan como strings en la base de datos). */
export const TALLAS = ["38", "39", "40", "41", "42", "43", "44", "45", "46"];

/** Colores estándar con su hexadecimal para los chips del catálogo. */
export const COLORES = [
  { nombre: "Negro", hex: "#111111" },
  { nombre: "Marrón", hex: "#6B4423" },
  { nombre: "Café", hex: "#4A2C17" },
  { nombre: "Miel", hex: "#B07A45" },
  { nombre: "Grafito", hex: "#3A3A3A" },
];

/** URL pública del sitio, usada en enlaces de WhatsApp y QR. */
export const URL_SITIO = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
