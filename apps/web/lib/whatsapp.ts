interface MensajeWhatsApp {
  numero: string;
  producto: string;
  slug: string;
  /** Precio ya formateado, ej: "$ 1.899". */
  precio: string;
  talla?: string;
  color?: string;
  urlBase: string;
}

/** Construye la URL de wa.me con un mensaje elegante y prellenado. */
export function construirUrlWhatsApp({
  numero,
  producto,
  slug,
  precio,
  talla,
  color,
  urlBase,
}: MensajeWhatsApp): string {
  // Sanitiza: quita +, espacios, guiones y cualquier no dígito
  const numeroLimpio = numero.replace(/\D/g, "");
  // Evita `//producto/...` si la URL base viene con barra final
  const base = urlBase.replace(/\/+$/, "");

  const detalle = [talla ? `Talla: ${talla}` : null, color ? `Color: ${color}` : null]
    .filter((linea): linea is string => linea !== null)
    .join(" | ");

  const mensaje = [
    "Hola BOOZ 👞",
    "Me interesa este modelo:",
    "",
    producto,
    ...(detalle ? [detalle] : []),
    `Precio: ${precio}`,
    "",
    // WhatsApp detecta esta URL y genera la tarjeta con la og:image de la ficha.
    `Ver producto: ${base}/producto/${slug}`,
    "",
    "¿Está disponible?",
  ].join("\n");

  return `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`;
}
