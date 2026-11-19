import { AppError } from "./AppError";

/** La sesión existe pero no tiene permiso para la acción (HTTP 403). */
export class ForbiddenError extends AppError {
  constructor(message = "No tienes permiso para esta acción", code = "FORBIDDEN") {
    super(message, 403, code);
  }
}
