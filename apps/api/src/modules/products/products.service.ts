import { generarSlug } from "../../shared/utils";
import { InvalidPriceError, ProductNotFoundError } from "./products.errors";
import type { ProductsRepository } from "./products.repository";
import type {
  CreateProductData,
  CreateProductInput,
  Product,
  ProductFilters,
  UpdateProductInput,
} from "./products.types";

/** Reglas de negocio del catálogo. No conoce HTTP ni Supabase. */
export class ProductsService {
  constructor(private readonly repositorio: ProductsRepository) {}

  /** Catálogo público: solo productos activos. */
  obtenerTodos(filtros: ProductFilters = {}): Promise<Product[]> {
    return this.repositorio.findAll({ ...filtros, incluir_inactivos: false });
  }

  /** Panel: incluye borradores (is_active = false). */
  obtenerTodosAdmin(filtros: ProductFilters = {}): Promise<Product[]> {
    return this.repositorio.findAll({ ...filtros, incluir_inactivos: true });
  }

  async obtenerPorSlug(slug: string): Promise<Product> {
    const producto = await this.repositorio.findBySlug(slug);

    if (!producto) {
      throw new ProductNotFoundError();
    }

    return producto;
  }

  obtenerDestacados(): Promise<Product[]> {
    return this.repositorio.findAll({ estado: "featured", incluir_inactivos: false });
  }

  async crear(input: CreateProductInput): Promise<Product> {
    const slug = input.slug ?? generarSlug(input.name);

    this.validarPrecio(input.price, input.sale_price);

    const datos: CreateProductData = { ...input, slug };
    return this.repositorio.create(datos);
  }

  async actualizar(id: string, input: UpdateProductInput): Promise<Product> {
    const existente = await this.repositorio.findById(id);

    if (!existente) {
      throw new ProductNotFoundError();
    }

    const precioFinal = input.price ?? existente.price;
    const ofertaFinal =
      input.sale_price === undefined ? existente.sale_price : input.sale_price;

    this.validarPrecio(precioFinal, ofertaFinal);

    return this.repositorio.update(id, input);
  }

  async eliminar(id: string): Promise<void> {
    const existente = await this.repositorio.findById(id);

    if (!existente) {
      throw new ProductNotFoundError();
    }

    await this.repositorio.delete(id);
  }

  private validarPrecio(precio: number, oferta: number | null): void {
    if (oferta !== null && oferta >= precio) {
      throw new InvalidPriceError();
    }
  }
}
