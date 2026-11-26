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
          "inline-flex w-full items-center justify-center gap-2 rounded-full bg-carbon-suave px-6 py-4 text-sm font-semibold text-hueso/60",
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
        "inline-flex w-full items-center justify-center gap-2 rounded-full bg-oxblood px-6 py-4 text-sm font-semibold text-hueso transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:bg-oxblood-oscuro active:scale-[0.98]",
        className,
      )}
    >
      <MessageCircle className="size-4" strokeWidth={1.5} aria-hidden />
      Comprar por WhatsApp
    </a>
  );
}
