import { AppError } from "./AppError";

/** Falta una sesión válida o el token expiró (HTTP 401). */
export class UnauthorizedError extends AppError {
  constructor(message = "No autorizado", code = "UNAUTHORIZED") {
    super(message, 401, code);
  }
}
