"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Loader2, Package, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { eliminarProducto, listarProductosAdmin } from "@/lib/api-admin";
import { formatearPrecio } from "@/lib/utils";
import { Alerta, claseBadge, claseBotonIcono } from "@/components/admin/Campo";
import { useAviso } from "@/components/Toasts";

export default function ProductosPage() {
  const queryClient = useQueryClient();
  const avisar = useAviso();
  const [busqueda, setBusqueda] = useState("");
  const [termino, setTermino] = useState("");
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Espera 300 ms antes de consultar para no pedir en cada tecla
  useEffect(() => {
    const temporizador = setTimeout(() => setTermino(busqueda.trim()), 300);
    return () => clearTimeout(temporizador);
  }, [busqueda]);

  const {
    data: productos = [],
    isLoading,
    error: errorConsulta,
  } = useQuery({
    queryKey: ["productos-admin", termino],
    queryFn: () => listarProductosAdmin(termino || undefined),
  });

  const eliminar = useMutation({
    mutationFn: eliminarProducto,
    onSuccess: () => {
      setConfirmando(null);
      avisar("exito", "Producto eliminado.");
      void queryClient.invalidateQueries({ queryKey: ["productos-admin"] });
    },
    onError: (fallo) => {
      const mensaje = fallo instanceof Error ? fallo.message : "No se pudo eliminar el producto.";
      setError(mensaje);
      avisar("error", mensaje);
    },
  });

  return (
    <div className="space-y-6">
      <header className="entrada-admin flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-terracota">
            <span className="h-px w-6 bg-laton-fuerte" aria-hidden />
            Catálogo
          </p>
          <h1 className="mt-2 font-display text-3xl">Productos</h1>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 rounded-sm bg-carbon px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-hueso transition-all duration-300 ease-out hover:scale-[1.01] hover:bg-carbon-suave active:scale-[0.98]"
        >
          <Plus className="size-4" aria-hidden />
          Nuevo producto
        </Link>
      </header>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400"
          aria-hidden
        />
        <input
          type="search"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
          placeholder="Buscar por nombre o SKU"
          aria-label="Buscar productos"
          className="w-full rounded-sm border border-stone-300 bg-white py-3 pl-10 pr-3 text-sm outline-none transition-all duration-200 focus:border-terracota focus:ring-2 focus:ring-terracota/15"
        />
      </div>

      {error && <Alerta>{error}</Alerta>}
      {errorConsulta && (
        <Alerta>No pudimos cargar los productos. Revisa que la API esté disponible.</Alerta>
      )}

      {isLoading ? (
        <>
          <p role="status" className="sr-only">
            Cargando productos…
          </p>
          <ul
            aria-hidden
            className="divide-y divide-stone-200 overflow-hidden rounded-sm border border-stone-200 bg-tarjeta shadow-sm"
          >
            {Array.from({ length: 5 }).map((_, indice) => (
              <li key={indice} className="flex animate-pulse items-center gap-4 p-4">
                <div className="size-16 shrink-0 rounded-sm bg-stone-200" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-3 w-40 max-w-full rounded-full bg-stone-200" />
                  <div className="h-2.5 w-24 max-w-full rounded-full bg-stone-200" />
                  <div className="h-3 w-16 rounded-full bg-stone-200" />
                </div>
                <div className="h-11 w-24 shrink-0 rounded-sm bg-stone-200" />
              </li>
            ))}
          </ul>
        </>
      ) : productos.length === 0 ? (
        <div className="rounded-sm border border-stone-200 bg-tarjeta px-6 py-14 text-center shadow-sm">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-terracota/10 text-terracota">
            <Package className="size-6" aria-hidden />
          </span>
          <p className="mt-4 font-display text-xl">
            {termino ? "Sin resultados" : "Todavía no hay productos"}
          </p>
          <p className="mt-2 text-sm text-stone-500">
            {termino
              ? "Prueba con otro nombre o SKU."
              : "Crea tu primer producto para empezar a vender."}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-stone-200 overflow-hidden rounded-sm border border-stone-200 bg-tarjeta shadow-sm">
          {productos.map((producto, indice) => {
            const imagen = producto.images[0];
            const agotado = producto.status === "soldout" || producto.stock === 0;

            return (
              <li
                key={producto.id}
                className="entrada-admin grid gap-3 p-4 transition-colors duration-200 hover:bg-stone-100 sm:grid-cols-[64px_1fr_auto] sm:items-center"
                style={{ animationDelay: `${Math.min(indice, 5) * 75}ms` }}
              >
                <div className="relative aspect-square w-16 overflow-hidden rounded-sm bg-stone-100">
                  {imagen ? (
                    <Image
                      src={imagen.url}
                      alt={imagen.alt || producto.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[0.625rem] text-stone-400">
                      Sin imagen
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{producto.name}</p>
                    {!producto.is_active && (
                      <span className={`${claseBadge} border border-stone-300 text-stone-500`}>
                        Borrador
                      </span>
                    )}
                    {producto.status === "featured" && (
                      <span className={`${claseBadge} bg-laton-fuerte/20 text-carbon`}>
                        Destacado
                      </span>
                    )}
                    {agotado && (
                      <span className={`${claseBadge} bg-carbon text-hueso`}>Agotado</span>
                    )}
                  </div>
                  <p className="truncate text-xs text-stone-500">
                    {producto.sku} · {producto.category?.name ?? "Sin categoría"}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {formatearPrecio(producto.sale_price ?? producto.price)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <Link
                    href={`/admin/productos/${producto.id}/editar`}
                    aria-label={`Editar ${producto.name}`}
                    title="Editar"
                    className={`${claseBotonIcono} text-stone-600 hover:border-carbon hover:text-carbon`}
                  >
                    <Pencil className="size-4" aria-hidden />
                  </Link>

                  {confirmando === producto.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => eliminar.mutate(producto.id)}
                        disabled={eliminar.isPending}
                        className="inline-flex h-11 items-center gap-1.5 rounded-sm bg-red-700 px-3 text-[11px] font-semibold uppercase tracking-wider text-white transition-all duration-200 hover:bg-red-800 disabled:opacity-60"
                      >
                        {eliminar.isPending && (
                          <Loader2 className="size-3.5 animate-spin" aria-hidden />
                        )}
                        {eliminar.isPending ? "Eliminando…" : "Confirmar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmando(null)}
                        className="h-11 rounded-sm border border-stone-300 px-3 text-[11px] font-semibold uppercase tracking-wider transition-colors hover:border-carbon"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setConfirmando(producto.id);
                      }}
                      aria-label={`Eliminar ${producto.name}`}
                      title="Eliminar"
                      className={`${claseBotonIcono} text-terracota hover:border-terracota hover:bg-terracota/5`}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-xs text-stone-500">
        {productos.length} {productos.length === 1 ? "producto" : "productos"} en el listado.
      </p>
    </div>
  );
}
