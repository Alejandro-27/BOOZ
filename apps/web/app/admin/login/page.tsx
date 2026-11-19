import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Acceso al panel",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-carbon px-4 py-12">
      <div className="w-full max-w-sm bg-hueso p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-cuero">Panel</p>
        <h1 className="mt-2 font-display text-2xl">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-carbon/60">
          Acceso exclusivo para administradores de la tienda.
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>

        <Link
          href="/"
          className="mt-6 block text-center text-xs uppercase tracking-[0.2em] text-carbon/50 transition-colors hover:text-cuero"
        >
          Volver al sitio
        </Link>
      </div>
    </div>
  );
}
