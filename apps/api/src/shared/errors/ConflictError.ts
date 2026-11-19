import { AppError } from "./AppError";

/** La operación choca con un recurso existente (HTTP 409). */
export class ConflictError extends AppError {
  constructor(message = "El recurso ya existe", code = "CONFLICT") {
    super(message, 409, code);
  }
}
