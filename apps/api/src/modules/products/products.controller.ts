import type { FastifyReply, FastifyRequest } from "fastify";
import type { z } from "zod";
import { ValidationError } from "../../shared/errors";
import { formatearErroresZod, respuestaExitosa } from "../../shared/utils";
import {
  createProductSchema,
  productFiltersSchema,
  productIdSchema,
  productSlugSchema,
  updateProductSchema,
} from "./products.schema";
import type { ProductsService } from "./products.service";

/** Traduce HTTP ↔ service. No consulta la base ni aplica reglas de negocio. */
export class ProductsController {
  constructor(private readonly servicio: ProductsService) {}

  async listar(request: FastifyRequest, reply: FastifyReply) {
    const filtros = this.validar(productFiltersSchema, request.query, "Filtros inválidos");
    return respuestaExitosa(reply, await this.servicio.obtenerTodos(filtros));
  }

  async listarAdmin(request: FastifyRequest, reply: FastifyReply) {
    const filtros = this.validar(productFiltersSchema, request.query, "Filtros inválidos");
    return respuestaExitosa(reply, await this.servicio.obtenerTodosAdmin(filtros));
  }

  async obtenerPorSlug(
    request: FastifyRequest<{ Params: { slug: string } }>,
    reply: FastifyReply,
  ) {
    const { slug } = this.validar(productSlugSchema, request.params, "Datos inválidos");
    return respuestaExitosa(reply, await this.servicio.obtenerPorSlug(slug));
  }

  async crear(request: FastifyRequest, reply: FastifyReply) {
    const datos = this.validar(createProductSchema, request.body, "Datos inválidos");
    return respuestaExitosa(reply, await this.servicio.crear(datos), 201);
  }

  async actualizar(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = this.validar(productIdSchema, request.params, "Datos inválidos");
    const datos = this.validar(updateProductSchema, request.body, "Datos inválidos");
    return respuestaExitosa(reply, await this.servicio.actualizar(id, datos));
  }

  async eliminar(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = this.validar(productIdSchema, request.params, "Datos inválidos");
    await this.servicio.eliminar(id);
    return reply.code(204).send();
  }

  private validar<T>(esquema: z.ZodType<T>, datos: unknown, mensaje: string): T {
    const resultado = esquema.safeParse(datos);

    if (!resultado.success) {
      throw new ValidationError(mensaje, formatearErroresZod(resultado.error));
    }

    return resultado.data;
  }
}
