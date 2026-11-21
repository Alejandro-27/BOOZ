import Image from "next/image";
import Link from "next/link";
import type { ProductoConCategoria } from "@/lib/api";
import { cn, formatearPrecio, optimizarImagenCloudinary } from "@/lib/utils";

interface Props {
  producto: ProductoConCategoria;
}

export function ProductCard({ producto }: Props) {
  const imagen = producto.images[0];
  const agotado = producto.status === "soldout" || producto.stock === 0;
  const descuento =
    producto.sale_price !== null
      ? Math.round((1 - producto.sale_price / producto.price) * 100)
      : null;

  return (
    <article className="group">
      <Link href={`/producto/${producto.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-carbon/5">
          {imagen ? (
            <Image
              src={optimizarImagenCloudinary(imagen.url, 800)}
              alt={imagen.alt || producto.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={cn(
                "object-cover transition-transform duration-500 group-hover:scale-105",
                agotado && "opacity-60",
              )}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-carbon/40">
              Sin imagen
            </div>
          )}

          <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
            {producto.status === "featured" && (
              <span className="bg-dorado px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-carbon">
                Destacado
              </span>
            )}
            {agotado && (
              <span className="bg-carbon px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-hueso">
                Agotado
              </span>
            )}
            {descuento !== null && !agotado && (
              <span className="bg-cuero px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-hueso">
                -{descuento}%
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-1">
          {producto.category && (
            <p className="text-[11px] uppercase tracking-[0.2em] text-oxblood">
              {producto.category.name}
            </p>
          )}
          <h3 className="font-display text-lg leading-snug">{producto.name}</h3>
          <div className="flex items-baseline gap-2">
            {producto.sale_price !== null ? (
              <>
                <span className="text-base font-semibold">
                  {formatearPrecio(producto.sale_price)}
                </span>
                <span className="text-sm text-pizarra/80 line-through">
                  {formatearPrecio(producto.price)}
                </span>
              </>
            ) : (
              <span className="text-base font-semibold">{formatearPrecio(producto.price)}</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
