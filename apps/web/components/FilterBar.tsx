"use client";

import { useState, type FormEvent } from "react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import type { Category } from "@zapateria/shared";
import { COLORES, TALLAS } from "@/lib/constantes";
import { cn } from "@/lib/utils";

interface Props {
  categorias: Category[];
}

export function FilterBar({ categorias }: Props) {
  const [filtros, setFiltros] = useQueryStates({
    categoria: parseAsString,
    talla: parseAsString,
    color: parseAsString,
    precio_min: parseAsInteger,
    precio_max: parseAsInteger,
  });

  const [abierto, setAbierto] = useState(false);
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

  const claseSelect =
    "w-full border border-carbon/15 bg-transparent px-3 py-2 text-sm focus:border-cuero focus:outline-none";

  return (
    <div>
      <button
        type="button"
        onClick={() => setAbierto((valor) => !valor)}
        className="w-full border border-carbon/15 px-4 py-3 text-sm lg:hidden"
        aria-expanded={abierto}
        aria-controls="panel-filtros"
      >
        {abierto ? "Ocultar filtros" : "Mostrar filtros"}
      </button>

      <div
        id="panel-filtros"
        className={cn("mt-4 space-y-8 lg:mt-0", abierto ? "block" : "hidden lg:block")}
      >
        <div>
          <label htmlFor="filtro-categoria" className="text-sm font-medium text-carbon">
            Categoría
          </label>
          <select
            id="filtro-categoria"
            className={cn(claseSelect, "mt-2")}
            value={filtros.categoria ?? ""}
            onChange={(evento) =>
              void setFiltros({ categoria: evento.target.value || null })
            }
          >
            <option value="">Todas</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.slug}>
                {categoria.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filtro-talla" className="text-sm font-medium text-carbon">
            Talla
          </label>
          <select
            id="filtro-talla"
            className={cn(claseSelect, "mt-2")}
            value={filtros.talla ?? ""}
            onChange={(evento) => void setFiltros({ talla: evento.target.value || null })}
          >
            <option value="">Todas</option>
            {TALLAS.map((talla) => (
              <option key={talla} value={talla}>
                {talla}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filtro-color" className="text-sm font-medium text-carbon">
            Color
          </label>
          <select
            id="filtro-color"
            className={cn(claseSelect, "mt-2")}
            value={filtros.color ?? ""}
            onChange={(evento) => void setFiltros({ color: evento.target.value || null })}
          >
            <option value="">Todos</option>
            {COLORES.map((color) => (
              <option key={color.nombre} value={color.nombre}>
                {color.nombre}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={aplicarPrecio}>
          <p className="text-sm font-medium text-carbon">Precio (COP)</p>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Mín"
              aria-label="Precio mínimo"
              value={precioMin}
              onChange={(evento) => setPrecioMin(evento.target.value)}
              className={claseSelect}
            />
            <span className="text-carbon/40">–</span>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Máx"
              aria-label="Precio máximo"
              value={precioMax}
              onChange={(evento) => setPrecioMax(evento.target.value)}
              className={claseSelect}
            />
          </div>
          <button
            type="submit"
            className="mt-3 w-full border border-carbon px-4 py-2.5 text-sm transition-colors hover:bg-carbon hover:text-hueso"
          >
            Aplicar precio
          </button>
        </form>

        <button
          type="button"
          onClick={limpiar}
          disabled={!hayFiltros}
          className="w-full text-sm text-oxblood underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-carbon/30 disabled:no-underline"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}
