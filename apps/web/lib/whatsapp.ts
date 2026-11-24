interface MensajeWhatsApp {
  numero: string;
  producto: string;
  slug: string;
  talla?: string;
  color?: string;
  urlBase: string;
}

/** Construye la URL de wa.me con un mensaje elegante y prellenado. */
export function construirUrlWhatsApp({
  numero,
  producto,
  slug,
  talla,
  color,
  urlBase,
}: MensajeWhatsApp): string {
  // Sanitiza: quita +, espacios, guiones y cualquier no dígito
  const numeroLimpio = numero.replace(/\D/g, "");
  // Evita `//producto/...` si la URL base viene con barra final
  const base = urlBase.replace(/\/+$/, "");

  const lineas = [
    `Hola BOOZ, me interesa el modelo ${producto}.`,
    talla ? `Talla: ${talla}` : null,
    color ? `Color: ${color}` : null,
    // La URL va sola en su propia línea: WhatsApp la detecta y genera la
    // tarjeta con la og:image de la ficha del producto.
    `${base}/producto/${slug}`,
  ].filter((linea): linea is string => linea !== null);

  return `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(lineas.join("\n"))}`;
}
