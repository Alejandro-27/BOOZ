"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Eye, EyeOff, Loader2, Pencil, Plus, Tags, Trash2 } from "lucide-react";
import type { Category } from "@zapateria/shared";
import {
  actualizarCategoria,
  eliminarCategoria,
  listarCategoriasAdmin,
} from "@/lib/api-admin";
import { Alerta, claseBadge, claseBotonIcono } from "@/components/admin/Campo";
import { useAviso } from "@/components/Toasts";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default function CategoriasPage() {
  const queryClient = useQueryClient();
  const avisar = useAviso();
  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState<Category | null>(null);
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    data: categorias = [],
    isLoading,
    error: errorConsulta,
  } = useQuery({
    queryKey: ["categorias-admin"],
    queryFn: listarCategoriasAdmin,
  });

  const alternar = useMutation({
    mutationFn: (categoria: Category) =>
      actualizarCategoria(categoria.id, { active: !categoria.active }),
    onSuccess: () => {
      setError(null);
      avisar("exito", "Categoría actualizada.");
      void queryClient.invalidateQueries({ queryKey: ["categorias-admin"] });
    },
    onError: (fallo) => {
      const mensaje = fallo instanceof Error ? fallo.message : "No se pudo actualizar la categoría.";
      setError(mensaje);
      avisar("error", mensaje);
    },
  });

  const eliminar = useMutation({
    mutationFn: eliminarCategoria,
    onSuccess: () => {
      setConfirmando(null);
      avisar("exito", "Categoría eliminada.");
      void queryClient.invalidateQueries({ queryKey: ["categorias-admin"] });
    },
    onError: (fallo) => {
      const mensaje = fallo instanceof Error ? fallo.message : "No se pudo eliminar la categoría.";
      setError(mensaje);
      avisar("error", mensaje);
    },
  });

  const cerrarFormulario = () => {
    setCreando(false);
    setEditando(null);
  };

  return (
    <div className="space-y-6">
      <header className="entrada-admin flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-terracota">
            <span className="h-px w-6 bg-laton-fuerte" aria-hidden />
            Catálogo
          </p>
          <h1 className="mt-2 font-display text-3xl">Categorías</h1>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditando(null);
            setCreando(true);
          }}
          className="inline-flex items-center gap-2 rounded-sm bg-carbon px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-hueso transition-all duration-300 ease-out hover:scale-[1.01] hover:bg-carbon-suave active:scale-[0.98]"
        >
          <Plus className="size-4" aria-hidden />
          Nueva categoría
        </button>
      </header>

      {error && <Alerta>{error}</Alerta>}
      {errorConsulta && (
        <Alerta>No pudimos cargar las categorías. Revisa que la API esté disponible.</Alerta>
      )}

      {(creando || editando) && (
        <section className="entrada-admin space-y-3">
          <h2 className="border-b border-laton-fuerte pb-2 font-display text-xl">
            {editando ? "Editar categoría" : "Nueva categoría"}
          </h2>
          <CategoryForm
            categoria={editando ?? undefined}
            onTerminado={cerrarFormulario}
          />
        </section>
      )}

      {isLoading ? (
        <>
          <p role="status" className="sr-only">
            Cargando categorías…
          </p>
          <ul
            aria-hidden
            className="divide-y divide-stone-200 overflow-hidden rounded-sm border border-stone-200 bg-tarjeta shadow-sm"
          >
            {Array.from({ length: 4 }).map((_, indice) => (
              <li
                key={indice}
                className="flex animate-pulse items-center justify-between gap-4 p-4"
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-3 w-36 max-w-full rounded-full bg-stone-200" />
                  <div className="h-2.5 w-24 max-w-full rounded-full bg-stone-200" />
                </div>
                <div className="h-11 w-32 shrink-0 rounded-sm bg-stone-200" />
              </li>
            ))}
          </ul>
        </>
      ) : categorias.length === 0 ? (
        <div className="rounded-sm border border-stone-200 bg-tarjeta px-6 py-14 text-center shadow-sm">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-terracota/10 text-terracota">
            <Tags className="size-6" aria-hidden />
          </span>
          <p className="mt-4 font-display text-xl">Todavía no hay categorías</p>
          <p className="mt-2 text-sm text-stone-500">
            Crea la primera para poder asignar productos.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-stone-200 overflow-hidden rounded-sm border border-stone-200 bg-tarjeta shadow-sm">
          {categorias.map((categoria, indice) => {
            const cambiando = alternar.isPending && alternar.variables?.id === categoria.id;

            return (
              <li
                key={categoria.id}
                className="entrada-admin flex flex-col gap-3 p-4 transition-colors duration-200 hover:bg-stone-100 sm:flex-row sm:items-center sm:justify-between"
                style={{ animationDelay: `${Math.min(indice, 5) * 75}ms` }}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{categoria.name}</p>
                    {!categoria.active && (
                      <span className={`${claseBadge} bg-stone-200 text-stone-600`}>Inactiva</span>
                    )}
                  </div>
                  <p className="truncate text-xs text-stone-500">
                    /{categoria.slug} · orden {categoria.display_order}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setCreando(false);
                      setEditando(categoria);
                    }}
                    aria-label={`Editar ${categoria.name}`}
                    title="Editar"
                    className={`${claseBotonIcono} text-stone-600 hover:border-carbon hover:text-carbon`}
                  >
                    <Pencil className="size-4" aria-hidden />
                  </button>

                  <button
                    type="button"
                    onClick={() => alternar.mutate(categoria)}
                    disabled={alternar.isPending}
                    aria-label={
                      categoria.active
                        ? `Desactivar ${categoria.name}`
                        : `Activar ${categoria.name}`
                    }
                    title={categoria.active ? "Desactivar" : "Activar"}
                    className={`${claseBotonIcono} text-stone-600 hover:border-carbon hover:text-carbon`}
                  >
                    {cambiando ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                    ) : categoria.active ? (
                      <EyeOff className="size-4" aria-hidden />
                    ) : (
                      <Eye className="size-4" aria-hidden />
                    )}
                  </button>

                  {confirmando === categoria.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => eliminar.mutate(categoria.id)}
                        disabled={eliminar.isPending}
                        className="inline-flex h-11 items-center gap-1.5 rounded-sm bg-red-700 px-3 text-[11px] font-semibold uppercase tracking-wider text-white transition-all duration-200 hover:bg-red-800 disabled:opacity-60"
                      >
                        {eliminar.isPending && (
                          <Loader2 className="size-3.5 animate-spin" aria-hidden />
                        )}
                        {eliminar.isPending ? "Eliminando…" : "Confirmar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmando(null)}
                        className="h-11 rounded-sm border border-stone-300 px-3 text-[11px] font-semibold uppercase tracking-wider transition-colors hover:border-carbon"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setConfirmando(categoria.id);
                      }}
                      aria-label={`Eliminar ${categoria.name}`}
                      title="Eliminar"
                      className={`${claseBotonIcono} text-terracota hover:border-terracota hover:bg-terracota/5`}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
