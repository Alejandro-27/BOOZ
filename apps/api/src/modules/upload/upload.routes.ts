import type { FastifyInstance } from "fastify";
import { requireAuth } from "../auth/auth.middleware";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";

export async function uploadRoutes(app: FastifyInstance) {
  const controlador = new UploadController(new UploadService());

  app.post("/upload", { preHandler: requireAuth }, (request, reply) =>
    controlador.subir(request, reply),
  );
}
