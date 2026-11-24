import { MessageCircle } from "lucide-react";
import { cn, formatearPrecio } from "@/lib/utils";
import { construirUrlWhatsApp } from "@/lib/whatsapp";

interface Props {
  numero: string;
  producto: string;
  slug: string;
  precio: number;
  talla?: string;
  color?: string;
  urlBase: string;
  deshabilitado?: boolean;
  className?: string;
}

export function WhatsAppButton({
  numero,
  producto,
  slug,
  precio,
  talla,
  color,
  urlBase,
  deshabilitado = false,
  className,
}: Props) {
  if (!numero || deshabilitado) {
    return (
      <span
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 bg-carbon-suave px-6 py-4 text-sm font-semibold text-hueso/60",
          className,
        )}
      >
        No disponible por ahora
      </span>
    );
  }

  const url = construirUrlWhatsApp({
    numero,
    producto,
    slug,
    precio: formatearPrecio(precio),
    talla,
    color,
    urlBase,
  });

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 bg-oxblood px-6 py-4 text-sm font-semibold text-hueso hover:bg-oxblood-oscuro transition-colors",
        className,
      )}
    >
      <MessageCircle className="size-4" strokeWidth={1.5} aria-hidden />
      Comprar por WhatsApp
    </a>
  );
}
