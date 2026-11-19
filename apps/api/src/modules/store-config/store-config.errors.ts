import { AppError } from "../../shared/errors";

/** La configuración de la tienda no existe (HTTP 404). */
export class StoreConfigNotFoundError extends AppError {
  constructor(message = "Configuración de la tienda no encontrada") {
    super(message, 404, "STORE_CONFIG_NOT_FOUND");
  }
}
