"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAviso } from "@/components/Toasts";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createCategorySchema, type Category } from "@zapateria/shared";
import type { z } from "zod";
import { actualizarCategoria, crearCategoria } from "@/lib/api-admin";
import { generarSlug } from "@/lib/utils";
import { Alerta, Campo, claseInput } from "./Campo";

type EntradaCategoria = z.input<typeof createCategorySchema>;
type SalidaCategoria = z.output<typeof createCategorySchema>;

interface Props {
  categoria?: Category;
  onTerminado: () => void;
}

/** Formulario reutilizado para crear y editar categorías. */
export function CategoryForm({ categoria, onTerminado }: Props) {
  const queryClient = useQueryClient();
  const avisar = useAviso();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EntradaCategoria, unknown, SalidaCategoria>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: categoria?.name ?? "",
      slug: categoria?.slug ?? "",
      display_order: categoria?.display_order ?? 0,
      active: categoria?.active ?? true,
    },
  });

  const guardar = useMutation({
    mutationFn: (datos: SalidaCategoria) =>
      categoria ? actualizarCategoria(categoria.id, datos) : crearCategoria(datos),
    onSuccess: () => {
      avisar("exito", categoria ? "Categoría actualizada." : "Categoría creada.");
      void queryClient.invalidateQueries({ queryKey: ["categorias-admin"] });
      onTerminado();
    },
    onError: (fallo) => {
      const mensaje = fallo instanceof Error ? fallo.message : "No se pudo guardar la categoría.";
      setError(mensaje);
      avisar("error", mensaje);
    },
  });

  const errores = form.formState.errors;
  const nombre = form.watch("name") ?? "";

  return (
    <form
      onSubmit={form.handleSubmit(
        (datos) => {
          setError(null);
          guardar.mutate(datos);
        },
        () => avisar("aviso", "Escribe el nombre de la categoría."),
      )}
      className="space-y-4 border border-carbon/10 bg-white p-4"
      noValidate
    >
      {error && <Alerta>{error}</Alerta>}

      <Campo etiqueta="Nombre" htmlFor="categoria-nombre" error={errores.name?.message}>
        <input id="categoria-nombre" {...form.register("name")} className={claseInput} />
      </Campo>

      <Campo
        etiqueta="Slug"
        htmlFor="categoria-slug"
        error={errores.slug?.message}
        ayuda="Se usa en la URL del catálogo."
      >
        <div className="flex gap-2">
          <input id="categoria-slug" {...form.register("slug")} className={claseInput} />
          <button
            type="button"
            onClick={() =>
              form.setValue("slug", generarSlug(nombre), { shouldValidate: true })
            }
            className="shrink-0 border border-carbon/20 px-3 text-xs uppercase tracking-[0.15em] transition-colors hover:border-carbon"
          >
            Generar
          </button>
        </div>
      </Campo>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo
          etiqueta="Orden"
          htmlFor="categoria-orden"
          error={errores.display_order?.message}
        >
          <input
            id="categoria-orden"
            type="number"
            min={0}
            {...form.register("display_order", { valueAsNumber: true })}
            className={claseInput}
          />
        </Campo>

        <div className="flex items-end pb-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              {...form.register("active")}
              className="size-4 accent-cuero"
            />
            Categoría activa
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onTerminado}
          className="border border-carbon/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] transition-colors hover:border-carbon"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={guardar.isPending}
          className="bg-carbon px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-hueso transition-colors hover:bg-carbon-suave disabled:cursor-not-allowed disabled:opacity-60"
        >
          {guardar.isPending ? "Guardando…" : categoria ? "Guardar" : "Agregar"}
        </button>
      </div>
    </form>
  );
}
