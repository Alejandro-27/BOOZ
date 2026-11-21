import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { obtenerConfiguracionSegura } from "@/lib/api";

export default async function LayoutPublico({ children }: { children: ReactNode }) {
  const configuracion = await obtenerConfiguracionSegura();

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar
        nombreTienda={configuracion?.name ?? "BOOZ"}
        whatsapp={configuracion?.whatsapp ?? null}
      />
      <main className="flex-1">{children}</main>
      <Footer configuracion={configuracion} />
    </div>
  );
}
