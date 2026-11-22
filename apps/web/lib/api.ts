import { cache } from "react";
import type { Category, Product, StoreConfig } from "@zapateria/shared";

const URL_API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/** Producto con la categoría incluida por la API (join de Supabase). */
export type ProductoConCategoria = Product & {
  category: Pick<Category, "id" | "name" | "slug"> | null;
};

/** Error con el código HTTP para distinguir 404 de fallos del servidor. */
export class ErrorApi extends Error {
  constructor(
    public readonly estado: number,
    mensaje: string,
  ) {
    super(mensaje);
    this.name = "ErrorApi";
  }
}

/**
 * Petición JSON tipada contra la API. Por defecto sin caché; las vitrinas que
 * pueden esperar (home) pasan `revalidar` para que Next las sirva estáticas.
 */
async function pedir<T>(ruta: string, revalidar?: number): Promise<T> {
  const respuesta = await fetch(
    `${URL_API}${ruta}`,
    revalidar ? { next: { revalidate: revalidar } } : { cache: "no-store" },
  );

  if (!respuesta.ok) {
    let mensaje = "No se pudo completar la solicitud";
    try {
      const cuerpo = (await respuesta.json()) as { error?: string };
      if (cuerpo.error) mensaje = cuerpo.error;
    } catch {
      // La respuesta de error no era JSON; se conserva el mensaje genérico
    }
    throw new ErrorApi(respuesta.status, mensaje);
  }

  return (await respuesta.json()) as T;
}

export interface FiltrosCatalogo {
  categoria?: string;
  talla?: string;
  color?: string;
  estado?: string;
  precioMin?: number;
  precioMax?: number;
  busqueda?: string;
}

export function obtenerProductos(
  filtros: FiltrosCatalogo = {},
  revalidar?: number,
): Promise<ProductoConCategoria[]> {
  const parametros = new URLSearchParams();

  if (filtros.categoria) parametros.set("categoria", filtros.categoria);
  if (filtros.talla) parametros.set("talla", filtros.talla);
  if (filtros.color) parametros.set("color", filtros.color);
  if (filtros.estado) parametros.set("estado", filtros.estado);
  if (filtros.precioMin !== undefined) parametros.set("precio_min", String(filtros.precioMin));
  if (filtros.precioMax !== undefined) parametros.set("precio_max", String(filtros.precioMax));
  if (filtros.busqueda) parametros.set("busqueda", filtros.busqueda);

  const consulta = parametros.toString();
  return pedir<ProductoConCategoria[]>(`/products${consulta ? `?${consulta}` : ""}`, revalidar);
}

export const obtenerProducto = cache((slug: string): Promise<ProductoConCategoria> => {
  return pedir<ProductoConCategoria>(`/products/${encodeURIComponent(slug)}`);
});

export const obtenerCategorias = cache((): Promise<Category[]> => {
  return pedir<Category[]>("/categories");
});

/**
 * Configuración de la tienda. Si la API no responde, el sitio público sigue
 * funcionando con datos por defecto en lugar de romperse por completo.
 * `cache` evita repetir la petición dentro del mismo render (layout + page).
 */
export const obtenerConfiguracionSegura = cache(async (): Promise<StoreConfig | null> => {
  try {
    // La configuración de tienda cambia en contadas ocasiones al día.
    return await pedir<StoreConfig>("/store-config", 30);
  } catch {
    return null;
  }
});
