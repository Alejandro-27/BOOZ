"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import type { ProductImage } from "@zapateria/shared";
import { subirImagen } from "@/lib/api-admin";
import { Alerta } from "./Campo";

const LIMITE_BYTES = 5 * 1024 * 1024;

interface Props {
  imagenes: ProductImage[];
  nombreProducto: string;
  onCambio: (imagenes: ProductImage[]) => void;
}

/** Sube imágenes a Cloudinary y edita su texto alternativo. */
export function ImageUploader({ imagenes, nombreProducto, onCambio }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const seleccionar = async (evento: ChangeEvent<HTMLInputElement>) => {
    const archivo = evento.target.files?.[0];
    // Permite volver a elegir el mismo archivo después de quitarlo
    evento.target.value = "";
    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      setError("Selecciona un archivo de imagen.");
      return;
    }
    if (archivo.size > LIMITE_BYTES) {
      setError("La imagen supera el límite de 5 MB.");
      return;
    }

    setError(null);
    setSubiendo(true);
    try {
      const { url } = await subirImagen(archivo);
      onCambio([...imagenes, { url, alt: nombreProducto }]);
    } catch (fallo) {
      setError(fallo instanceof Error ? fallo.message : "No se pudo subir la imagen.");
    } finally {
      setSubiendo(false);
    }
  };

  const quitar = (indice: number) => {
    onCambio(imagenes.filter((_, posicion) => posicion !== indice));
  };

  const cambiarAlt = (indice: number, alt: string) => {
    onCambio(
      imagenes.map((imagen, posicion) => (posicion === indice ? { ...imagen, alt } : imagen)),
    );
  };

  return (
    <div className="space-y-3">
      {error && <Alerta>{error}</Alerta>}

      {imagenes.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {imagenes.map((imagen, indice) => (
            <li key={`${imagen.url}-${indice}`} className="space-y-2 border border-carbon/10 p-2">
              <div className="relative aspect-square overflow-hidden bg-carbon/5">
                <Image
                  src={imagen.url}
                  alt={imagen.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 200px"
                  className="object-cover"
                />
              </div>
              <label className="sr-only" htmlFor={`alt-imagen-${indice}`}>
                Texto alternativo de la imagen {indice + 1}
              </label>
              <input
                id={`alt-imagen-${indice}`}
                type="text"
                value={imagen.alt}
                onChange={(evento) => cambiarAlt(indice, evento.target.value)}
                placeholder="Texto alternativo"
                className="w-full border border-carbon/20 px-2 py-1.5 text-xs outline-none focus:border-cuero"
              />
              <button
                type="button"
                onClick={() => quitar(indice)}
                className="flex w-full items-center justify-center gap-1 border border-carbon/15 px-2 py-1.5 text-xs text-cuero transition-colors hover:bg-cuero/5"
              >
                <Trash2 className="size-3.5" aria-hidden />
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={seleccionar}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={subiendo}
        className="flex w-full items-center justify-center gap-2 border border-dashed border-carbon/30 px-4 py-4 text-sm text-carbon/70 transition-colors hover:border-cuero hover:text-cuero disabled:cursor-wait disabled:opacity-60"
      >
        {subiendo ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden />
            Subiendo imagen…
          </>
        ) : (
          <>
            <ImagePlus className="size-5" aria-hidden />
            Agregar imagen
          </>
        )}
      </button>
      <p className="text-xs text-carbon/50">JPG, PNG o WebP. Máximo 5 MB por imagen.</p>
    </div>
  );
}
