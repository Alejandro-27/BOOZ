"use client";

import { useState } from "react";
import type { ProductoConCategoria } from "@/lib/api";
import { URL_SITIO } from "@/lib/constantes";
import { cn, formatearPrecio } from "@/lib/utils";
import { ProductLightbox } from "./ProductLightbox";
import { WhatsAppButton } from "./WhatsAppButton";

interface Props {
  producto: ProductoConCategoria;
  whatsapp: string;
}

export function DetalleProducto({ producto, whatsapp }: Props) {
  const [talla, setTalla] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);

  const agotado = producto.status === "soldout" || producto.stock === 0;
  const descuento =
    producto.sale_price !== null
      ? Math.round((1 - producto.sale_price / producto.price) * 100)
      : null;

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <ProductLightbox imagenes={producto.images} nombre={producto.name} />

      <div className="lg:sticky lg:top-24 lg:self-start">
        {producto.category && (
          <p className="font-display text-sm text-oxblood">{producto.category.name}</p>
        )}
        <h1 className="titulo-display mt-3 font-display leading-[1.05] tracking-tight text-carbon">
          {producto.name}
        </h1>
        <span aria-hidden className="mt-5 block h-px w-6 bg-laton" />

        <div className="mt-4 flex flex-wrap items-baseline gap-3">
          {producto.sale_price !== null ? (
            <>
              <span className="text-2xl font-medium text-carbon">
                {formatearPrecio(producto.sale_price)}
              </span>
              <span className="text-base text-pizarra line-through">
                {formatearPrecio(producto.price)}
              </span>
              {descuento !== null && (
                <span className="bg-oxblood px-2 py-1 text-[0.625rem] font-semibold text-hueso">
                  -{descuento}%
                </span>
              )}
            </>
          ) : (
            <span className="text-2xl font-medium text-carbon">{formatearPrecio(producto.price)}</span>
          )}
        </div>

        <p className="mt-6 text-base leading-relaxed text-pizarra">
          {producto.short_description}
        </p>

        {producto.sizes.length > 0 && (
          <div className="mt-8">
            <p className="text-sm font-medium text-carbon">Talla</p>
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
            <p className="text-sm font-medium text-carbon">Color</p>
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
            precio={producto.sale_price ?? producto.price}
            talla={talla ?? undefined}
            color={color ?? undefined}
            urlBase={URL_SITIO}
            deshabilitado={agotado}
          />
          <p className="mt-3 text-xs text-pizarra">
            Te responderemos por WhatsApp para confirmar disponibilidad y envío.
          </p>
        </div>

        {producto.material && (
          <p className="mt-6 text-sm text-pizarra">
            <span className="font-semibold">Material:</span> {producto.material}
          </p>
        )}

        {producto.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {producto.tags.map((etiqueta) => (
              <span
                key={etiqueta}
                className="border border-carbon/15 px-2 py-1 text-xs text-pizarra"
              >
                {etiqueta}
              </span>
            ))}
          </div>
        )}

        {producto.long_description && (
          <div className="mt-8 border-t border-carbon/10 pt-6">
            <h2 className="font-display text-xl tracking-tight text-carbon">Detalles</h2>
            <p className="mt-2 text-base leading-relaxed text-pizarra">
              {producto.long_description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
