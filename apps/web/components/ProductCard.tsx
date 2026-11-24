import Image from "next/image";
import Link from "next/link";
import type { ProductoConCategoria } from "@/lib/api";
import { cn, formatearPrecio } from "@/lib/utils";

interface Props {
  producto: ProductoConCategoria;
  prioritaria?: boolean;
}

export function ProductCard({ producto, prioritaria = false }: Props) {
  const imagen = producto.images[0];
  const imagenHover = producto.images[1];
  const agotado = producto.status === "soldout" || producto.stock === 0;
  const descuento =
    producto.sale_price !== null
      ? Math.round((1 - producto.sale_price / producto.price) * 100)
      : null;

  return (
    <article className="product-card group overflow-hidden rounded-sm border border-stone-200 bg-tarjeta shadow-sm transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-md active:scale-[0.98]">
      <Link href={`/producto/${producto.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-carbon/5">
          {imagen ? (
            <>
              <Image
                src={imagen.url}
                alt={imagen.alt || producto.name}
                fill
                priority={prioritaria}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={cn(
                  "object-cover transition-opacity duration-500 ease-in-out",
                  agotado && "opacity-60",
                  imagenHover && !agotado && "group-hover:opacity-0",
                )}
              />
              {imagenHover && !agotado && (
                <Image
                  src={imagenHover.url}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
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
              <span className="bg-dorado px-2 py-1 text-[0.6875rem] font-medium text-carbon">
                Destacado
              </span>
            )}
            {agotado && (
              <span className="bg-carbon px-2 py-1 text-[0.6875rem] font-medium text-hueso">
                Agotado
              </span>
            )}
            {descuento !== null && !agotado && (
              <span className="bg-cuero px-2 py-1 text-[0.6875rem] font-medium text-hueso">
                -{descuento}%
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1 p-4">
          {producto.category && (
            <p className="text-[0.6875rem] font-medium text-oxblood">{producto.category.name}</p>
          )}
          <h3 className="font-display text-lg leading-snug">{producto.name}</h3>
          <div className="flex items-baseline gap-2">
            {producto.sale_price !== null ? (
              <>
                <span className="text-base font-semibold text-oxblood">
                  {formatearPrecio(producto.sale_price)}
                </span>
                <span className="text-sm text-pizarra line-through">
                  {formatearPrecio(producto.price)}
                </span>
              </>
            ) : (
              <span className="text-base font-semibold text-oxblood">
                {formatearPrecio(producto.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
