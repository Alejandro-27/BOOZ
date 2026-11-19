import { crearApp } from "./app";
import { env } from "./config/env";

async function main() {
  const app = await crearApp();

  try {
    // 0.0.0.0 es necesario para que Render pueda enrutar el tráfico
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
  } catch (error) {
    app.log.error({ err: error }, "No se pudo iniciar el servidor");
    process.exit(1);
  }

  // Cierre limpio al recibir señales del orquestador
  for (const senal of ["SIGINT", "SIGTERM"] as const) {
    process.on(senal, async () => {
      app.log.info(`Recibida ${senal}, cerrando servidor`);
      await app.close();
      process.exit(0);
    });
  }
}

main();
