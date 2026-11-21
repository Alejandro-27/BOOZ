"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductoConCategoria } from "@/lib/api";
import { URL_SITIO } from "@/lib/constantes";
import { cn, formatearPrecio, optimizarImagenCloudinary } from "@/lib/utils";
import { WhatsAppButton } from "./WhatsAppButton";

interface Props {
  producto: ProductoConCategoria;
  whatsapp: string;
}

export function DetalleProducto({ producto, whatsapp }: Props) {
  const [indiceImagen, setIndiceImagen] = useState(0);
  const [talla, setTalla] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);

  const imagenActiva = producto.images[indiceImagen];
  const agotado = producto.status === "soldout" || producto.stock === 0;
  const descuento =
    producto.sale_price !== null
      ? Math.round((1 - producto.sale_price / producto.price) * 100)
      : null;

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div>
        <div className="relative aspect-[4/5] overflow-hidden bg-carbon/5">
          {imagenActiva ? (
            <Image
              src={optimizarImagenCloudinary(imagenActiva.url, 1200)}
              alt={imagenActiva.alt || producto.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-carbon/40">
              Sin imagen
            </div>
          )}
        </div>

        {producto.images.length > 1 && (
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
            {producto.images.map((imagen, posicion) => (
              <button
                key={`${imagen.url}-${posicion}`}
                type="button"
                onClick={() => setIndiceImagen(posicion)}
                aria-label={`Ver imagen ${posicion + 1}`}
                aria-current={posicion === indiceImagen}
                className={cn(
                  "relative aspect-square w-20 shrink-0 overflow-hidden border",
                  posicion === indiceImagen
                    ? "border-carbon"
                    : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <Image
                  src={optimizarImagenCloudinary(imagen.url, 200)}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        {producto.category && (
          <p className="text-xs uppercase tracking-[0.25em] text-oxblood">
            {producto.category.name}
          </p>
        )}
        <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">{producto.name}</h1>

        <div className="mt-4 flex flex-wrap items-baseline gap-3">
          {producto.sale_price !== null ? (
            <>
              <span className="text-2xl font-semibold">
                {formatearPrecio(producto.sale_price)}
              </span>
              <span className="text-base text-pizarra/80 line-through">
                {formatearPrecio(producto.price)}
              </span>
              {descuento !== null && (
                <span className="bg-cuero px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-hueso">
                  -{descuento}%
                </span>
              )}
            </>
          ) : (
            <span className="text-2xl font-semibold">{formatearPrecio(producto.price)}</span>
          )}
        </div>

        <p className="mt-6 text-sm leading-relaxed text-carbon/75">
          {producto.short_description}
        </p>

        {producto.sizes.length > 0 && (
          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.2em] text-oxblood">Talla</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {producto.sizes.map((tallaDisponible) => (
                <button
                  key={tallaDisponible}
                  type="button"
                  onClick={() =>
                    setTalla(talla === tallaDisponible ? null : tallaDisponible)
                  }
                  aria-pressed={talla === tallaDisponible}
                  className={cn(
                    "min-w-11 border px-3 py-2 text-sm transition-colors",
                    talla === tallaDisponible
                      ? "border-carbon bg-carbon text-hueso"
                      : "border-carbon/20 hover:border-carbon",
                  )}
                >
                  {tallaDisponible}
                </button>
              ))}
            </div>
          </div>
        )}

        {producto.colors.length > 0 && (
          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.2em] text-oxblood">Color</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {producto.colors.map((colorDisponible) => (
                <button
                  key={colorDisponible.name}
                  type="button"
                  onClick={() =>
                    setColor(color === colorDisponible.name ? null : colorDisponible.name)
                  }
                  aria-pressed={color === colorDisponible.name}
                  className={cn(
                    "flex items-center gap-2 border px-3 py-2 text-sm transition-colors",
                    color === colorDisponible.name
                      ? "border-carbon bg-carbon/5"
                      : "border-carbon/20 hover:border-carbon",
                  )}
                >
                  <span
                    className="size-4 rounded-full border border-carbon/20"
                    style={{ backgroundColor: colorDisponible.hex }}
                    aria-hidden
                  />
                  {colorDisponible.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <WhatsAppButton
            numero={whatsapp}
            producto={producto.name}
            slug={producto.slug}
            talla={talla ?? undefined}
            color={color ?? undefined}
            urlBase={URL_SITIO}
            deshabilitado={agotado}
          />
          <p className="mt-3 text-xs text-pizarra/80">
            Te responderemos por WhatsApp para confirmar disponibilidad y envío.
          </p>
        </div>

        {producto.material && (
          <p className="mt-6 text-sm text-pizarra/80">
            <span className="font-semibold">Material:</span> {producto.material}
          </p>
        )}

        {producto.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {producto.tags.map((etiqueta) => (
              <span
                key={etiqueta}
                className="border border-carbon/15 px-2 py-1 text-[11px] uppercase tracking-widest text-carbon/60"
              >
                {etiqueta}
              </span>
            ))}
          </div>
        )}

        {producto.long_description && (
          <div className="mt-8 border-t border-carbon/10 pt-6">
            <h2 className="font-display text-lg">Detalles</h2>
            <p className="mt-2 text-sm leading-relaxed text-carbon/75">
              {producto.long_description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
