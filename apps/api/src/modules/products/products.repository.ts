import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { AppError, ValidationError } from "../../shared/errors";
import { ProductSlugExistsError } from "./products.errors";
import type { CreateProductData, Product, ProductFilters, UpdateProductInput } from "./products.types";

const SELECT_CON_CATEGORIA = "*, category:categories(id, name, slug)";

/** Limpia comas y paréntesis para no romper la sintaxis de filtros de PostgREST. */
function limpiarBusqueda(busqueda: string): string {
  return busqueda.replace(/[(),]/g, " ").trim();
}

/** Único lugar del módulo que conoce Supabase. */
export class ProductsRepository {
  constructor(private readonly cliente: SupabaseClient) {}

  async findAll(filtros: ProductFilters = {}): Promise<Product[]> {
    let consulta = this.cliente
      .from("products")
      .select(SELECT_CON_CATEGORIA)
      .order("created_at", { ascending: false });

    if (!filtros.incluir_inactivos) {
      consulta = consulta.eq("is_active", true);
    }
    if (filtros.estado) {
      consulta = consulta.eq("status", filtros.estado);
    }
    if (filtros.precio_min !== undefined) {
      consulta = consulta.gte("price", filtros.precio_min);
    }
    if (filtros.precio_max !== undefined) {
      consulta = consulta.lte("price", filtros.precio_max);
    }
    if (filtros.talla) {
      // jsonb necesita JSON literal: contains() serializa como {42} y falla.
      consulta = consulta.filter("sizes", "cs", JSON.stringify([filtros.talla]));
    }
    if (filtros.color) {
      consulta = consulta.filter(
        "colors",
        "cs",
        JSON.stringify([{ name: filtros.color }]),
      );
    }
    if (filtros.categoria) {
      const categoriaId = await this.buscarCategoriaId(filtros.categoria);
      // Categoría inexistente: catálogo vacío en lugar de error
      if (!categoriaId) {
        return [];
      }
      consulta = consulta.eq("category_id", categoriaId);
    }
    if (filtros.busqueda) {
      const termino = limpiarBusqueda(filtros.busqueda);
      if (termino) {
        consulta = consulta.or(`name.ilike.%${termino}%,sku.ilike.%${termino}%`);
      }
    }

    const { data, error } = await consulta;

    if (error) {
      throw new AppError("No se pudo consultar el catálogo");
    }

    return (data ?? []) as Product[];
  }

  async findBySlug(slug: string, incluirInactivos = false): Promise<Product | null> {
    let consulta = this.cliente
      .from("products")
      .select(SELECT_CON_CATEGORIA)
      .eq("slug", slug);

    if (!incluirInactivos) {
      consulta = consulta.eq("is_active", true);
    }

    const { data, error } = await consulta.maybeSingle();

    // PostgREST devuelve PGRST116 cuando no hay filas en maybeSingle
    if (error && error.code !== "PGRST116") {
      throw new AppError("No se pudo consultar el producto");
    }

    return (data as Product | null) ?? null;
  }

  async findById(id: string): Promise<Product | null> {
    const { data, error } = await this.cliente
      .from("products")
      .select(SELECT_CON_CATEGORIA)
      .eq("id", id)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      throw new AppError("No se pudo consultar el producto");
    }

    return (data as Product | null) ?? null;
  }

  async create(input: CreateProductData): Promise<Product> {
    const { data, error } = await this.cliente
      .from("products")
      .insert(input)
      .select(SELECT_CON_CATEGORIA)
      .single();

    if (error) {
      this.lanzarErrorEscritura(error, "No se pudo crear el producto");
    }

    return data as Product;
  }

  async update(id: string, input: UpdateProductInput): Promise<Product> {
    const { data, error } = await this.cliente
      .from("products")
      .update(input)
      .eq("id", id)
      .select(SELECT_CON_CATEGORIA)
      .single();

    if (error) {
      this.lanzarErrorEscritura(error, "No se pudo actualizar el producto");
    }

    return data as Product;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.cliente.from("products").delete().eq("id", id);

    if (error) {
      throw new AppError("No se pudo eliminar el producto");
    }
  }

  async count(filtros: ProductFilters = {}): Promise<number> {
    let consulta = this.cliente
      .from("products")
      .select("id", { count: "exact", head: true });

    if (!filtros.incluir_inactivos) {
      consulta = consulta.eq("is_active", true);
    }
    if (filtros.estado) {
      consulta = consulta.eq("status", filtros.estado);
    }
    if (filtros.precio_min !== undefined) {
      consulta = consulta.gte("price", filtros.precio_min);
    }
    if (filtros.precio_max !== undefined) {
      consulta = consulta.lte("price", filtros.precio_max);
    }
    if (filtros.talla) {
      consulta = consulta.filter("sizes", "cs", JSON.stringify([filtros.talla]));
    }
    if (filtros.color) {
      consulta = consulta.filter(
        "colors",
        "cs",
        JSON.stringify([{ name: filtros.color }]),
      );
    }
    if (filtros.categoria) {
      const categoriaId = await this.buscarCategoriaId(filtros.categoria);
      if (!categoriaId) {
        return 0;
      }
      consulta = consulta.eq("category_id", categoriaId);
    }
    if (filtros.busqueda) {
      const termino = limpiarBusqueda(filtros.busqueda);
      if (termino) {
        consulta = consulta.or(`name.ilike.%${termino}%,sku.ilike.%${termino}%`);
      }
    }

    const { count, error } = await consulta;

    if (error) {
      throw new AppError("No se pudo consultar el catálogo");
    }

    return count ?? 0;
  }

  private async buscarCategoriaId(slug: string): Promise<string | null> {
    const { data, error } = await this.cliente
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw new AppError("No se pudo consultar el catálogo");
    }

    return data?.id ?? null;
  }

  /** Traduce los errores de escritura de Postgres a errores de dominio. */
  private lanzarErrorEscritura(error: PostgrestError, mensaje: string): never {
    if (error.code === "23505") {
      throw new ProductSlugExistsError();
    }
    if (error.code === "23503") {
      throw new ValidationError("La categoría indicada no existe");
    }
    throw new AppError(mensaje);
  }
}
