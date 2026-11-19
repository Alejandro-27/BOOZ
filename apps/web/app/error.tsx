"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-cuero">Algo salió mal</p>
      <h1 className="mt-3 font-display text-3xl sm:text-4xl">No pudimos cargar esta página</h1>
      <p className="mt-3 text-sm text-carbon/60">
        Revisa tu conexión e intenta de nuevo en unos segundos.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 bg-carbon px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-hueso transition-colors hover:bg-carbon-suave"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
