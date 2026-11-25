/** Rejilla de carga del catálogo: reserva el alto del grid real. */
export function SkeletonGrid() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Cargando productos…</span>
      <div aria-hidden className="mb-5 h-4 w-24 animate-pulse rounded-full bg-stone-200" />
      <div
        aria-hidden
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6"
      >
        {Array.from({ length: 8 }).map((_, indice) => (
          <div
            key={indice}
            className="animate-pulse overflow-hidden rounded-sm border border-stone-200 bg-tarjeta"
          >
            <div className="aspect-[4/5] bg-stone-200" />
            <div className="space-y-2 p-4">
              <div className="h-2.5 w-16 rounded-full bg-stone-200" />
              <div className="h-3 w-full rounded-full bg-stone-200" />
              <div className="h-3 w-2/3 rounded-full bg-stone-200" />
              <div className="h-4 w-20 rounded-full bg-stone-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
