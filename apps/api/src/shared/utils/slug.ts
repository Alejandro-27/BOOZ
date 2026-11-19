/**
 * Convierte un texto en un slug: minúsculas, sin acentos y separado por guiones.
 * Ej: "Zapato de Vestir — Café" → "zapato-de-vestir-cafe".
 */
export function generarSlug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
