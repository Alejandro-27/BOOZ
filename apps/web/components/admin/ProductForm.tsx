"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ProductColor } from "@zapateria/shared";
import {
  actualizarProducto,
  crearProducto,
  listarCategoriasAdmin,
} from "@/lib/api-admin";
import type { ProductoConCategoria } from "@/lib/api";
import { COLORES, TALLAS } from "@/lib/constantes";
import {
  esquemaProducto,
  type EntradaProducto,
  type SalidaProducto,
} from "@/lib/esquemas-admin";
import { cn, generarSlug } from "@/lib/utils";
import { Alerta, Campo, claseInput } from "./Campo";
import { ImageUploader } from "./ImageUploader";

const ESTADOS = [
  { valor: "available", etiqueta: "Disponible" },
  { valor: "featured", etiqueta: "Destacado" },
  { valor: "soldout", etiqueta: "Agotado" },
  { valor: "coming", etiqueta: "Próximamente" },
] as const;

function valoresIniciales(producto?: ProductoConCategoria): EntradaProducto {
  return {
    name: producto?.name ?? "",
    slug: producto?.slug ?? "",
    sku: producto?.sku ?? "",
    category_id: producto?.category_id ?? "",
    short_description: producto?.short_description ?? "",
    long_description: producto?.long_description ?? "",
    price: producto ? String(producto.price / 100) : "",
    sale_price: producto?.sale_price != null ? String(producto.sale_price / 100) : "",
    stock: producto?.stock != null ? String(producto.stock) : "",
    material: producto?.material ?? "",
    status: producto?.status ?? "available",
    sizes: producto?.sizes ?? [],
    colors: producto?.colors ?? [],
    images: producto?.images ?? [],
    tags: producto?.tags ?? [],
    is_active: producto?.is_active ?? true,
  };
}

interface Props {
  producto?: ProductoConCategoria;
}

