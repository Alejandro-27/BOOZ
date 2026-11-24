import type { Metadata } from "next";
import type { Category } from "@zapateria/shared";
import { FilterBar } from "@/components/FilterBar";
import { ProductCard } from "@/components/ProductCard";
import {
  obtenerCategorias,
  obtenerProductos,
  type ProductoConCategoria,
} from "@/lib/api";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Zapatos formales, casuales, de boda y botas para hombre.",
};

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** Lee un parámetro de búsqueda simple (ignora arrays y vacíos). */
function leerParametro(
  params: Record<string, string | string[] | undefined>,
  clave: string,
): string | undefined {
  const valor = params[clave];
  return typeof valor === "string" && valor.length > 0 ? valor : undefined;
}

/** Convierte pesos de la URL a centavos para la API. */
function aCentavos(pesos: string | undefined): number | undefined {
  if (!pesos) return undefined;
  const numero = Number(pesos);
  return Number.isFinite(numero) && numero >= 0 ? numero * 100 : undefined;
}

export default async function CatalogoPage({ searchParams }: Props) {
  const params = await searchParams;

  const categoria = leerParametro(params, "categoria");
  const talla = leerParametro(params, "talla");
  const color = leerParametro(params, "color");
  const precioMin = aCentavos(leerParametro(params, "precio_min"));
  const precioMax = aCentavos(leerParametro(params, "precio_max"));

  let productos: ProductoConCategoria[] = [];
  let categorias: Category[] = [];
  let error: string | null = null;

  try {
    [productos, categorias] = await Promise.all([
      obtenerProductos({ categoria, talla, color, precioMin, precioMax }),
      obtenerCategorias(),
    ]);
  } catch {
    error = "No pudimos cargar el catálogo en este momento. Intenta de nuevo en unos segundos.";
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <header>
        <p className="font-display text-sm text-oxblood">Catálogo</p>
        <h1 className="titulo-display mt-3 font-display tracking-tight text-carbon">
          Calzado de vestir
        </h1>
        <span aria-hidden className="mt-5 block h-px w-6 bg-laton" />
        <p className="mt-5 max-w-xl text-base leading-relaxed text-pizarra">
          Filtra por categoría, talla, color y precio para encontrar tu próximo par.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-12">
        <aside aria-label="Filtros del catálogo">
          <FilterBar categorias={categorias} />
        </aside>

        <section aria-label="Productos">
          {error ? (
            <p className="border border-oxblood/30 bg-oxblood/5 px-4 py-3 text-sm text-oxblood">
              {error}
            </p>
          ) : productos.length === 0 ? (
            <div className="border border-carbon/10 px-6 py-16 text-center">
              <p className="font-display text-xl">No encontramos productos con esos filtros</p>
              <p className="mt-2 text-sm text-pizarra">
                Prueba con otra talla, color o rango de precio.
              </p>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-pizarra">
                {productos.length} {productos.length === 1 ? "modelo" : "modelos"}
              </p>
              <div className="stagger grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
                {productos.map((producto, indice) => (
                  <ProductCard
                    key={producto.id}
                    producto={producto}
                    prioritaria={indice === 0}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
