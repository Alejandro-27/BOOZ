import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../../shared/errors";
import type { StoreConfig, UpdateStoreConfigInput } from "./store-config.types";

/** La configuración es una fila única con id fijo. */
const ID_CONFIGURACION = 1;

/** Único lugar del módulo que conoce Supabase. */
export class StoreConfigRepository {
  constructor(private readonly cliente: SupabaseClient) {}

  async findById(_id: string): Promise<StoreConfig | null> {
    const { data, error } = await this.cliente
      .from("store_config")
      .select("*")
      .eq("id", ID_CONFIGURACION)
      .maybeSingle();

    if (error) {
      throw new AppError("No se pudo obtener la configuración de la tienda");
    }

    return (data as StoreConfig | null) ?? null;
  }

  async update(_id: string, input: UpdateStoreConfigInput): Promise<StoreConfig> {
    const { data, error } = await this.cliente
      .from("store_config")
      .update(input)
      .eq("id", ID_CONFIGURACION)
      .select()
      .maybeSingle();

    if (error) {
      throw new AppError("No se pudo actualizar la configuración de la tienda");
    }

    if (!data) {
      throw new AppError("Configuración de la tienda no encontrada", 404, "STORE_CONFIG_NOT_FOUND");
    }

    return data as StoreConfig;
  }
}
