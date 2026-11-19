"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Category } from "@zapateria/shared";
import {
  actualizarCategoria,
  eliminarCategoria,
  listarCategoriasAdmin,
} from "@/lib/api-admin";
import { Alerta } from "@/components/admin/Campo";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default function CategoriasPage() {
  const queryClient = useQueryClient();
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
      void queryClient.invalidateQueries({ queryKey: ["categorias-admin"] });
    },
    onError: (fallo) => {
      setError(fallo instanceof Error ? fallo.message : "No se pudo actualizar la categoría.");
    },
  });

  const eliminar = useMutation({
    mutationFn: eliminarCategoria,
    onSuccess: () => {
      setConfirmando(null);
      void queryClient.invalidateQueries({ queryKey: ["categorias-admin"] });
    },
    onError: (fallo) => {
      setError(fallo instanceof Error ? fallo.message : "No se pudo eliminar la categoría.");
    },
  });

  const cerrarFormulario = () => {
    setCreando(false);
    setEditando(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cuero">Catálogo</p>
          <h1 className="mt-2 font-display text-3xl">Categorías</h1>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditando(null);
            setCreando(true);
          }}
          className="flex items-center gap-2 bg-carbon px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-hueso transition-colors hover:bg-carbon-suave"
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
        <section className="space-y-3">
          <h2 className="font-display text-xl">
            {editando ? "Editar categoría" : "Nueva categoría"}
          </h2>
          <CategoryForm
            categoria={editando ?? undefined}
            onTerminado={cerrarFormulario}
          />
        </section>
      )}

      {isLoading ? (
        <p className="text-sm text-carbon/60">Cargando categorías…</p>
      ) : categorias.length === 0 ? (
        <div className="border border-carbon/10 bg-white px-6 py-14 text-center">
          <p className="font-display text-xl">Todavía no hay categorías</p>
          <p className="mt-2 text-sm text-carbon/60">
            Crea la primera para poder asignar productos.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-carbon/10 border border-carbon/10 bg-white">
          {categorias.map((categoria) => (
            <li
              key={categoria.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{categoria.name}</p>
                  {!categoria.active && (
                    <span className="bg-carbon/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-carbon/60">
                      Inactiva
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-carbon/50">
                  /{categoria.slug} · orden {categoria.display_order}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCreando(false);
                    setEditando(categoria);
                  }}
                  className="flex items-center gap-1.5 border border-carbon/20 px-3 py-2 text-xs uppercase tracking-[0.1em] transition-colors hover:border-carbon"
                >
                  <Pencil className="size-3.5" aria-hidden />
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => alternar.mutate(categoria)}
                  disabled={alternar.isPending}
                  className="border border-carbon/20 px-3 py-2 text-xs uppercase tracking-[0.1em] transition-colors hover:border-carbon disabled:opacity-60"
                >
                  {categoria.active ? "Desactivar" : "Activar"}
                </button>

                {confirmando === categoria.id ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => eliminar.mutate(categoria.id)}
                      disabled={eliminar.isPending}
                      className="bg-red-700 px-3 py-2 text-xs uppercase tracking-[0.1em] text-white disabled:opacity-60"
                    >
                      {eliminar.isPending ? "Eliminando…" : "Confirmar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmando(null)}
                      className="border border-carbon/20 px-3 py-2 text-xs uppercase tracking-[0.1em]"
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
                    className="flex items-center gap-1.5 border border-carbon/20 px-3 py-2 text-xs uppercase tracking-[0.1em] text-cuero transition-colors hover:border-cuero"
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                    Eliminar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
