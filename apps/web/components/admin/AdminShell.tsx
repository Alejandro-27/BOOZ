"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  QrCode,
  Settings,
  Tags,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { crearClienteNavegador } from "@/lib/supabase/client";

const ENLACES = [
  { href: "/admin", etiqueta: "Dashboard", icono: LayoutDashboard },
  { href: "/admin/productos", etiqueta: "Productos", icono: Package },
  { href: "/admin/categorias", etiqueta: "Categorías", icono: Tags },
  { href: "/admin/qr", etiqueta: "Código QR", icono: QrCode },
  { href: "/admin/configuracion", etiqueta: "Configuración", icono: Settings },
];

interface Props {
  email: string;
  children: ReactNode;
}

interface PropsNavegacion {
  email: string;
  ruta: string;
  onNavegar: () => void;
  onCerrarSesion: () => void;
}

function Navegacion({ email, ruta, onNavegar, onCerrarSesion }: PropsNavegacion) {
  return (
    <>
      <div className="border-b border-carbon/10 pb-4">
        <p className="font-display text-lg leading-tight">Panel</p>
        <p className="mt-1 truncate text-xs text-carbon/50" title={email}>
          {email}
        </p>
      </div>

      <nav aria-label="Navegación del panel" className="mt-4 flex-1">
        <ul className="space-y-1">
          {ENLACES.map(({ href, etiqueta, icono: Icono }) => {
            const activo = href === "/admin" ? ruta === href : ruta.startsWith(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavegar}
                  aria-current={activo ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 border-l-4 px-3 py-2.5 text-sm transition-all duration-200",
                    activo
                      ? "border-terracota bg-stone-200/50 font-medium text-carbon"
                      : "border-transparent text-stone-600 hover:bg-stone-100 hover:text-carbon",
                  )}
                >
                  <Icono className="size-4 shrink-0" aria-hidden />
                  {etiqueta}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-6 space-y-1 border-t border-carbon/10 pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 border-l-4 border-transparent px-3 py-2.5 text-sm text-stone-600 transition-all duration-200 hover:bg-stone-100 hover:text-carbon"
        >
          <ExternalLink className="size-4 shrink-0" aria-hidden />
          Ver el sitio
        </Link>
        <button
          type="button"
          onClick={onCerrarSesion}
          className="flex w-full items-center gap-3 border-l-4 border-transparent px-3 py-2.5 text-left text-sm text-terracota transition-all duration-200 hover:bg-terracota/5"
        >
          <LogOut className="size-4 shrink-0" aria-hidden />
          Cerrar sesión
        </button>
      </div>
    </>
  );
}

/** Marco del panel: sidebar fijo en escritorio y drawer en móvil. */
export function AdminShell({ email, children }: Props) {
  const [abierto, setAbierto] = useState(false);
  const ruta = usePathname();
  const router = useRouter();

  const cerrarSesion = async () => {
    await crearClienteNavegador().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-dvh bg-hueso lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-carbon/10 bg-white p-4 lg:flex lg:flex-col">
        <Navegacion
          email={email}
          ruta={ruta}
          onNavegar={() => setAbierto(false)}
          onCerrarSesion={() => void cerrarSesion()}
        />
      </aside>

      <div className="lg:hidden">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-carbon/10 bg-white px-4 py-3">
          <p className="font-display text-lg">Panel</p>
          <button
            type="button"
            onClick={() => setAbierto(true)}
            aria-expanded={abierto}
            aria-controls="menu-admin"
            aria-label="Abrir menú del panel"
            className="rounded-full p-2 text-carbon hover:bg-carbon/5"
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </header>

        {abierto && (
          <div className="fixed inset-0 z-50">
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar menú del panel"
              className="entrada-fondo absolute inset-0 bg-carbon/50"
            />
            <aside
              id="menu-admin"
              className="entrada-drawer relative flex h-full w-72 max-w-[85%] flex-col overflow-y-auto bg-white p-4 shadow-xl"
            >
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setAbierto(false)}
                  aria-label="Cerrar menú del panel"
                  className="rounded-full p-2 hover:bg-carbon/5"
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>
              <Navegacion
                email={email}
                ruta={ruta}
                onNavegar={() => setAbierto(false)}
                onCerrarSesion={() => void cerrarSesion()}
              />
            </aside>
          </div>
        )}
      </div>

      <main className="min-w-0">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
