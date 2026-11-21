"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ENLACES = [
  { href: "/", etiqueta: "Inicio" },
  { href: "/catalogo", etiqueta: "Catálogo" },
  { href: "/nosotros", etiqueta: "Nosotros" },
  { href: "/contacto", etiqueta: "Contacto" },
];

interface Props {
  nombreTienda: string;
  whatsapp: string | null;
}

export function Navbar({ nombreTienda, whatsapp }: Props) {
  const [abierto, setAbierto] = useState(false);
  const ruta = usePathname();

  const numeroWhatsApp = whatsapp?.replace(/\D/g, "") ?? "";
  const enlaceWhatsApp = numeroWhatsApp ? `https://wa.me/${numeroWhatsApp}` : null;

  return (
    <header className="sticky top-0 z-50 border-b border-carbon/10 bg-hueso/90 backdrop-blur">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4"
        aria-label="Navegación principal"
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-display tracking-wide"
          onClick={() => setAbierto(false)}
        >
          <Image
            src="/logo.jpeg"
            alt="BOOZ"
            width={32}
            height={32}
            className="rounded"
          />
          <span className="text-xl font-display">{nombreTienda}</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {ENLACES.map((enlace) => (
            <li key={enlace.href}>
              <Link
                href={enlace.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-cuero",
                  ruta === enlace.href ? "text-cuero" : "text-carbon/70",
                )}
              >
                {enlace.etiqueta}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {enlaceWhatsApp && (
            <a
              href={enlaceWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Escríbenos por WhatsApp"
              className="rounded-full p-2 text-carbon transition-colors hover:bg-carbon/5 hover:text-cuero"
            >
              <MessageCircle className="size-5" aria-hidden />
            </a>
          )}

          <button
            type="button"
            className="rounded-full p-2 md:hidden"
            onClick={() => setAbierto((valor) => !valor)}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          >
            {abierto ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </nav>

      {abierto && (
        <div id="menu-movil" className="border-t border-carbon/10 md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {ENLACES.map((enlace) => (
              <li key={enlace.href}>
                <Link
                  href={enlace.href}
                  onClick={() => setAbierto(false)}
                  className={cn(
                    "block py-3 text-sm font-medium",
                    ruta === enlace.href ? "text-cuero" : "text-carbon/80",
                  )}
                >
                  {enlace.etiqueta}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
