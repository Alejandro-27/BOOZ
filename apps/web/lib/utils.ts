import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Une clases de Tailwind resolviendo conflictos (ej: px-2 vs px-4). */
export function cn(...clases: ClassValue[]) {
  return twMerge(clsx(clases));
}

/** Formatea centavos como pesos colombianos: 189900 → "$ 1.899". */
export function formatearPrecio(centavos: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(centavos / 100);
}

/** Une dirección y ciudad sin repetir trozos ("Arauca, Colombia" + "Arauca"). */
export function formatearUbicacion(
  ...partes: (string | null | undefined)[]
): string {
  const trozos = partes
    .filter((parte): parte is string => Boolean(parte))
    .flatMap((parte) => parte.split(","))
    .map((t) => t.trim())
    .filter(Boolean);
  return [...new Set(trozos)].join(", ");
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

