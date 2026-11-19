import type { FastifyInstance } from "fastify";

/** Comprobación simple de vida del servicio (usada por Render). */
export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }));
}
