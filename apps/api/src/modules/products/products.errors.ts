import { AppError } from "../../shared/errors";

/** El producto solicitado no existe (HTTP 404). */
export class ProductNotFoundError extends AppError {
  constructor(message = "Producto no encontrado") {
    super(message, 404, "PRODUCT_NOT_FOUND");
  }
}

/** Ya hay un producto con el mismo slug o SKU (HTTP 409). */
export class ProductSlugExistsError extends AppError {
  constructor(message = "Ya existe un producto con ese slug o SKU") {
    super(message, 409, "PRODUCT_SLUG_EXISTS");
  }
}

/** El precio de oferta no es menor que el precio normal (HTTP 400). */
export class InvalidPriceError extends AppError {
  constructor(message = "El precio de oferta debe ser menor que el precio normal") {
    super(message, 400, "INVALID_PRICE");
  }
}
