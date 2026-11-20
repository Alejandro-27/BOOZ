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

  const lineas = [
    `Hola BOOZ, me interesa el modelo ${producto}.`,
    talla ? `Talla: ${talla}` : null,
    color ? `Color: ${color}` : null,
    `Enlace: ${urlBase}/producto/${slug}`,
  ].filter((linea): linea is string => linea !== null);

  return `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(lineas.join("\n"))}`;
}
