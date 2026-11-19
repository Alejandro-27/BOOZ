import { AppError } from "../../shared/errors";
import type { StoreConfigRepository } from "./store-config.repository";
import type { StoreConfig, UpdateStoreConfigInput } from "./store-config.types";

/** Lógica de negocio de la configuración de la tienda (singleton id = 1). */
export class StoreConfigService {
  constructor(private readonly repositorio: StoreConfigRepository) {}

  async obtener(): Promise<StoreConfig> {
    const configuracion = await this.repositorio.findById("1");

    if (!configuracion) {
      throw new AppError("Configuración de la tienda no encontrada", 404, "STORE_CONFIG_NOT_FOUND");
    }

    return configuracion;
  }

  async actualizar(input: UpdateStoreConfigInput): Promise<StoreConfig> {
    await this.obtener();
    return this.repositorio.update("1", input);
  }
}
