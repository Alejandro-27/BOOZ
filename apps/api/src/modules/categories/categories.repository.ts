import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../../shared/errors";
import { CategoryNotFoundError, CategorySlugExistsError } from "./categories.errors";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./categories.types";

/** Único lugar del módulo que conoce Supabase. */
export class CategoriesRepository {
  constructor(private readonly cliente: SupabaseClient) {}

  async findAll(): Promise<Category[]> {
    const { data, error } = await this.cliente
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      throw new AppError("No se pudieron obtener las categorías");
    }

    return (data ?? []) as Category[];
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await this.cliente
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      throw new AppError("No se pudo consultar la categoría");
    }

    return (data as Category | null) ?? null;
  }

  async findById(id: string): Promise<Category | null> {
    const { data, error } = await this.cliente
      .from("categories")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      throw new AppError("No se pudo consultar la categoría");
    }

    return (data as Category | null) ?? null;
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    const { data, error } = await this.cliente
      .from("categories")
      .insert(input)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new CategorySlugExistsError();
      }
      throw new AppError("No se pudo crear la categoría");
    }

    return data as Category;
  }

  async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    const { data, error } = await this.cliente
      .from("categories")
      .update(input)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === "23505") {
        throw new CategorySlugExistsError();
      }
      throw new AppError("No se pudo actualizar la categoría");
    }

    if (!data) {
      throw new CategoryNotFoundError();
    }

    return data as Category;
  }

  async delete(id: string): Promise<void> {
    const { data, error } = await this.cliente
      .from("categories")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      // 23503: la categoría todavía tiene productos asociados
      if (error.code === "23503") {
        throw new AppError(
          "La categoría tiene productos asociados y no se puede eliminar",
          409,
          "CATEGORY_HAS_PRODUCTS",
        );
      }
      throw new AppError("No se pudo eliminar la categoría");
    }

    if (!data) {
      throw new CategoryNotFoundError();
    }
  }
}
