"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { listarProductosAdmin } from "@/lib/api-admin";
import { ProductForm } from "@/components/admin/ProductForm";
import { Alerta } from "@/components/admin/Campo";

export default function EditarProductoPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: productos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["productos-admin", ""],
    queryFn: () => listarProductosAdmin(),
  });

  const producto = productos?.find((item) => item.id === id);

  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/admin/productos"
          className="text-xs uppercase tracking-[0.2em] text-carbon/50 transition-colors hover:text-cuero"
        >
          ← Productos
        </Link>
        <h1 className="mt-2 font-display text-3xl">Editar producto</h1>
      </header>

      {error ? (
        <Alerta>No pudimos cargar el producto. Revisa que la API esté disponible.</Alerta>
      ) : isLoading ? (
        <p className="text-sm text-carbon/60">Cargando producto…</p>
      ) : !producto ? (
        <div className="border border-carbon/10 bg-white px-6 py-12 text-center">
          <p className="font-display text-xl">Producto no encontrado</p>
          <p className="mt-2 text-sm text-carbon/60">
            Puede que se haya eliminado o que la dirección no exista.
          </p>
          <Link
            href="/admin/productos"
            className="mt-6 inline-block border border-carbon/20 px-5 py-2.5 text-xs uppercase tracking-[0.15em] transition-colors hover:border-carbon"
          >
            Volver a productos
          </Link>
        </div>
      ) : (
        <ProductForm producto={producto} />
      )}
    </div>
  );
}
