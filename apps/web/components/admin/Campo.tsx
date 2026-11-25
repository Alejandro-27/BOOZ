import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const claseInput =
  "w-full rounded-sm border border-stone-300 bg-white px-3 py-2.5 text-sm text-carbon outline-none transition-all duration-200 focus:border-terracota focus:ring-2 focus:ring-terracota/15 disabled:opacity-60";

/** Píldora de estado para los listados del panel. */
export const claseBadge =
  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest";

/** Acción compacta de 44 px: icono con tooltip nativo. */
export const claseBotonIcono =
  "grid size-11 place-items-center rounded-sm border border-stone-300 bg-white transition-all duration-200 ease-out hover:scale-[1.05] active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-60";

interface Props {
  etiqueta: string;
  htmlFor?: string;
  error?: string;
  ayuda?: string;
  className?: string;
  children: ReactNode;
}

/** Campo de formulario con etiqueta, ayuda y error accesibles. */
export function Campo({ etiqueta, htmlFor, error, ayuda, className, children }: Props) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-xs font-medium uppercase tracking-[0.15em] text-carbon/70"
      >
        {etiqueta}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-red-700">
          {error}
        </p>
      ) : ayuda ? (
        <p className="text-xs text-carbon/50">{ayuda}</p>
      ) : null}
    </div>
  );
}

/** Aviso de error para respuestas de la API. */
export function Alerta({ children }: { children: ReactNode }) {
  return (
    <p
      role="alert"
      className="rounded-sm border border-red-700/30 bg-red-50 px-3 py-2 text-sm text-red-800"
    >
      {children}
    </p>
  );
}