export function ProductForm({ producto }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: categorias = [] } = useQuery({
    queryKey: ["categorias-admin"],
    queryFn: listarCategoriasAdmin,
  });

  const form = useForm<EntradaProducto, unknown, SalidaProducto>({
    resolver: zodResolver(esquemaProducto),
    defaultValues: valoresIniciales(producto),
  });

  const guardar = useMutation({
    mutationFn: (datos: SalidaProducto) =>
      producto ? actualizarProducto(producto.id, datos) : crearProducto(datos),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["productos-admin"] });
      router.push("/admin/productos");
    },
    onError: (fallo) => {
      setError(fallo instanceof Error ? fallo.message : "No se pudo guardar el producto.");
    },
  });

  const tallas = form.watch("sizes") ?? [];
  const colores = form.watch("colors") ?? [];
  const imagenes = form.watch("images") ?? [];
  const nombre = form.watch("name") ?? "";

  const alternarTalla = (talla: string) => {
    form.setValue(
      "sizes",
      tallas.includes(talla) ? tallas.filter((valor) => valor !== talla) : [...tallas, talla],
      { shouldValidate: true },
    );
  };

  const alternarColor = (color: ProductColor) => {
    const yaSeleccionado = colores.some((valor) => valor.name === color.name);
    form.setValue(
      "colors",
      yaSeleccionado ? colores.filter((valor) => valor.name !== color.name) : [...colores, color],
      { shouldValidate: true },
    );
  };

  const errores = form.formState.errors;

  return (
    <form
      onSubmit={form.handleSubmit((datos) => {
        setError(null);
        guardar.mutate(datos);
      })}
      className="space-y-8"
      noValidate
    >
      {error && <Alerta>{error}</Alerta>}

      <section className="space-y-4">
        <h2 className="font-display text-xl">Información básica</h2>

        <Campo etiqueta="Nombre" htmlFor="name" error={errores.name?.message}>
          <input id="name" {...form.register("name")} className={claseInput} />
        </Campo>

        <Campo
          etiqueta="Slug"
          htmlFor="slug"
          error={errores.slug?.message}
          ayuda="Se usa en la URL del producto."
        >
          <div className="flex gap-2">
            <input id="slug" {...form.register("slug")} className={claseInput} />
            <button
              type="button"
              onClick={() =>
                form.setValue("slug", generarSlug(nombre), { shouldValidate: true })
              }
              className="shrink-0 border border-carbon/20 px-3 text-xs uppercase tracking-[0.15em] transition-colors hover:border-carbon"
            >
              Generar
            </button>
          </div>
        </Campo>

        <div className="grid gap-4 sm:grid-cols-2">
          <Campo etiqueta="SKU" htmlFor="sku" error={errores.sku?.message}>
            <input id="sku" {...form.register("sku")} className={claseInput} />
          </Campo>

          <Campo
            etiqueta="Categoría"
            htmlFor="category_id"
            error={errores.category_id?.message}
          >
            <select id="category_id" {...form.register("category_id")} className={claseInput}>
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.name}
                </option>
              ))}
            </select>
          </Campo>

          <Campo etiqueta="Estado" htmlFor="status" error={errores.status?.message}>
            <select id="status" {...form.register("status")} className={claseInput}>
              {ESTADOS.map((estado) => (
                <option key={estado.valor} value={estado.valor}>
                  {estado.etiqueta}
                </option>
              ))}
            </select>
          </Campo>
        </div>

        <label className="flex items-start gap-3 border border-carbon/10 bg-white p-4">
          <input
            type="checkbox"
            {...form.register("is_active")}
            className="mt-0.5 size-4 accent-carbon"
          />
          <span>
            <span className="block text-sm font-medium">Publicado en el catálogo</span>
            <span className="block text-xs text-carbon/50">
              Si lo desmarcas, el producto se guarda como borrador y no se muestra en la tienda.
            </span>
          </span>
        </label>
      </section>

      <section className="space-y-4 border-t border-carbon/10 pt-6">
        <h2 className="font-display text-xl">Precios e inventario</h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <Campo
            etiqueta="Precio (COP)"
            htmlFor="price"
            error={errores.price?.message}
            ayuda="Ej: 1899.00"
          >
            <input
              id="price"
              type="text"
              inputMode="decimal"
              {...form.register("price")}
              className={claseInput}
            />
          </Campo>

          <Campo
            etiqueta="Precio de oferta"
            htmlFor="sale_price"
            error={errores.sale_price?.message}
            ayuda="Vacío si no hay oferta."
          >
            <input
              id="sale_price"
              type="text"
              inputMode="decimal"
              {...form.register("sale_price")}
              className={claseInput}
            />
          </Campo>

          <Campo
            etiqueta="Stock"
            htmlFor="stock"
            error={errores.stock?.message}
            ayuda="Vacío si no se controla."
          >
            <input
              id="stock"
              type="text"
              inputMode="numeric"
              {...form.register("stock")}
              className={claseInput}
            />
          </Campo>
        </div>
      </section>

      <section className="space-y-4 border-t border-carbon/10 pt-6">
        <h2 className="font-display text-xl">Descripción</h2>

        <Campo
          etiqueta="Descripción corta"
          htmlFor="short_description"
          error={errores.short_description?.message}
        >
          <textarea
            id="short_description"
            rows={2}
            {...form.register("short_description")}
            className={claseInput}
          />
        </Campo>

        <Campo
          etiqueta="Descripción larga"
          htmlFor="long_description"
          error={errores.long_description?.message}
        >
          <textarea
            id="long_description"
            rows={5}
            {...form.register("long_description")}
            className={claseInput}
          />
        </Campo>

        <Campo etiqueta="Material" htmlFor="material" error={errores.material?.message}>
          <input id="material" {...form.register("material")} className={claseInput} />
        </Campo>
      </section>

      <section className="space-y-4 border-t border-carbon/10 pt-6">
        <h2 className="font-display text-xl">Tallas</h2>
        <div className="flex flex-wrap gap-2">
          {TALLAS.map((talla) => {
            const activa = tallas.includes(talla);
            return (
              <button
                key={talla}
                type="button"
                onClick={() => alternarTalla(talla)}
                aria-pressed={activa}
                className={cn(
                  "min-w-11 border px-3 py-2 text-sm transition-colors",
                  activa
                    ? "border-carbon bg-carbon text-hueso"
                    : "border-carbon/20 hover:border-carbon",
                )}
              >
                {talla}
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4 border-t border-carbon/10 pt-6">
        <h2 className="font-display text-xl">Colores</h2>
        <div className="flex flex-wrap gap-2">
          {COLORES.map((color) => {
            const activo = colores.some((valor) => valor.name === color.nombre);
            return (
              <button
                key={color.nombre}
                type="button"
                onClick={() => alternarColor({ name: color.nombre, hex: color.hex })}
                aria-pressed={activo}
                className={cn(
                  "flex items-center gap-2 border px-3 py-2 text-sm transition-colors",
                  activo ? "border-carbon bg-carbon/5" : "border-carbon/20 hover:border-carbon",
                )}
              >
                <span
                  className="size-4 rounded-full border border-carbon/20"
                  style={{ backgroundColor: color.hex }}
                  aria-hidden
                />
                {color.nombre}
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4 border-t border-carbon/10 pt-6">
        <h2 className="font-display text-xl">Imágenes</h2>
        <ImageUploader
          imagenes={imagenes}
          nombreProducto={nombre || "Producto"}
          onCambio={(nuevas) =>
            form.setValue("images", nuevas, { shouldValidate: true, shouldDirty: true })
          }
        />
      </section>

      <div className="flex flex-col gap-3 border-t border-carbon/10 pt-6 sm:flex-row sm:justify-end">
        <Link
          href="/admin/productos"
          className="border border-carbon/20 px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:border-carbon"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={guardar.isPending}
          className="bg-carbon px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-hueso transition-colors hover:bg-carbon-suave disabled:cursor-not-allowed disabled:opacity-60"
        >
          {guardar.isPending ? "Guardando…" : producto ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}
