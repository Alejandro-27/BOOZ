"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowRight, Package, Plus, Star, Tags } from "lucide-react";
import { listarProductosAdmin } from "@/lib/api-admin";
import { Alerta } from "@/components/admin/Campo";

export default function DashboardPage() {
  const {
    data: productos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["productos-admin", ""],
    queryFn: () => listarProductosAdmin(),
  });

  const total = productos.length;
  const activos = productos.filter((producto) => producto.is_active).length;
  const agotados = productos.filter(
    (producto) => producto.status === "soldout" || producto.stock === 0,
  ).length;

  const tarjetas = [
    {
      etiqueta: "Total de productos",
      valor: total,
      detalle: `${activos} ${activos === 1 ? "publicado" : "publicados"}`,
      icono: Package,
    },
    {
      etiqueta: "Productos activos",
      valor: activos,
      detalle: total ? `${Math.round((activos / total) * 100)}% del catálogo` : "Sin productos",
      icono: Star,
    },
    {
      etiqueta: "Productos agotados",
      valor: agotados,
      detalle: agotados ? "Requieren reposición" : "Todo disponible",
      icono: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-8">
      <header className="entrada-admin">
        <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-terracota">
          <span className="h-px w-6 bg-laton-fuerte" aria-hidden />
          Panel
        </p>
        <h1 className="mt-2 font-display text-3xl">Resumen de la tienda</h1>
        <p className="mt-1 text-sm text-stone-500">Estado actual del catálogo.</p>
      </header>

      {error && (
        <Alerta>
          No pudimos cargar los indicadores. Revisa que la API esté disponible.
        </Alerta>
      )}

      <section
        aria-label="Indicadores"
        aria-busy={isLoading}
        className="grid gap-4 sm:grid-cols-3"
      >
        {tarjetas.map(({ etiqueta, valor, detalle, icono: Icono }, indice) =>
          isLoading ? (
            <div
              key={etiqueta}
              aria-hidden
              className="animate-pulse rounded-sm border border-stone-200 bg-tarjeta p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="mt-1 h-2.5 w-24 rounded-full bg-stone-200" />
                <div className="size-10 rounded-full bg-stone-200" />
              </div>
              <div className="mt-4 h-9 w-16 rounded-sm bg-stone-200" />
              <div className="mt-2 h-2.5 w-20 rounded-full bg-stone-200" />
            </div>
          ) : (
            <article
              key={etiqueta}
              className="entrada-admin rounded-sm border border-stone-200 bg-tarjeta p-5 shadow-sm transition-shadow duration-300 ease-out hover:shadow-md"
              style={{ animationDelay: `${indice * 75}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-stone-500">
                  {etiqueta}
                </p>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-terracota/10 text-terracota">
                  <Icono className="size-5" aria-hidden />
                </span>
              </div>
              <p className="mt-4 font-display text-4xl tabular-nums">{valor}</p>
              <p className="mt-1 text-xs text-stone-500">{detalle}</p>
            </article>
          ),
        )}
      </section>

      <section
        className="entrada-admin rounded-sm border border-stone-200 bg-tarjeta p-5 shadow-sm"
        style={{ animationDelay: "150ms" }}
      >
        <h2 className="mb-4 border-b border-laton-fuerte pb-2 font-display text-xl">
          Acciones rápidas
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin/productos/nuevo"
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-carbon px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-hueso transition-all duration-300 ease-out hover:scale-[1.01] hover:bg-carbon-suave active:scale-[0.98]"
          >
            <Plus className="size-4" aria-hidden />
            Nuevo producto
          </Link>
          <Link
            href="/admin/productos"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-stone-300 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 ease-out hover:scale-[1.01] hover:border-carbon hover:shadow-sm active:scale-[0.98]"
          >
            <Package className="size-4" aria-hidden />
            Gestionar productos
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            href="/admin/categorias"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-stone-300 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 ease-out hover:scale-[1.01] hover:border-carbon hover:shadow-sm active:scale-[0.98]"
          >
            <Tags className="size-4" aria-hidden />
            Categorías
          </Link>
        </div>
      </section>
    </div>
  );
}
