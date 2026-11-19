import { AppError } from "../../shared/errors";

/** La categoría solicitada no existe (HTTP 404). */
export class CategoryNotFoundError extends AppError {
  constructor(message = "Categoría no encontrada") {
    super(message, 404, "CATEGORY_NOT_FOUND");
  }
}

/** Ya existe una categoría con el mismo slug (HTTP 409). */
export class CategorySlugExistsError extends AppError {
  constructor(message = "Ya existe una categoría con ese slug") {
    super(message, 409, "CATEGORY_SLUG_EXISTS");
  }
}
