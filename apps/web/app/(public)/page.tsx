import Link from "next/link";
import { RefreshCw, ShieldCheck, Truck } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import {
  obtenerConfiguracionSegura,
  obtenerProductos,
  type ProductoConCategoria,
} from "@/lib/api";

const BENEFICIOS = [
  {
    icono: Truck,
    titulo: "Envíos a todo el país",
    descripcion: "Recibe tu pedido en 3 a 5 días hábiles.",
  },
  {
    icono: RefreshCw,
    titulo: "Cambios sin costo",
    descripcion: "30 días para cambiar tu talla.",
  },
  {
    icono: ShieldCheck,
    titulo: "Garantía de 90 días",
    descripcion: "Respaldamos cada par que vendemos.",
  },
];

export default async function InicioPage() {
  const configuracion = await obtenerConfiguracionSegura();

  let destacados: ProductoConCategoria[] = [];
  try {
    destacados = await obtenerProductos({ estado: "featured" });
  } catch {
    // Si la API no responde, la home sigue mostrando el hero y el CTA
  }

  return (
    <>
      {/* Hero aspiracional */}
      <section className="relative overflow-hidden bg-carbon text-hueso">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(60% 80% at 80% 20%, #8b5e3c 0%, transparent 60%), radial-gradient(50% 60% at 10% 90%, #d4af37 0%, transparent 55%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <p className="text-xs uppercase tracking-[0.35em] text-dorado">Calzado de vestir</p>
          <h1 className="mt-5 max-w-2xl font-display text-4xl leading-[1.1] sm:text-6xl">
            Elegancia que se nota en cada paso
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-hueso/75">
            {configuracion?.slogan ??
              "Calzado de vestir para el hombre que cuida los detalles. Piel, comodidad y presencia en un mismo par."}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/catalogo"
              className="bg-dorado px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-carbon transition-colors hover:bg-dorado/90"
            >
              Ver catálogo
            </Link>
            <Link
              href="/nosotros"
              className="border border-hueso/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-hueso transition-colors hover:border-hueso"
            >
              Nuestra historia
            </Link>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="border-b border-carbon/10 bg-hueso">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3">
          {BENEFICIOS.map(({ icono: Icono, titulo, descripcion }) => (
            <div key={titulo} className="flex items-start gap-3">
              <Icono className="mt-0.5 size-5 shrink-0 text-cuero" aria-hidden />
              <div>
                <p className="text-sm font-semibold">{titulo}</p>
                <p className="text-sm text-carbon/60">{descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modelos destacados */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cuero">Selección</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Modelos destacados</h2>
          </div>
          <Link
            href="/catalogo"
            className="text-xs uppercase tracking-[0.2em] text-cuero underline-offset-4 hover:underline"
          >
            Ver todo el catálogo
          </Link>
        </div>

        {destacados.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {destacados.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-sm text-carbon/60">
            Estamos preparando la selección de destacados.{" "}
            <Link href="/catalogo" className="text-cuero underline underline-offset-4">
              Explora el catálogo completo
            </Link>
            .
          </p>
        )}
      </section>

      {/* CTA final */}
      <section className="bg-carbon text-hueso">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-16 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl">¿Buscas un modelo en especial?</h2>
            <p className="mt-2 text-sm text-hueso/70">
              Escríbenos por WhatsApp y te ayudamos a encontrar tu talla.
            </p>
          </div>
          <Link
            href="/contacto"
            className="bg-dorado px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-carbon transition-colors hover:bg-dorado/90"
          >
            Contáctanos
          </Link>
        </div>
      </section>
    </>
  );
}
