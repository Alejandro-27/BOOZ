import type { FastifyReply, FastifyRequest } from "fastify";
import { ValidationError } from "../../shared/errors";
import { respuestaExitosa } from "../../shared/utils";
import { InvalidFileTypeError } from "./upload.errors";
import type { UploadResponse } from "./upload.types";
import type { UploadService } from "./upload.service";

/** Traduce HTTP <-> service. No consulta la base ni aplica reglas de negocio. */
export class UploadController {
  constructor(private readonly servicio: UploadService) {}

  async subir(request: FastifyRequest, reply: FastifyReply) {
    const archivo = await request.file();

    if (!archivo) {
      throw new ValidationError("No se recibió ningún archivo");
    }

    if (!archivo.mimetype.startsWith("image/")) {
      throw new InvalidFileTypeError();
    }

    const buffer = await archivo.toBuffer();
    const resultado: UploadResponse = await this.servicio.subir(buffer);

    return respuestaExitosa(reply, resultado, 201);
  }
}
