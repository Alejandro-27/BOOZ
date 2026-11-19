import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ValidationError } from "../../shared/errors";
import { formatearErroresZod, respuestaExitosa } from "../../shared/utils";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./categories.schema";
import type { CategoriesService } from "./categories.service";

/** Traduce HTTP <-> service. No consulta la base ni aplica reglas de negocio. */
export class CategoriesController {
  constructor(private readonly servicio: CategoriesService) {}

  async listar(_request: FastifyRequest, reply: FastifyReply) {
    return respuestaExitosa(reply, await this.servicio.obtenerTodas());
  }

  async crear(request: FastifyRequest, reply: FastifyReply) {
    const datos = this.validar(createCategorySchema, request.body, "Datos inválidos");
    return respuestaExitosa(reply, await this.servicio.crear(datos), 201);
  }

  async actualizar(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = this.validarId(request.params);
    const datos = this.validar(updateCategorySchema, request.body, "Datos inválidos");
    return respuestaExitosa(reply, await this.servicio.actualizar(id, datos));
  }

  async eliminar(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = this.validarId(request.params);
    await this.servicio.eliminar(id);
    return reply.code(204).send();
  }

  private validarId(params: { id: string }) {
    const idSchema = z.object({ id: z.string().min(1, "El ID es obligatorio") });
    return this.validar(idSchema, params, "ID inválido");
  }

  private validar<T>(esquema: z.ZodType<T>, datos: unknown, mensaje: string): T {
    const resultado = esquema.safeParse(datos);

    if (!resultado.success) {
      throw new ValidationError(mensaje, formatearErroresZod(resultado.error));
    }

    return resultado.data;
  }
}
