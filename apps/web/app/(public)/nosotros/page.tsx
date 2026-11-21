import type { Metadata } from "next";
import Link from "next/link";
import { obtenerConfiguracionSegura } from "@/lib/api";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce la historia y los valores de nuestra zapatería.",
};

export default async function NosotrosPage() {
  const configuracion = await obtenerConfiguracionSegura();
  const nombreTienda = configuracion?.name ?? "BOOZ";
  const ciudad = configuracion?.city ?? "Arauca, Colombia";

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:py-20">
      <p className="text-sm font-medium text-cuero">Nosotros</p>
      <h1 className="mt-3 font-display text-3xl leading-tight sm:text-5xl">
        {nombreTienda}, calzado con carácter desde {ciudad}
      </h1>

      <div className="mt-10 space-y-5 text-sm leading-relaxed text-carbon/75 sm:text-base">
        <p>
          {nombreTienda} nació con una idea sencilla: un hombre bien calzado camina distinto.
          Seleccionamos cada modelo pensando en la comodidad, la durabilidad y la presencia que
          un buen par de zapatos aporta.
        </p>
        <p>
          Desde {ciudad}, trabajamos con pieles de calidad y proveedores de
          confianza. Cada par pasa por una revisión antes de llegar a tus manos, porque los
          detalles son los que hacen la diferencia entre un zapato bonito y un zapato que quieres
          usar todos los días.
        </p>
        <p>
          {configuracion?.slogan ??
            "Creemos que la elegancia no está reñida con la comodidad: está en los detalles."}
        </p>
      </div>

      <div className="mt-12 grid gap-8 border-t border-carbon/10 pt-10 sm:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="font-display text-xl">Selección cuidada</p>
          <p className="mt-2 text-sm text-carbon/65">
            Pocos modelos, bien elegidos. Preferimos calidad sobre cantidad.
          </p>
        </div>
        <div>
          <p className="font-display text-xl">Atención cercana</p>
          <p className="mt-2 text-sm text-carbon/65">
            Te atendemos por WhatsApp para ayudarte con tallas y disponibilidad.
          </p>
        </div>
        <div>
          <p className="font-display text-xl">Compromiso</p>
          <p className="mt-2 text-sm text-carbon/65">
            Cambios sencillos y garantía en cada compra.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <Link
          href="/catalogo"
          className="inline-block bg-carbon px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-hueso transition-colors hover:bg-carbon-suave"
        >
          Ver el catálogo
        </Link>
      </div>
    </div>
  );
}
