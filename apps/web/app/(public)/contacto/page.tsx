import type { Metadata } from "next";
import { AtSign, Mail, MapPin, MessageCircle } from "lucide-react";
import { obtenerConfiguracionSegura } from "@/lib/api";
import { formatearUbicacion } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Datos de contacto, ubicación y políticas de compra.",
};

export default async function ContactoPage() {
  const configuracion = await obtenerConfiguracionSegura();
  const numeroWhatsApp = configuracion?.whatsapp.replace(/\D/g, "") ?? "";

  return (
    <div className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
      <p className="font-display text-sm text-oxblood">Contacto</p>
      <h1 className="titulo-display mt-3 font-display leading-[1.05] tracking-tight text-carbon">
        Estamos para ayudarte
      </h1>
      <span aria-hidden className="mt-6 block h-px w-6 bg-laton" />
      <p className="mt-6 max-w-xl text-base leading-relaxed text-pizarra">
        Escríbenos para consultar disponibilidad, tallas o el estado de tu pedido.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {numeroWhatsApp && (
          <a
            href={`https://wa.me/${numeroWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 border border-carbon/10 p-5 transition-colors hover:border-cuero"
          >
            <MessageCircle className="mt-0.5 size-5 shrink-0 text-oxblood" strokeWidth={1.5} aria-hidden />
            <div>
              <p className="text-sm text-pizarra">WhatsApp</p>
              <p className="mt-1 text-base font-medium text-carbon">{configuracion?.whatsapp}</p>
            </div>
          </a>
        )}

        {configuracion?.email && (
          <a
            href={`mailto:${configuracion.email}`}
            className="flex items-start gap-3 border border-carbon/10 p-5 transition-colors hover:border-cuero"
          >
            <Mail className="mt-0.5 size-5 shrink-0 text-oxblood" strokeWidth={1.5} aria-hidden />
            <div>
              <p className="text-sm text-pizarra">Email</p>
              <p className="mt-1 text-base font-medium text-carbon">{configuracion.email}</p>
            </div>
          </a>
        )}

        {configuracion?.instagram && (
          <a
            href={`https://instagram.com/${configuracion.instagram.replace(/^@/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 border border-carbon/10 p-5 transition-colors hover:border-cuero"
          >
            <AtSign className="mt-0.5 size-5 shrink-0 text-oxblood" strokeWidth={1.5} aria-hidden />
            <div>
              <p className="text-sm text-pizarra">Instagram</p>
              <p className="mt-1 text-base font-medium text-carbon">{configuracion.instagram}</p>
            </div>
          </a>
        )}

        {(configuracion?.address || configuracion?.city) && (
          <div className="flex items-start gap-3 border border-carbon/10 p-5">
            <MapPin className="mt-0.5 size-5 shrink-0 text-oxblood" strokeWidth={1.5} aria-hidden />
            <div>
              <p className="text-sm text-pizarra">Ubicación</p>
              <p className="mt-1 text-base font-medium text-carbon">
                {formatearUbicacion(configuracion?.address, configuracion?.city)}
              </p>
            </div>
          </div>
        )}
      </div>

      <section className="mt-12 border-t border-carbon/10 pt-10">
        <h2 className="titulo-seccion font-display tracking-tight text-carbon">Políticas de compra</h2>
        <p className="prosa mt-4 whitespace-pre-line text-base leading-relaxed text-pizarra">
          {configuracion?.policies ??
            "Envíos a todo el país en 3 a 5 días hábiles. Cambios sin costo dentro de los primeros 30 días. Garantía de 90 días por defectos de fabricación."}
        </p>
      </section>
    </div>
  );
}
