"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ProductColor } from "@zapateria/shared";
import {
  AlignLeft,
  BadgeDollarSign,
  Check,
  Images,
  Info,
  Loader2,
  Palette,
  Ruler,
  Wand2,
} from "lucide-react";
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
import { useAviso } from "@/components/Toasts";
import { ImageUploader } from "./ImageUploader";
import { Seccion } from "./Seccion";

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
  const avisar = useAviso();
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
      avisar("exito", producto ? "Producto actualizado." : "Producto creado.");
      void queryClient.invalidateQueries({ queryKey: ["productos-admin"] });
      router.push("/admin/productos");
    },
    onError: (fallo) => {
      const mensaje = fallo instanceof Error ? fallo.message : "No se pudo guardar el producto.";
      setError(mensaje);
      avisar("error", mensaje);
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
      onSubmit={form.handleSubmit(
        (datos) => {
          setError(null);
          guardar.mutate(datos);
        },
        () => avisar("aviso", "Faltan campos por completar. Revisa los datos marcados."),
      )}
      className="space-y-5"
      noValidate
    >
      {error && <Alerta>{error}</Alerta>}

      <Seccion
        titulo="Información básica"
        icono={<Info className="size-4 text-terracota" aria-hidden />}
      >
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
              className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-stone-300 bg-white px-3 text-xs font-medium transition-all duration-200 hover:border-carbon hover:bg-stone-50 active:scale-[0.98]"
            >
              <Wand2 className="size-3.5" aria-hidden />
              Generar
            </button>
          </div>
        </Campo>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

        <label className="flex cursor-pointer items-start gap-3 rounded-sm border border-stone-200 bg-white p-4 transition-colors duration-200 hover:border-stone-300">
          <input
            type="checkbox"
            {...form.register("is_active")}
            className="mt-0.5 size-4 accent-terracota"
          />
          <span>
            <span className="block text-sm font-medium">Publicado en el catálogo</span>
            <span className="block text-xs text-stone-500">
              Si lo desmarcas, el producto se guarda como borrador y no se muestra en la tienda.
            </span>
          </span>
        </label>
      </Seccion>

      <Seccion
        titulo="Precios e inventario"
        icono={<BadgeDollarSign className="size-4 text-terracota" aria-hidden />}
      >
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
      </Seccion>

      <Seccion
        titulo="Descripción"
        icono={<AlignLeft className="size-4 text-terracota" aria-hidden />}
      >
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
      </Seccion>

      <Seccion titulo="Tallas" icono={<Ruler className="size-4 text-terracota" aria-hidden />}>
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
                  "min-w-11 rounded-sm border px-3 py-2 text-sm transition-all duration-200 active:scale-[0.98]",
                  activa
                    ? "border-terracota bg-terracota/10 font-medium text-terracota"
                    : "border-stone-300 hover:border-stone-400 hover:bg-stone-50",
                )}
              >
                {talla}
              </button>
            );
          })}
        </div>
      </Seccion>

      <Seccion
        titulo="Colores"
        icono={<Palette className="size-4 text-terracota" aria-hidden />}
      >
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
                  "flex items-center gap-2 rounded-sm border px-3 py-2 text-sm transition-all duration-200 active:scale-[0.98]",
                  activo
                    ? "border-terracota bg-terracota/10 font-medium text-terracota"
                    : "border-stone-300 hover:border-stone-400 hover:bg-stone-50",
                )}
              >
                <span
                  className="size-4 rounded-full border border-carbon/20"
                  style={{ backgroundColor: color.hex }}
                  aria-hidden
                />
                {color.nombre}
                {activo && <Check className="size-3.5" aria-hidden />}
              </button>
            );
          })}
        </div>
      </Seccion>

      <Seccion
        titulo="Imágenes"
        icono={<Images className="size-4 text-terracota" aria-hidden />}
      >
        <ImageUploader
          imagenes={imagenes}
          nombreProducto={nombre || "Producto"}
          onCambio={(nuevas) =>
            form.setValue("images", nuevas, { shouldValidate: true, shouldDirty: true })
          }
        />
      </Seccion>

      <div className="flex flex-col gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:justify-end">
        <Link
          href="/admin/productos"
          className="rounded-sm border border-stone-300 bg-white px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 ease-out hover:border-carbon hover:shadow-sm active:scale-[0.98]"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={guardar.isPending}
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-carbon px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-hueso transition-all duration-300 ease-out hover:scale-[1.01] hover:bg-carbon-suave active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {guardar.isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {guardar.isPending ? "Guardando…" : producto ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}
