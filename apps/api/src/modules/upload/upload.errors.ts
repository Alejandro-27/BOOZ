import { AppError } from "../../shared/errors";

/** Error al subir la imagen a Cloudinary (HTTP 502). */
export class UploadError extends AppError {
  constructor(message = "No se pudo subir la imagen") {
    super(message, 502, "UPLOAD_ERROR");
  }
}

/** El archivo subido no es una imagen (HTTP 415). */
export class InvalidFileTypeError extends AppError {
  constructor(message = "Solo se permiten imágenes") {
    super(message, 415, "INVALID_FILE_TYPE");
  }
}
