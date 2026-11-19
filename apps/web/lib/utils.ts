import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Une clases de Tailwind resolviendo conflictos (ej: px-2 vs px-4). */
export function cn(...clases: ClassValue[]) {
  return twMerge(clsx(clases));
}

/** Formatea centavos como moneda mexicana: 189900 → "$1,899.00". */
export function formatearPrecio(centavos: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(centavos / 100);
}

/** Convierte un nombre en slug: "Zapato Oxford" → "zapato-oxford". */
export function generarSlug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

/**
 * Inserta transformaciones de Cloudinary si la URL aún no las tiene.
 * Ej: .../upload/sample.jpg → .../upload/w_800,q_auto,f_auto/sample.jpg
 */
export function optimizarImagenCloudinary(url: string, ancho: number): string {
  if (!url.includes("/upload/")) return url;
  if (/\/upload\/[^/]*w_\d+/.test(url)) return url;
  return url.replace("/upload/", `/upload/w_${ancho},q_auto,f_auto/`);
}
