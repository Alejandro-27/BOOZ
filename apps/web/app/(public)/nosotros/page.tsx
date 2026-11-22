import type { Metadata } from "next";
import Link from "next/link";
import { obtenerConfiguracionSegura } from "@/lib/api";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "La historia y la forma de trabajar de BOOZ, calzado masculino de Arauca.",
};

export default async function NosotrosPage() {
  const configuracion = await obtenerConfiguracionSegura();
  const nombreTienda = configuracion?.name ?? "BOOZ";
  const ciudad = configuracion?.city ?? "Arauca, Colombia";

  return (
    <div className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
      <p className="font-display text-sm text-oxblood">Nosotros</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight text-carbon sm:text-5xl">
        {nombreTienda}, calzado con carácter desde {ciudad}
      </h1>
      <span aria-hidden className="mt-6 block h-px w-6 bg-laton" />

      <div className="mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-pizarra">
        <p>
          {nombreTienda} nació con una idea sencilla: un hombre bien calzado camina distinto.
          Elegimos cada modelo pensando en la comodidad, la durabilidad y la presencia que un
          buen par de zapatos aporta.
        </p>
        <p>
          Desde {ciudad} trabajamos con pieles de calidad y proveedores de confianza. Cada par
          pasa por una revisión antes de llegar a tus manos, porque los detalles son los que
          separan un zapato bonito de uno que quieres usar todos los días.
        </p>
        <p>
          {configuracion?.slogan ??
            "La elegancia no está reñida con la comodidad: está en los detalles."}
        </p>
      </div>

      {/* Tres ideas, jerarquía despareja: la primera ocupa más ancho */}
      <div className="mt-14 grid gap-x-10 gap-y-8 border-t border-carbon/10 pt-10 sm:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="font-display text-2xl text-carbon">Selección cuidada</p>
          <p className="mt-2 text-sm leading-relaxed text-pizarra">
            Pocos modelos, bien elegidos. Preferimos calidad sobre cantidad.
          </p>
        </div>
        <div>
          <p className="font-display text-2xl text-carbon">Atención cercana</p>
          <p className="mt-2 text-sm leading-relaxed text-pizarra">
            Te atendemos por WhatsApp para ayudarte con tallas y disponibilidad.
          </p>
        </div>
        <div>
          <p className="font-display text-2xl text-carbon">Compromiso</p>
          <p className="mt-2 text-sm leading-relaxed text-pizarra">
            Cambios sencillos y garantía en cada compra.
          </p>
        </div>
      </div>

      <div className="mt-14">
        <Link
          href="/catalogo"
          className="inline-block bg-oxblood px-7 py-3.5 text-sm font-medium text-hueso transition-colors hover:bg-oxblood-oscuro"
        >
          Ver el catálogo
        </Link>
      </div>
    </div>
  );
}
