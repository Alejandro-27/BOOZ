"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { crearClienteNavegador } from "@/lib/supabase/client";
import { Alerta, Campo, claseInput } from "./Campo";
import { useAviso } from "@/components/Toasts";

export function LoginForm() {
  const router = useRouter();
  const avisar = useAviso();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault();
    setError(null);
    if (!email || !password) {
      avisar("aviso", "Escribe tu correo y contraseña.");
      return;
    }
    setEnviando(true);

    const { error: errorAuth } = await crearClienteNavegador().auth.signInWithPassword({
      email,
      password,
    });

    if (errorAuth) {
      // Supabase devuelve los mensajes en inglés; se traducen los más comunes
      const mensaje =
        errorAuth.message === "Invalid login credentials"
          ? "Correo o contraseña incorrectos."
          : "No pudimos iniciar sesión. Revisa tus datos e intenta de nuevo.";
      setError(mensaje);
      avisar("error", mensaje);
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
        <div className="relative">
          <input
            id="password"
            type={verPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
            className={`${claseInput} pr-12`}
          />
          <button
            type="button"
            onClick={() => setVerPassword((visible) => !visible)}
            aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={verPassword}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-carbon/50 transition-colors hover:text-carbon"
          >
            {verPassword ? (
              <EyeOff className="size-4" strokeWidth={1.5} aria-hidden />
            ) : (
              <Eye className="size-4" strokeWidth={1.5} aria-hidden />
            )}
          </button>
        </div>
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
