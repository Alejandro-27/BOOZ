import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { obtenerProductos, type ProductoConCategoria } from "@/lib/api";

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

// La vitrina cambia poco: se regenera cada 5 minutos en vez de consultar la
// API en cada visita.
export const revalidate = 300;

export default async function InicioPage() {
  let destacados: ProductoConCategoria[] = [];
  try {
    destacados = await obtenerProductos({ estado: "featured" }, 300);
  } catch {
    // Si la API no responde, la home sigue mostrando el hero y el CTA
  }

  const destacado = destacados[0];
  const portada = destacado?.images[0];

  return (
    <>
      {/* Portada: texto a la izquierda, foto de producto en retrato 4/5 */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-12 sm:pb-24 sm:pt-20">
        <div className="grid items-end gap-10 sm:grid-cols-12 sm:gap-12">
          <div className="sm:col-span-7">
            <p className="font-display text-sm text-oxblood">BOOZ</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.02] tracking-tight text-carbon sm:text-7xl">
              Calzado masculino de vestir, hecho con carácter
            </h1>
            <span aria-hidden className="mt-6 block h-px w-6 bg-laton" />
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-pizarra">
              Diseñado en Arauca, Colombia. Pocos modelos, elegidos uno por uno.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <Link
                href="/catalogo"
                className="bg-oxblood px-7 py-3.5 text-center text-sm font-medium text-hueso transition-colors hover:bg-oxblood-oscuro"
              >
                Ver catálogo
              </Link>
              <Link
                href="/nosotros"
                className="text-sm text-carbon underline decoration-laton decoration-1 underline-offset-4 transition-colors hover:text-oxblood"
              >
                Nuestra historia
              </Link>
            </div>
          </div>

          {portada && destacado && (
            <div className="sm:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden bg-carbon/5">
                <Image
                  src={portada.url}
                  alt={portada.alt || destacado.name}
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 640px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 font-display text-xs text-pizarra">{destacado.name}</p>
            </div>
          )}
        </div>
      </section>

      {/* Beneficios: una línea, sin tarjetas */}
      <section className="border-y border-carbon/10">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-3 sm:gap-12">
          {BENEFICIOS.map(({ titulo, descripcion }, i) => (
            <div key={titulo}>
              <p className="font-display text-xs text-pizarra">0{i + 1}</p>
              <p className="mt-2 font-display text-xl text-carbon">{titulo}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-pizarra">{descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modelos destacados */}
      {destacados.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4 sm:mb-16">
            <div>
              <h2 className="font-display text-3xl tracking-tight text-carbon sm:text-4xl">
                Modelos destacados
              </h2>
              <span aria-hidden className="mt-4 block h-px w-6 bg-laton" />
            </div>
            <Link
              href="/catalogo"
              className="text-sm text-oxblood underline decoration-1 underline-offset-4 hover:no-underline"
            >
              Ver todo el catálogo
            </Link>
          </div>

          <div className="reveal grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {destacados.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="bg-carbon py-20 text-hueso sm:py-24">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
              ¿Buscas un modelo en especial?
            </h2>
            <p className="mt-2 text-sm text-hueso/70">
              Escríbenos por WhatsApp y te ayudamos a encontrar tu talla.
            </p>
          </div>
          <Link
            href="/contacto"
            className="shrink-0 bg-hueso px-7 py-3.5 text-center text-sm font-medium text-carbon transition-colors hover:bg-laton"
          >
            Contáctanos
          </Link>
        </div>
      </section>
    </>
  );
}
