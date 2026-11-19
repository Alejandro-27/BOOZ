import type { FastifyInstance } from "fastify";
import { supabaseAdmin } from "../../config/database";
import { requireAuth } from "../auth/auth.middleware";
import { CategoriesController } from "./categories.controller";
import { CategoriesRepository } from "./categories.repository";
import { CategoriesService } from "./categories.service";

function crearControlador(): CategoriesController {
  return new CategoriesController(new CategoriesService(new CategoriesRepository(supabaseAdmin)));
}

export async function categoriesRoutes(app: FastifyInstance) {
  const controlador = crearControlador();

  app.get("/", (request, reply) => controlador.listar(request, reply));
  app.post("/", { preHandler: requireAuth }, (request, reply) => controlador.crear(request, reply));
  app.put<{ Params: { id: string } }>(
    "/:id",
    { preHandler: requireAuth },
    (request, reply) => controlador.actualizar(request, reply),
  );
  app.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: requireAuth },
    (request, reply) => controlador.eliminar(request, reply),
  );
}
