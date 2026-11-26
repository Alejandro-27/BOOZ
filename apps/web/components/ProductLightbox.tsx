"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { useState } from "react";
import type { ProductoConCategoria } from "@/lib/api";

// El visor (librería + CSS) viaja en su propio chunk y solo se descarga al
// abrir la galería; no entra en el JS inicial de la ficha.
const CajaLightbox = dynamic(() => import("./ProductLightboxCaja"), { ssr: false });

interface Props {
  imagenes: ProductoConCategoria["images"];
  nombre: string;
}

export function ProductLightbox({ imagenes, nombre }: Props) {
  const [indice, setIndice] = useState<number | null>(null);
  const principal = imagenes[0];

  return (
    <div>
      <button
        type="button"
        onClick={() => setIndice(0)}
        aria-label={`Ampliar imagen de ${nombre}`}
        className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl bg-carbon/5"
      >
        {principal ? (
          <Image
            src={principal.url}
            alt={principal.alt || nombre}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-sm text-carbon/40">
            Sin imagen
          </span>
        )}

        {principal && (
          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-carbon/70 px-2.5 py-1.5 text-[0.6875rem] font-medium text-hueso">
            <Maximize2 className="size-3.5" strokeWidth={1.5} aria-hidden />
            Ampliar
          </span>
        )}
      </button>

      {imagenes.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
          {imagenes.slice(0, 4).map((imagen, posicion) => (
            <li key={`${imagen.url}-${posicion}`}>
              <button
                type="button"
                onClick={() => setIndice(posicion)}
                aria-label={`Abrir imagen ${posicion + 1} de ${nombre}`}
                className="relative block aspect-square w-full overflow-hidden rounded-xl border border-carbon/10 transition-colors hover:border-cuero"
              >
                <Image
                  src={imagen.url}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 25vw, 120px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {indice !== null && (
        <CajaLightbox
          imagenes={imagenes}
          nombre={nombre}
          indice={indice}
          alCerrar={() => setIndice(null)}
        />
      )}
    </div>
  );
}
