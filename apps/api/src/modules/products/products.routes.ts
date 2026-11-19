import type { FastifyInstance } from "fastify";
import { supabaseAdmin } from "../../config/database";
import { requireAuth } from "../auth/auth.middleware";
import { ProductsController } from "./products.controller";
import { ProductsRepository } from "./products.repository";
import { ProductsService } from "./products.service";

/** Composición del módulo: repository → service → controller. */
function crearControlador(): ProductsController {
  return new ProductsController(new ProductsService(new ProductsRepository(supabaseAdmin)));
}

export async function productsRoutes(app: FastifyInstance) {
  const controlador = crearControlador();

  // Público
  app.get("/", (request, reply) => controlador.listar(request, reply));
  app.get<{ Params: { slug: string } }>("/:slug", (request, reply) =>
    controlador.obtenerPorSlug(request, reply),
  );

  // Protegido
  app.post("/", { preHandler: requireAuth }, (request, reply) =>
    controlador.crear(request, reply),
  );
  app.put<{ Params: { id: string } }>("/:id", { preHandler: requireAuth }, (request, reply) =>
    controlador.actualizar(request, reply),
  );
  app.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: requireAuth },
    (request, reply) => controlador.eliminar(request, reply),
  );
}

/**
 * Listado del panel. Vive en su propio prefijo (/admin/products) para no
 * romper el contrato que consume el frontend.
 */
export async function adminProductsRoutes(app: FastifyInstance) {
  const controlador = crearControlador();

  app.get("/", { preHandler: requireAuth }, (request, reply) =>
    controlador.listarAdmin(request, reply),
  );
}
