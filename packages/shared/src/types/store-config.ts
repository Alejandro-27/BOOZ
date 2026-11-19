/** Colores de marca usados para theming del sitio. */
export interface BrandColors {
  primary: string;
  secondary: string;
  accent?: string;
}

/** Configuración global de la tienda (fila única en Supabase). */
export interface StoreConfig {
  id: string;
  name: string;
  slogan: string;
  logo_url: string | null;
  /** Número con código de país, solo dígitos (ej: "5215512345678"). */
  whatsapp: string;
  email: string | null;
  instagram: string | null;
  address: string | null;
  city: string | null;
  /** Políticas de envío, devolución y garantía en texto libre. */
  policies: string | null;
  brand_colors: BrandColors;
}
