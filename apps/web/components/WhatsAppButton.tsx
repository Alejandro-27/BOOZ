import { MessageCircle } from "lucide-react";
import { construirUrlWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface Props {
  numero: string;
  producto: string;
  slug: string;
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
          "inline-flex w-full items-center justify-center gap-2 bg-carbon/10 px-6 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-carbon/50",
          className,
        )}
      >
        No disponible por ahora
      </span>
    );
  }

  const url = construirUrlWhatsApp({ numero, producto, slug, talla, color, urlBase });

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 bg-dorado px-6 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-carbon transition-colors hover:bg-dorado/90",
        className,
      )}
    >
      <MessageCircle className="size-5" aria-hidden />
      Comprar por WhatsApp
    </a>
  );
}
