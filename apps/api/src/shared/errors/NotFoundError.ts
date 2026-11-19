import { AppError } from "./AppError";

/** El recurso solicitado no existe (HTTP 404). */
export class NotFoundError extends AppError {
  constructor(message = "Recurso no encontrado", code = "NOT_FOUND") {
    super(message, 404, code);
  }
}
