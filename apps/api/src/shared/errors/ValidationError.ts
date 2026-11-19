import { AppError, type DetalleError } from "./AppError";

/** Los datos de entrada no cumplen las reglas (HTTP 400). */
export class ValidationError extends AppError {
  constructor(message = "Datos inválidos", detalles?: DetalleError[]) {
    super(message, 400, "VALIDATION_ERROR", detalles);
  }
}
