import type { FastifyInstance } from "fastify";
import { supabaseAdmin } from "../../config/database";
import { requireAuth } from "../auth/auth.middleware";
import { StoreConfigController } from "./store-config.controller";
import { StoreConfigRepository } from "./store-config.repository";
import { StoreConfigService } from "./store-config.service";

function crearControlador(): StoreConfigController {
  return new StoreConfigController(
    new StoreConfigService(new StoreConfigRepository(supabaseAdmin)),
  );
}

export async function storeConfigRoutes(app: FastifyInstance) {
  const controlador = crearControlador();

  app.get("/", (request, reply) => controlador.obtener(request, reply));
  app.put("/", { preHandler: requireAuth }, (request, reply) =>
    controlador.actualizar(request, reply),
  );
}
