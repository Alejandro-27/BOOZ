import type { Metadata } from "next";
import { AtSign, Mail, MapPin, MessageCircle } from "lucide-react";
import { obtenerConfiguracionSegura } from "@/lib/api";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Datos de contacto, ubicación y políticas de compra.",
};

export default async function ContactoPage() {
  const configuracion = await obtenerConfiguracionSegura();
  const numeroWhatsApp = configuracion?.whatsapp.replace(/\D/g, "") ?? "";

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:py-20">
      <p className="text-sm font-medium text-cuero">Contacto</p>
      <h1 className="mt-3 font-display text-3xl leading-tight sm:text-5xl">
        Estamos para ayudarte
      </h1>
      <p className="mt-4 max-w-xl text-sm text-carbon/65 sm:text-base">
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
            <MessageCircle className="mt-0.5 size-5 shrink-0 text-cuero" aria-hidden />
            <div>
              <p className="text-xs font-medium text-carbon/50">WhatsApp</p>
              <p className="mt-1 text-sm font-medium">{configuracion?.whatsapp}</p>
            </div>
          </a>
        )}

        {configuracion?.email && (
          <a
            href={`mailto:${configuracion.email}`}
            className="flex items-start gap-3 border border-carbon/10 p-5 transition-colors hover:border-cuero"
          >
            <Mail className="mt-0.5 size-5 shrink-0 text-cuero" aria-hidden />
            <div>
              <p className="text-xs font-medium text-carbon/50">Email</p>
              <p className="mt-1 text-sm font-medium">{configuracion.email}</p>
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
            <AtSign className="mt-0.5 size-5 shrink-0 text-cuero" aria-hidden />
            <div>
              <p className="text-xs font-medium text-carbon/50">Instagram</p>
              <p className="mt-1 text-sm font-medium">{configuracion.instagram}</p>
            </div>
          </a>
        )}

        {(configuracion?.address || configuracion?.city) && (
          <div className="flex items-start gap-3 border border-carbon/10 p-5">
            <MapPin className="mt-0.5 size-5 shrink-0 text-cuero" aria-hidden />
            <div>
              <p className="text-xs font-medium text-carbon/50">Ubicación</p>
              <p className="mt-1 text-sm font-medium">
                {[configuracion?.address, configuracion?.city].filter(Boolean).join(", ")}
              </p>
            </div>
          </div>
        )}
      </div>

      <section className="mt-12 border-t border-carbon/10 pt-10">
        <h2 className="font-display text-2xl">Políticas de compra</h2>
        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-carbon/70">
          {configuracion?.policies ??
            "Envíos a todo el país en 3 a 5 días hábiles. Cambios sin costo dentro de los primeros 30 días. Garantía de 90 días por defectos de fabricación."}
        </p>
      </section>
    </div>
  );
}
