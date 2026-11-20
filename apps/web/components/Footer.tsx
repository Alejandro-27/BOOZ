import Image from "next/image";
import Link from "next/link";
import { AtSign, Mail, MapPin, MessageCircle } from "lucide-react";
import type { StoreConfig } from "@zapateria/shared";

interface Props {
  configuracion: StoreConfig | null;
}

export function Footer({ configuracion }: Props) {
  const anio = new Date().getFullYear();
  const numeroWhatsApp = configuracion?.whatsapp.replace(/\D/g, "") ?? "";
  const nombreTienda = configuracion?.name ?? "BOOZ";

  return (
    <footer className="mt-20 bg-carbon text-hueso">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2">
            <Image src="/logo.jpeg" alt="BOOZ" width={32} height={32} className="rounded" />
            <p className="font-display text-2xl">{nombreTienda}</p>
          </div>
          <p className="mt-2 max-w-sm text-sm text-hueso/70">
            {configuracion?.slogan ??
              "Calzado masculino de vestir, hecho con carácter."}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-dorado">Navegación</p>
          <ul className="mt-4 space-y-2 text-sm text-hueso/80">
            <li>
              <Link href="/catalogo" className="transition-colors hover:text-dorado">
                Catálogo
              </Link>
            </li>
            <li>
              <Link href="/nosotros" className="transition-colors hover:text-dorado">
                Nosotros
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="transition-colors hover:text-dorado">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-dorado">Contacto</p>
          <ul className="mt-4 space-y-3 text-sm text-hueso/80">
            {numeroWhatsApp && (
              <li>
                <a
                  href={`https://wa.me/${numeroWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-dorado"
                >
                  <MessageCircle className="size-4" aria-hidden /> WhatsApp
                </a>
              </li>
            )}
            {configuracion?.email && (
              <li>
                <a
                  href={`mailto:${configuracion.email}`}
                  className="flex items-center gap-2 transition-colors hover:text-dorado"
                >
                  <Mail className="size-4" aria-hidden /> {configuracion.email}
                </a>
              </li>
            )}
            {configuracion?.instagram && (
              <li>
                <a
                  href={`https://instagram.com/${configuracion.instagram.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-dorado"
                >
                  <AtSign className="size-4" aria-hidden /> {configuracion.instagram}
                </a>
              </li>
            )}
            {(configuracion?.address || configuracion?.city) && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>
                  {[configuracion?.address, configuracion?.city].filter(Boolean).join(", ")}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-hueso/10">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-hueso/50">
          © {anio} {nombreTienda}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
