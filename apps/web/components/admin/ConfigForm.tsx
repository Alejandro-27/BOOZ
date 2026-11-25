"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAviso } from "@/components/Toasts";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Contact, FileText, Loader2, Store } from "lucide-react";
import { actualizarConfiguracion, obtenerConfiguracion } from "@/lib/api-admin";
import {
  esquemaConfiguracion,
  type EntradaConfiguracion,
  type SalidaConfiguracion,
} from "@/lib/esquemas-admin";
import { Alerta, Campo, claseInput } from "./Campo";
import { Seccion } from "./Seccion";

const VALORES_INICIALES: EntradaConfiguracion = {
  name: "",
  slogan: "",
  whatsapp: "",
  email: "",
  instagram: "",
  address: "",
  city: "",
  policies: "",
  brand_colors: { primary: "#1A1A1A", secondary: "#8B5E3C", accent: "" },
};

export function ConfigForm() {
  const queryClient = useQueryClient();
  const avisar = useAviso();
  const [error, setError] = useState<string | null>(null);
  const [guardado, setGuardado] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["configuracion-admin"],
    queryFn: obtenerConfiguracion,
  });

  const form = useForm<EntradaConfiguracion, unknown, SalidaConfiguracion>({
    resolver: zodResolver(esquemaConfiguracion),
    defaultValues: VALORES_INICIALES,
  });

  // RHF necesita un reset explícito cuando los datos llegan de la API
  useEffect(() => {
    if (!data) return;

    form.reset({
      name: data.name,
      slogan: data.slogan,
      whatsapp: data.whatsapp,
      email: data.email ?? "",
      instagram: data.instagram ?? "",
      address: data.address ?? "",
      city: data.city ?? "",
      policies: data.policies ?? "",
      brand_colors: {
        primary: data.brand_colors.primary,
        secondary: data.brand_colors.secondary,
        accent: data.brand_colors.accent ?? "",
      },
    });
  }, [data, form]);

  const guardar = useMutation({
    mutationFn: (datos: SalidaConfiguracion) => actualizarConfiguracion(datos),
    onSuccess: () => {
      setGuardado(true);
      avisar("exito", "Cambios guardados.");
      void queryClient.invalidateQueries({ queryKey: ["configuracion-admin"] });
    },
    onError: (fallo) => {
      const mensaje = fallo instanceof Error ? fallo.message : "No se pudo guardar la configuración.";
      setError(mensaje);
      avisar("error", mensaje);
    },
  });

  const errores = form.formState.errors;

  if (isLoading) {
    return <p className="text-sm text-stone-500">Cargando configuración…</p>;
  }

  return (
    <form
      onSubmit={form.handleSubmit(
        (datos) => {
          setError(null);
          setGuardado(false);
          guardar.mutate(datos);
        },
        () => avisar("aviso", "Faltan campos por completar. Revisa los datos marcados."),
      )}
      className="space-y-5"
      noValidate
    >
      {error && <Alerta>{error}</Alerta>}
      {guardado && (
        <p role="status" className="border border-green-700/30 bg-green-50 px-3 py-2 text-sm text-green-800">
          Cambios guardados.
        </p>
      )}

      <Seccion titulo="Identidad" icono={<Store className="size-4 text-terracota" aria-hidden />}>

        <Campo etiqueta="Nombre de la tienda" htmlFor="config-name" error={errores.name?.message}>
          <input id="config-name" {...form.register("name")} className={claseInput} />
        </Campo>

        <Campo etiqueta="Slogan" htmlFor="config-slogan" error={errores.slogan?.message}>
          <input id="config-slogan" {...form.register("slogan")} className={claseInput} />
        </Campo>

        <div className="grid gap-4 sm:grid-cols-3">
          <Campo
            etiqueta="Color principal"
            htmlFor="config-color-primary"
            error={errores.brand_colors?.primary?.message}
          >
            <input
              id="config-color-primary"
              type="color"
              {...form.register("brand_colors.primary")}
              className="h-11 w-full rounded-sm border border-stone-300 bg-white p-1"
            />
          </Campo>

          <Campo
            etiqueta="Color secundario"
            htmlFor="config-color-secondary"
            error={errores.brand_colors?.secondary?.message}
          >
            <input
              id="config-color-secondary"
              type="color"
              {...form.register("brand_colors.secondary")}
              className="h-11 w-full rounded-sm border border-stone-300 bg-white p-1"
            />
          </Campo>

          <Campo
            etiqueta="Color de acento"
            htmlFor="config-color-accent"
            error={errores.brand_colors?.accent?.message}
            ayuda="Opcional, ej: #D4AF37"
          >
            <input
              id="config-color-accent"
              type="text"
              placeholder="#D4AF37"
              {...form.register("brand_colors.accent")}
              className={claseInput}
            />
          </Campo>
        </div>
      </Seccion>

      <Seccion titulo="Contacto" icono={<Contact className="size-4 text-terracota" aria-hidden />}>

        <div className="grid gap-4 sm:grid-cols-2">
          <Campo
            etiqueta="WhatsApp"
            htmlFor="config-whatsapp"
            error={errores.whatsapp?.message}
            ayuda="Solo dígitos, con código de país. Ej: 5215512345678"
          >
            <input
              id="config-whatsapp"
              type="tel"
              inputMode="numeric"
              {...form.register("whatsapp")}
              className={claseInput}
            />
          </Campo>

          <Campo etiqueta="Email" htmlFor="config-email" error={errores.email?.message}>
            <input
              id="config-email"
              type="email"
              {...form.register("email")}
              className={claseInput}
            />
          </Campo>

          <Campo etiqueta="Instagram" htmlFor="config-instagram" error={errores.instagram?.message}>
            <input
              id="config-instagram"
              {...form.register("instagram")}
              placeholder="@zapateria"
              className={claseInput}
            />
          </Campo>

          <Campo etiqueta="Ciudad" htmlFor="config-city" error={errores.city?.message}>
            <input id="config-city" {...form.register("city")} className={claseInput} />
          </Campo>
        </div>

        <Campo etiqueta="Dirección" htmlFor="config-address" error={errores.address?.message}>
          <input id="config-address" {...form.register("address")} className={claseInput} />
        </Campo>
      </Seccion>

      <Seccion
        titulo="Políticas de compra"
        icono={<FileText className="size-4 text-terracota" aria-hidden />}
      >
        <Campo
          etiqueta="Envíos, cambios y garantía"
          htmlFor="config-policies"
          error={errores.policies?.message}
        >
          <textarea
            id="config-policies"
            rows={6}
            {...form.register("policies")}
            className={claseInput}
          />
        </Campo>
      </Seccion>

      <div className="flex justify-end border-t border-stone-200 pt-5">
        <button
          type="submit"
          disabled={guardar.isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-carbon px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-hueso transition-all duration-300 ease-out hover:scale-[1.01] hover:bg-carbon-suave active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {guardar.isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {guardar.isPending ? "Guardando…" : "Guardar configuración"}
        </button>
      </div>
    </form>
  );
}
