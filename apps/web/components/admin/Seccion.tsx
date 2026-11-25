import type { ReactNode } from "react";

interface Props {
  titulo: string;
  icono?: ReactNode;
  children: ReactNode;
}

/** Bloque de formulario del panel: tarjeta con título y línea de latón. */
export function Seccion({ titulo, icono, children }: Props) {
  return (
    <section className="rounded-sm border border-stone-200 bg-tarjeta p-5 shadow-sm">
      <h2 className="mb-5 flex items-center gap-2 border-b border-laton-fuerte pb-2 font-display text-xl">
        {icono}
        {titulo}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
