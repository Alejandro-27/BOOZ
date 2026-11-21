import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import {
  obtenerConfiguracionSegura,
  obtenerProductos,
  type ProductoConCategoria,
} from "@/lib/api";

const BENEFICIOS = [
  {
    titulo: "Envíos a todo el país",
    descripcion: "Recibe tu pedido en 3 a 5 días hábiles.",
  },
  {
    titulo: "Cambios sin costo",
    descripcion: "30 días para cambiar tu talla.",
  },
  {
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
      {/* Hero editorial asimétrico: texto izquierda, aire a la derecha */}
      <section className="relative overflow-hidden bg-carbon text-hueso py-24 sm:py-32">
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid max-w-5xl gap-12 sm:grid-cols-2 sm:items-start">
            <div className="mt-4 sm:mt-0">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-oxblood">
                booz
              </p>
              <h1 className="mt-3 font-display text-5xl leading-[1.05] sm:text-6xl text-hueso">
                Calzado masculino de vestir, hecho con carácter
              </h1>
              <span className="block mt-2 h-[1px] w-20 bg-laton"></span>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-pizarra/90">
                {configuracion?.slogan ??
                  "Calzado masculino de vestir, hecho con carácter. Diseñado en Arauca, Colombia."}
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/catalogo"
                  className="bg-oxblood px-7 py-3 text-sm font-medium text-hueso hover:bg-oxblood-oscuro transition-colors"
                >
                  Ver catálogo
                </Link>
                <Link
                  href="/nosotros"
                  className="border border-pizarra/40 px-7 py-3 text-sm font-medium text-hueso hover:border-hueso transition-colors"
                >
                  Nuestra historia
                </Link>
              </div>
            </div>

            {/* Detalle firma: línea de latón + N.º alineado a la derecha */}
            <div className="hidden sm:flex flex-col items-end gap-2">
              <span className="w-24 h-[1px] bg-laton/60"></span>
              <p className="text-[10px] font-display tracking-[0.2em] uppercase text-laton/70">
                N.º 001 · Arauca
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios: línea horizontal editorial, no tarjetas idénticas */}
      <section className="border-b border-carbon/10 bg-hueso py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-oxblood">
            ¿Por qué BOOZ?
          </p>
          <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:gap-12">
            {BENEFICIOS.map(({ titulo, descripcion }, i) => (
              <div key={titulo} className="max-w-sm">
                <p className="text-[10px] font-display tracking-[0.2em] uppercase text-oxblood/70">
                  {i + 1}
                </p>
                <p className="mt-2 font-display text-xl text-carbon">{titulo}</p>
                <p className="mt-1.5 text-sm text-pizarra/80 leading-relaxed">
                  {descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modelos destacados */}
      {destacados.length > 0 && (
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-14 sm:mb-20">
              <div>
                <p className="text-[10px] font-display tracking-[0.2em] uppercase text-oxblood">
                  Selección
                </p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl text-hueso">
                  Modelos destacados
                </h2>
              </div>
              <Link
                href="/catalogo"
                className="text-[10px] font-display tracking-[0.15em] uppercase text-oxblood hover:underline underline-offset-4"
              >
                Ver todo el catálogo
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {destacados.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="bg-carbon text-hueso py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl text-hueso">
                ¿Buscas un modelo en especial?
              </h2>
              <p className="mt-2 text-sm text-hueso/70">
                Escríbenos por WhatsApp y te ayudamos a encontrar tu talla.
              </p>
            </div>
            <Link
              href="/contacto"
              className="bg-oxblood px-7 py-3 text-sm font-medium text-hueso hover:bg-oxblood-oscuro transition-colors"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
