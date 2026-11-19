import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const claseInput =
  "w-full border border-carbon/20 bg-white px-3 py-2.5 text-sm text-carbon outline-none transition-colors focus:border-cuero disabled:opacity-60";

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
      className="border border-red-700/30 bg-red-50 px-3 py-2 text-sm text-red-800"
    >
      {children}
    </p>
  );
}
