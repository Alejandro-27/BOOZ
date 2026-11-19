import Link from "next/link";

export default function NoEncontrado() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-cuero">Error 404</p>
      <h1 className="mt-3 font-display text-3xl sm:text-4xl">Esta página no existe</h1>
      <p className="mt-3 text-sm text-carbon/60">
        Puede que el enlace haya cambiado o que el producto ya no esté disponible.
      </p>
      <Link
        href="/catalogo"
        className="mt-8 bg-carbon px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-hueso transition-colors hover:bg-carbon-suave"
      >
        Volver al catálogo
      </Link>
    </div>
  );
}
