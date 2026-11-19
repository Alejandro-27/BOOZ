import { CategoryNotFoundError } from "./categories.errors";
import type { CategoriesRepository } from "./categories.repository";
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "./categories.types";

/** Reglas de negocio del catálogo de categorías. No conoce HTTP ni Supabase. */
export class CategoriesService {
  constructor(private readonly repositorio: CategoriesRepository) {}

  async obtenerTodas(): Promise<Category[]> {
    return this.repositorio.findAll();
  }

  async obtenerPorSlug(slug: string): Promise<Category> {
    const categoria = await this.repositorio.findBySlug(slug);

    if (!categoria) {
      throw new CategoryNotFoundError();
    }

    return categoria;
  }

  async obtenerPorId(id: string): Promise<Category> {
    const categoria = await this.repositorio.findById(id);

    if (!categoria) {
      throw new CategoryNotFoundError();
    }

    return categoria;
  }

  async crear(input: CreateCategoryInput): Promise<Category> {
    return this.repositorio.create(input);
  }

  async actualizar(id: string, input: UpdateCategoryInput): Promise<Category> {
    await this.obtenerPorId(id);
    return this.repositorio.update(id, input);
  }

  async eliminar(id: string): Promise<void> {
    await this.obtenerPorId(id);
    return this.repositorio.delete(id);
  }
}
