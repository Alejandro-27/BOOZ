import type { FastifyReply, FastifyRequest } from "fastify";
import type { z } from "zod";
import { ValidationError } from "../../shared/errors";
import { formatearErroresZod, respuestaExitosa } from "../../shared/utils";
import { updateStoreConfigSchema } from "./store-config.schema";
import type { StoreConfigService } from "./store-config.service";

/** Traduce HTTP <-> service. No consulta la base ni aplica reglas de negocio. */
export class StoreConfigController {
  constructor(private readonly servicio: StoreConfigService) {}

  async obtener(_request: FastifyRequest, reply: FastifyReply) {
    return respuestaExitosa(reply, await this.servicio.obtener());
  }

  async actualizar(request: FastifyRequest, reply: FastifyReply) {
    const datos = this.validar(updateStoreConfigSchema, request.body, "Datos inválidos");
    return respuestaExitosa(reply, await this.servicio.actualizar(datos));
  }

  private validar<T>(esquema: z.ZodType<T>, datos: unknown, mensaje: string): T {
    const resultado = esquema.safeParse(datos);

    if (!resultado.success) {
      throw new ValidationError(mensaje, formatearErroresZod(resultado.error));
    }

    return resultado.data;
  }
}
