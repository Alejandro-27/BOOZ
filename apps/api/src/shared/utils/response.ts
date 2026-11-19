import type { FastifyReply } from "fastify";
import type { AppError } from "../errors";

/** Envía una respuesta exitosa con el código HTTP indicado. */
export function respuestaExitosa<T>(reply: FastifyReply, datos: T, statusCode = 200) {
  return reply.code(statusCode).send(datos);
}

/** Envía un error de dominio con el formato uniforme de la API. */
export function respuestaError(reply: FastifyReply, error: AppError) {
  return reply.code(error.statusCode).send({
    error: error.message,
    ...(error.detalles?.length ? { detalles: error.detalles } : {}),
  });
}
