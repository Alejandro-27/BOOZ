import type { ZodError } from "zod";

/** Convierte los errores de Zod en la lista de detalles que consume la API. */
export function formatearErroresZod(error: ZodError) {
  return error.issues.map((problema) => ({
    campo: problema.path.join(".") || "(raíz)",
    mensaje: problema.message,
  }));
}
