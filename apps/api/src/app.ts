import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { adminProductsRoutes, productsRoutes } from "./modules/products/products.routes";
import { categoriesRoutes } from "./modules/categories/categories.routes";
import { healthRoutes } from "./modules/health/health.routes";
import { storeConfigRoutes } from "./modules/store-config/store-config.routes";
import { uploadRoutes } from "./modules/upload/upload.routes";
import { manejadorErrores } from "./shared/middleware/errorHandler";

/** Tamaño máximo por imagen subida (5 MB). */
const LIMITE_ARCHIVO = 5 * 1024 * 1024;

/**
 * Crea y configura la instancia de Fastify sin ponerla a escuchar.
 * Útil para tests y para despliegues que controlan el listen por su cuenta.
 */
export async function crearApp() {
  const app = Fastify({ loggerInstance: logger });

  // Orígenes permitidos (lista separada por comas en CORS_ORIGIN)
  const origenesPermitidos = env.CORS_ORIGIN.split(",")
    .map((origen) => origen.trim())
    .filter(Boolean);

  // En desarrollo se acepta también el IP de la red local (192.168.x, 10.x)
  // para probar el panel desde el celular. En producción solo la lista env.
  const origenValido = (origen: string | undefined) =>
    !origen ||
    origenesPermitidos.includes(origen) ||
    (env.NODE_ENV === "development" &&
      /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?$/.test(
        origen,
      ));

  app.register(cors, {
    origin: (
      origen: string | undefined,
      cb: (error: Error | null, permitido: boolean) => void,
    ) => cb(null, origenValido(origen)),
    credentials: true,
    // Sin esta lista, Fastify solo anuncia GET/HEAD/POST en el preflight y el
    // navegador bloquea las mutaciones del panel (PUT/PATCH/DELETE).
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });
  app.register(multipart, {
    limits: { fileSize: LIMITE_ARCHIVO, files: 1 },
  });

  // Respuestas de error uniformes; los 5xx no filtran detalles internos
  app.setErrorHandler(manejadorErrores);

  await app.register(healthRoutes);
  await app.register(productsRoutes, { prefix: "/products" });
  await app.register(adminProductsRoutes, { prefix: "/admin/products" });
  await app.register(categoriesRoutes, { prefix: "/categories" });
  await app.register(storeConfigRoutes, { prefix: "/store-config" });
  await app.register(uploadRoutes);

  return app;
}
