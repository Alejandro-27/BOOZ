"use client";

import { createBrowserClient } from "@supabase/ssr";

type ClienteNavegador = ReturnType<typeof createBrowserClient>;

let cliente: ClienteNavegador | null = null;

/** Cliente de Supabase para componentes del navegador (singleton). */
export function crearClienteNavegador(): ClienteNavegador {
  cliente ??= createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  return cliente;
}
