"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { X } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import type { Category } from "@zapateria/shared";
import { COLORES, TALLAS } from "@/lib/constantes";
import { cn } from "@/lib/utils";

interface Props {
  categorias: Category[];
}

const clasePildora =
  "shrink-0 snap-start rounded-full border px-4 py-2 text-sm transition-all duration-200 ease-out active:scale-[0.97]";

interface PropsPildora {
  activa: boolean;
  onClick: () => void;
  children: ReactNode;
}

function Pildora({ activa, onClick, children }: PropsPildora) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activa}
      className={cn(
        clasePildora,
        activa
          ? "border-terracota bg-terracota text-hueso shadow-sm"
          : "border-stone-300 text-carbon hover:border-carbon hover:bg-stone-100",
      )}
    >
      {children}
    </button>
  );
}

interface PropsFila {
  etiqueta: string;
  id: string;
  scrollable?: boolean;
  children: ReactNode;
}

function Fila({ etiqueta, id, scrollable = true, children }: PropsFila) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
      <p
        id={id}
        className="shrink-0 text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500 sm:w-24"
      >
        {etiqueta}
      </p>
      <div
        role="group"
        aria-labelledby={id}
        className={cn(
          "flex gap-2",
          scrollable
            ? "snap-x overflow-x-auto px-0.5 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "flex-wrap items-center",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function FilterBar({ categorias }: Props) {
  // shallow: false hace que nuqs navegue por el App Router y el server
  // component vuelva a leer searchParams; con shallow solo cambia la URL.
  const [filtros, setFiltros] = useQueryStates(
    {
      categoria: parseAsString,
      talla: parseAsString,
      color: parseAsString,
      precio_min: parseAsInteger,
      precio_max: parseAsInteger,
    },
    { shallow: false, scroll: false },
  );

  const [precioMin, setPrecioMin] = useState(filtros.precio_min?.toString() ?? "");
  const [precioMax, setPrecioMax] = useState(filtros.precio_max?.toString() ?? "");

  const hayFiltros = Object.values(filtros).some((valor) => valor !== null);

  const limpiar = () => {
    void setFiltros(null);
    setPrecioMin("");
    setPrecioMax("");
  };

  const aplicarPrecio = (evento: FormEvent) => {
    evento.preventDefault();
    void setFiltros({
      precio_min: precioMin ? Number(precioMin) : null,
      precio_max: precioMax ? Number(precioMax) : null,
    });
  };

  const clasePrecio =
    "w-24 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm outline-none transition-all duration-200 focus:border-terracota focus:ring-2 focus:ring-terracota/15";

  return (
    <div className="space-y-2 rounded-sm border border-stone-200 bg-tarjeta p-4 shadow-sm sm:space-y-3 sm:p-5">
      <Fila etiqueta="Categoría" id="filtro-categoria-label">
        <Pildora activa={!filtros.categoria} onClick={() => void setFiltros({ categoria: null })}>
          Todas
        </Pildora>
        {categorias.map((categoria) => (
          <Pildora
            key={categoria.id}
            activa={filtros.categoria === categoria.slug}
            onClick={() => void setFiltros({ categoria: categoria.slug })}
          >
            {categoria.name}
          </Pildora>
        ))}
      </Fila>

      <Fila etiqueta="Talla" id="filtro-talla-label">
        <Pildora activa={!filtros.talla} onClick={() => void setFiltros({ talla: null })}>
          Todas
        </Pildora>
        {TALLAS.map((talla) => (
          <Pildora
            key={talla}
            activa={filtros.talla === talla}
            onClick={() => void setFiltros({ talla })}
          >
            {talla}
          </Pildora>
        ))}
      </Fila>

      <Fila etiqueta="Color" id="filtro-color-label">
        <Pildora activa={!filtros.color} onClick={() => void setFiltros({ color: null })}>
          Todos
        </Pildora>
        {COLORES.map((color) => (
          <Pildora
            key={color.nombre}
            activa={filtros.color === color.nombre}
            onClick={() => void setFiltros({ color: color.nombre })}
          >
            <span className="flex items-center gap-2">
              <span
                className="size-3 rounded-full border border-carbon/20"
                style={{ backgroundColor: color.hex }}
                aria-hidden
              />
              {color.nombre}
            </span>
          </Pildora>
        ))}
      </Fila>

      <Fila etiqueta="Precio" id="filtro-precio-label" scrollable={false}>
        <form onSubmit={aplicarPrecio} className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Mín"
            aria-label="Precio mínimo"
            value={precioMin}
            onChange={(evento) => setPrecioMin(evento.target.value)}
            className={clasePrecio}
          />
          <span aria-hidden className="text-stone-400">
            –
          </span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Máx"
            aria-label="Precio máximo"
            value={precioMax}
            onChange={(evento) => setPrecioMax(evento.target.value)}
            className={clasePrecio}
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-carbon px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-hueso transition-all duration-200 hover:bg-carbon-suave active:scale-[0.97]"
          >
            Aplicar
          </button>
        </form>

        {hayFiltros && (
          <button
            type="button"
            onClick={limpiar}
            className="inline-flex items-center gap-1 rounded-full border border-stone-300 px-4 py-2 text-sm text-terracota transition-colors hover:border-terracota hover:bg-terracota/5"
          >
            <X className="size-3.5" aria-hidden />
            Limpiar
          </button>
        )}
      </Fila>
    </div>
  );
}
