"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Package, Star } from "lucide-react";
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
    { etiqueta: "Total de productos", valor: total, icono: Package },
    { etiqueta: "Productos activos", valor: activos, icono: Star },
    { etiqueta: "Productos agotados", valor: agotados, icono: AlertTriangle },
  ];

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-cuero">Panel</p>
        <h1 className="mt-2 font-display text-3xl">Resumen de la tienda</h1>
      </header>

      {error && (
        <Alerta>
          No pudimos cargar los indicadores. Revisa que la API esté disponible.
        </Alerta>
      )}

      <section aria-label="Indicadores" className="grid gap-4 sm:grid-cols-3">
        {tarjetas.map(({ etiqueta, valor, icono: Icono }) => (
          <div key={etiqueta} className="border border-carbon/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.15em] text-carbon/60">{etiqueta}</p>
              <Icono className="size-5 text-cuero" aria-hidden />
            </div>
            <p className="mt-3 font-display text-4xl">{isLoading ? "—" : valor}</p>
          </div>
        ))}
      </section>

      <section className="border border-carbon/10 bg-white p-5">
        <h2 className="font-display text-xl">Acciones rápidas</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin/productos/nuevo"
            className="bg-carbon px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-hueso transition-colors hover:bg-carbon-suave"
          >
            Nuevo producto
          </Link>
          <Link
            href="/admin/productos"
            className="border border-carbon/20 px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:border-carbon"
          >
            Gestionar productos
          </Link>
          <Link
            href="/admin/categorias"
            className="border border-carbon/20 px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:border-carbon"
          >
            Categorías
          </Link>
        </div>
      </section>
    </div>
  );
}
