"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { eliminarProducto, listarProductosAdmin } from "@/lib/api-admin";
import { formatearPrecio } from "@/lib/utils";
import { Alerta } from "@/components/admin/Campo";

export default function ProductosPage() {
  const queryClient = useQueryClient();
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
      void queryClient.invalidateQueries({ queryKey: ["productos-admin"] });
    },
    onError: (fallo) => {
      setError(fallo instanceof Error ? fallo.message : "No se pudo eliminar el producto.");
    },
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cuero">Catálogo</p>
          <h1 className="mt-2 font-display text-3xl">Productos</h1>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-2 bg-carbon px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-hueso transition-colors hover:bg-carbon-suave"
        >
          <Plus className="size-4" aria-hidden />
          Nuevo producto
        </Link>
      </header>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-carbon/40"
          aria-hidden
        />
        <input
          type="search"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
          placeholder="Buscar por nombre o SKU"
          aria-label="Buscar productos"
          className="w-full border border-carbon/20 bg-white py-3 pl-10 pr-3 text-sm outline-none transition-colors focus:border-cuero"
        />
      </div>

      {error && <Alerta>{error}</Alerta>}
      {errorConsulta && (
        <Alerta>No pudimos cargar los productos. Revisa que la API esté disponible.</Alerta>
      )}

      {isLoading ? (
        <p className="text-sm text-carbon/60">Cargando productos…</p>
      ) : productos.length === 0 ? (
        <div className="border border-carbon/10 bg-white px-6 py-14 text-center">
          <p className="font-display text-xl">
            {termino ? "Sin resultados" : "Todavía no hay productos"}
          </p>
          <p className="mt-2 text-sm text-carbon/60">
            {termino
              ? "Prueba con otro nombre o SKU."
              : "Crea tu primer producto para empezar a vender."}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-carbon/10 border border-carbon/10 bg-white">
          {productos.map((producto) => {
            const imagen = producto.images[0];
            const agotado = producto.status === "soldout" || producto.stock === 0;

            return (
              <li
                key={producto.id}
                className="grid gap-3 p-4 sm:grid-cols-[64px_1fr_auto] sm:items-center"
              >
                <div className="relative aspect-square w-16 overflow-hidden bg-carbon/5">
                  {imagen ? (
                    <Image
                      src={imagen.url}
                      alt={imagen.alt || producto.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[0.625rem] text-carbon/40">
                      Sin imagen
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{producto.name}</p>
                    {!producto.is_active && (
                      <span className="border border-carbon/30 px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-widest text-carbon/60">
                        Borrador
                      </span>
                    )}
                    {producto.status === "featured" && (
                      <span className="bg-dorado px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-widest">
                        Destacado
                      </span>
                    )}
                    {agotado && (
                      <span className="bg-carbon px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-widest text-hueso">
                        Agotado
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-carbon/50">
                    {producto.sku} · {producto.category?.name ?? "Sin categoría"}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {formatearPrecio(producto.sale_price ?? producto.price)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 sm:flex-col sm:items-stretch lg:flex-row">
                  <Link
                    href={`/admin/productos/${producto.id}/editar`}
                    className="flex items-center justify-center gap-1.5 border border-carbon/20 px-3 py-2 text-xs uppercase tracking-[0.1em] transition-colors hover:border-carbon"
                  >
                    <Pencil className="size-3.5" aria-hidden />
                    Editar
                  </Link>

                  {confirmando === producto.id ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => eliminar.mutate(producto.id)}
                        disabled={eliminar.isPending}
                        className="bg-red-700 px-3 py-2 text-xs uppercase tracking-[0.1em] text-white disabled:opacity-60"
                      >
                        {eliminar.isPending ? "Eliminando…" : "Confirmar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmando(null)}
                        className="border border-carbon/20 px-3 py-2 text-xs uppercase tracking-[0.1em]"
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
                      className="flex items-center justify-center gap-1.5 border border-carbon/20 px-3 py-2 text-xs uppercase tracking-[0.1em] text-cuero transition-colors hover:border-cuero"
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                      Eliminar
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-xs text-carbon/50">
        {productos.length} {productos.length === 1 ? "producto" : "productos"} en el listado.
      </p>
    </div>
  );
}
