import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { AppError, ValidationError } from "../errors";
import { respuestaError } from "../utils";

/**
 * Traduce cualquier error a la respuesta uniforme de la API:
 * { error: string, detalles?: Array<{ campo, mensaje }> }.
 * Los 5xx nunca filtran detalles internos.
 */
export function manejadorErrores(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof AppError) {
    if (error.statusCode >= 500) {
      request.log.error({ err: error }, "Error de aplicación");
    }
    return respuestaError(reply, error);
  }

  if (error instanceof ZodError) {
    const detalles = error.issues.map((problema) => ({
      campo: problema.path.join(".") || "(raíz)",
      mensaje: problema.message,
    }));
    return respuestaError(reply, new ValidationError("Datos inválidos", detalles));
  }

  if (error.code === "FST_REQ_FILE_TOO_LARGE") {
    return respuestaError(
      reply,
      new AppError("La imagen supera el límite de 5 MB", 413, "FILE_TOO_LARGE"),
    );
  }

  const statusCode = error.statusCode ?? 500;

  if (statusCode >= 500) {
    request.log.error({ err: error }, "Error no controlado");
    return reply.code(statusCode).send({ error: "Error interno del servidor" });
  }

  return reply.code(statusCode).send({ error: error.message });
}
