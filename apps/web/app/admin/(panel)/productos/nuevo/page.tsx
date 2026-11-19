import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NuevoProductoPage() {
  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/admin/productos"
          className="text-xs uppercase tracking-[0.2em] text-carbon/50 transition-colors hover:text-cuero"
        >
          ← Productos
        </Link>
        <h1 className="mt-2 font-display text-3xl">Nuevo producto</h1>
      </header>

      <ProductForm />
    </div>
  );
}
