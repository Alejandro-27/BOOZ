/** Detalle de un campo inválido, tal como lo consume el frontend. */
export interface DetalleError {
  campo: string;
  mensaje: string;
}

/**
 * Base de todos los errores de dominio. El manejador global los traduce a
 * respuestas HTTP con el formato { error, detalles? }.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly code: string = "INTERNAL_ERROR",
    public readonly detalles?: DetalleError[],
  ) {
    super(message);
    this.name = new.target.name;
  }
}
