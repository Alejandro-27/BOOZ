import Image from "next/image";
import Link from "next/link";
import type { ProductoConCategoria } from "@/lib/api";
import { cn, formatearPrecio } from "@/lib/utils";

interface Props {
  producto: ProductoConCategoria;
  prioritaria?: boolean;
}

const claseBadge =
  "rounded-full border border-white/50 bg-white/70 px-2.5 py-1 text-xs font-semibold backdrop-blur-md";

export function ProductCard({ producto, prioritaria = false }: Props) {
  const imagen = producto.images[0];
  const imagenHover = producto.images[1];
  const agotado = producto.status === "soldout" || producto.stock === 0;
  const puedeCruzar = Boolean(imagenHover) && !agotado;
  const descuento =
    producto.sale_price !== null
      ? Math.round((1 - producto.sale_price / producto.price) * 100)
      : null;

  return (
    <article className="product-card reveal-on-scroll group overflow-hidden rounded-2xl border border-stone-200 bg-tarjeta shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]">
      <Link href={`/producto/${producto.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[4/5] shrink-0 overflow-hidden bg-carbon/5">
          {imagen ? (
            <>
              <Image
                src={imagen.url}
                alt={imagen.alt || producto.name}
                fill
                priority={prioritaria}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={cn(
                  "object-cover transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  agotado && "opacity-60",
                  puedeCruzar && "group-hover:opacity-0 group-active:opacity-0",
                )}
              />
              {imagenHover && !agotado && (
                <Image
                  src={imagenHover.url}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-active:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-carbon/40">
              Sin imagen
            </div>
          )}

          <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
            {producto.status === "featured" && (
              <span className={cn(claseBadge, "text-carbon")}>Destacado</span>
            )}
            {agotado && <span className={cn(claseBadge, "text-pizarra")}>Agotado</span>}
            {descuento !== null && !agotado && (
              <span className={cn(claseBadge, "text-terracota")}>-{descuento}%</span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1 p-4">
          {producto.category && (
            <p className="text-[0.6875rem] font-medium text-oxblood">{producto.category.name}</p>
          )}
          <h3 className="line-clamp-2 font-display text-lg leading-snug">{producto.name}</h3>
          <div className="mt-auto flex items-baseline gap-2">
            {producto.sale_price !== null ? (
              <>
                <span className="text-base font-semibold tabular-nums text-terracota">
                  {formatearPrecio(producto.sale_price)}
                </span>
                <span className="text-sm tabular-nums text-pizarra line-through">
                  {formatearPrecio(producto.price)}
                </span>
              </>
            ) : (
              <span className="text-base font-semibold tabular-nums text-terracota">
                {formatearPrecio(producto.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
