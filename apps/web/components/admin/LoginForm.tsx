"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { LogIn } from "lucide-react";
import { crearClienteNavegador } from "@/lib/supabase/client";
import { Alerta, Campo, claseInput } from "./Campo";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault();
    setError(null);
    setEnviando(true);

    const { error: errorAuth } = await crearClienteNavegador().auth.signInWithPassword({
      email,
      password,
    });

    if (errorAuth) {
      // Supabase devuelve los mensajes en inglés; se traducen los más comunes
      setError(
        errorAuth.message === "Invalid login credentials"
          ? "Correo o contraseña incorrectos."
          : "No pudimos iniciar sesión. Revisa tus datos e intenta de nuevo.",
      );
      setEnviando(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  };

  return (
    <form onSubmit={enviar} className="space-y-5" noValidate>
      {error && <Alerta>{error}</Alerta>}

      <Campo etiqueta="Correo electrónico" htmlFor="email">
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
          className={claseInput}
        />
      </Campo>

      <Campo etiqueta="Contraseña" htmlFor="password">
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(evento) => setPassword(evento.target.value)}
          className={claseInput}
        />
      </Campo>

      <button
        type="submit"
        disabled={enviando}
        className="flex w-full items-center justify-center gap-2 bg-carbon px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-hueso transition-colors hover:bg-carbon-suave disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogIn className="size-4" aria-hidden />
        {enviando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
