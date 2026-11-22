"use client";

import type {
  Category,
  CreateCategoryInput,
  CreateProductInput,
  StoreConfig,
  UpdateCategoryInput,
  UpdateProductInput,
  UpdateStoreConfigInput,
} from "@zapateria/shared";
import { ErrorApi, type ProductoConCategoria } from "./api";
import { crearClienteNavegador } from "./supabase/client";

const URL_API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/** Petición autenticada: adjunta el JWT de la sesión de Supabase. */
async function pedir<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  const {
    data: { session },
  } = await crearClienteNavegador().auth.getSession();

  if (!session) {
    throw new ErrorApi(401, "Tu sesión expiró. Inicia sesión de nuevo.");
  }

  // FormData fija su propio Content-Type (boundary) y las peticiones sin cuerpo
  // (DELETE) no deben mandar application/json: Fastify responde 400.
  const esFormData = opciones.body instanceof FormData;
  const conCuerpo = opciones.body !== undefined && opciones.body !== null;

  const respuesta = await fetch(`${URL_API}${ruta}`, {
    ...opciones,
    cache: "no-store",
    headers: {
      ...(conCuerpo && !esFormData ? { "Content-Type": "application/json" } : {}),
      ...opciones.headers,
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (respuesta.status === 204) {
    return undefined as T;
  }

  if (!respuesta.ok) {
    let mensaje = "No se pudo completar la solicitud";
    try {
      const cuerpo = (await respuesta.json()) as {
        error?: string;
        detalles?: Array<{ campo: string; mensaje: string }>;
      };
      if (cuerpo.error) mensaje = cuerpo.error;
      const detalle = cuerpo.detalles?.[0]?.mensaje;
      if (detalle) mensaje = `${mensaje}: ${detalle}`;
    } catch {
      // Respuesta de error sin JSON; se conserva el mensaje genérico
    }
    throw new ErrorApi(respuesta.status, mensaje);
  }

  return (await respuesta.json()) as T;
}

/** Listado del panel: incluye borradores (is_active = false). */
export function listarProductosAdmin(busqueda?: string): Promise<ProductoConCategoria[]> {
  const consulta = busqueda ? `?busqueda=${encodeURIComponent(busqueda)}` : "";
  return pedir<ProductoConCategoria[]>(`/admin/products${consulta}`);
}

export function crearProducto(datos: CreateProductInput): Promise<ProductoConCategoria> {
  return pedir<ProductoConCategoria>("/products", {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export function actualizarProducto(
  id: string,
  datos: UpdateProductInput,
): Promise<ProductoConCategoria> {
  return pedir<ProductoConCategoria>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(datos),
  });
}

export function eliminarProducto(id: string): Promise<void> {
  return pedir<void>(`/products/${id}`, { method: "DELETE" });
}

export function listarCategoriasAdmin(): Promise<Category[]> {
  return pedir<Category[]>("/categories");
}

export function crearCategoria(datos: CreateCategoryInput): Promise<Category> {
  return pedir<Category>("/categories", {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export function actualizarCategoria(
  id: string,
  datos: UpdateCategoryInput,
): Promise<Category> {
  return pedir<Category>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(datos),
  });
}

export function eliminarCategoria(id: string): Promise<void> {
  return pedir<void>(`/categories/${id}`, { method: "DELETE" });
}

export function obtenerConfiguracion(): Promise<StoreConfig> {
  return pedir<StoreConfig>("/store-config");
}

export function actualizarConfiguracion(
  datos: UpdateStoreConfigInput,
): Promise<StoreConfig> {
  return pedir<StoreConfig>("/store-config", {
    method: "PUT",
    body: JSON.stringify(datos),
  });
}

export function subirImagen(archivo: File): Promise<{ url: string; public_id: string }> {
  const formulario = new FormData();
  formulario.append("file", archivo);

  return pedir<{ url: string; public_id: string }>("/upload", {
    method: "POST",
    body: formulario,
  });
}
