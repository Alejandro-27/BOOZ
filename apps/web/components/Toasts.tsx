"use client";

import { AlertCircle, Check, Info } from "lucide-react";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tipo = "exito" | "error" | "aviso";
type Avisar = (tipo: Tipo, mensaje: string) => void;

interface Aviso {
  id: number;
  tipo: Tipo;
  mensaje: string;
}

const ContextoAvisos = createContext<Avisar>(() => {});

export function useAviso() {
  return useContext(ContextoAvisos);
}

/** Avisos efímeros para las operaciones del panel. Sin dependencias nuevas. */
export function ProveedorAvisos({ children }: { children: ReactNode }) {
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  const avisar = useCallback<Avisar>((tipo, mensaje) => {
    const id = Date.now() + Math.random();
    setAvisos((actuales) => [...actuales, { id, tipo, mensaje }]);
    setTimeout(() => setAvisos((actuales) => actuales.filter((aviso) => aviso.id !== id)), 4500);
  }, []);

  return (
    <ContextoAvisos.Provider value={avisar}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col gap-2 sm:inset-x-auto sm:right-6 sm:w-80"
      >
        {avisos.map((aviso) => (
          <div
            key={aviso.id}
            className={cn(
              "flex items-start gap-2.5 border-l-2 bg-tarjeta px-4 py-3 text-sm shadow-md",
              aviso.tipo === "exito" && "border-l-cuero text-carbon",
              aviso.tipo === "error" && "border-l-oxblood text-oxblood",
              aviso.tipo === "aviso" && "border-l-pizarra text-carbon",
            )}
          >
            {aviso.tipo === "exito" && <Check className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} aria-hidden />}
            {aviso.tipo === "error" && <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} aria-hidden />}
            {aviso.tipo === "aviso" && <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} aria-hidden />}
            <span>{aviso.mensaje}</span>
          </div>
        ))}
      </div>
    </ContextoAvisos.Provider>
  );
}
