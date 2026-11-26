import { Suspense } from "react";
import type { Metadata } from "next";
import type { Category } from "@zapateria/shared";
import { FilterBar } from "@/components/FilterBar";
import { ProductCard } from "@/components/ProductCard";
import { SkeletonGrid } from "@/components/SkeletonGrid";
import { obtenerCategorias, obtenerProductos, type ProductoConCategoria } from "@/lib/api";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Zapatos formales, casuales, de boda y botas para hombre.",
};

const MENSAJE_ERROR =
  "No pudimos cargar el catálogo en este momento. Intenta de nuevo en unos segundos.";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

interface ResultadoProductos {
  productos: ProductoConCategoria[];
  error: string | null;
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

  // La consulta arranca antes de esperar las categorías: ambas van en paralelo.
  // El catch se adjunta ya para que un fallo no quede sin manejar.
  const datosProductos: Promise<ResultadoProductos> = obtenerProductos({
    categoria,
    talla,
    color,
    precioMin,
    precioMax,
  }).then(
    (productos) => ({ productos, error: null }),
    () => ({ productos: [], error: MENSAJE_ERROR }),
  );

  let categorias: Category[] = [];
  try {
    categorias = await obtenerCategorias();
  } catch {
    // Sin categorías la barra sigue sirviendo para talla, color y precio.
  }

  const clave = [categoria, talla, color, precioMin, precioMax].join("|");

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

      <section aria-label="Filtros del catálogo" className="mt-8">
        <FilterBar categorias={categorias} />
      </section>

      <section aria-label="Productos" className="mt-8">
        <Suspense key={clave} fallback={<SkeletonGrid />}>
          <Listado datos={datosProductos} />
        </Suspense>
      </section>
    </div>
  );
}

async function Listado({ datos }: { datos: Promise<ResultadoProductos> }) {
  const { productos, error } = await datos;

  if (error) {
    return (
      <p
        role="alert"
        className="rounded-sm border border-oxblood/30 bg-oxblood/5 px-4 py-3 text-sm text-oxblood"
      >
        {error}
      </p>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 px-6 py-16 text-center">
        <p className="font-display text-xl">No encontramos productos con esos filtros</p>
        <p className="mt-2 text-sm text-pizarra">Prueba con otra talla, color o rango de precio.</p>
      </div>
    );
  }

  return (
    <>
      <p className="mb-5 text-sm text-pizarra">
        {productos.length} {productos.length === 1 ? "modelo" : "modelos"}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
        {productos.map((producto, indice) => (
          <ProductCard key={producto.id} producto={producto} prioritaria={indice === 0} />
        ))}
      </div>
    </>
  );
}
