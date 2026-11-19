/** Estados posibles de un producto en el catálogo. */
export type ProductStatus = "available" | "soldout" | "featured" | "coming";

/** Color disponible de un producto. */
export interface ProductColor {
  name: string;
  /** Código hexadecimal, ej: "#1A1A1A". */
  hex: string;
}

/** Imagen de un producto almacenada en Cloudinary. */
export interface ProductImage {
  url: string;
  /** Texto alternativo para accesibilidad y SEO. */
  alt: string;
}

/** Producto tal como se almacena en Supabase. */
export interface Product {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  long_description: string;
  /** Precio en centavos (ej: 4500 = $45.00). */
  price: number;
  /** Precio de oferta en centavos, o null si no hay oferta. */
  sale_price: number | null;
  sku: string;
  category_id: string;
  sizes: string[];
  colors: ProductColor[];
  images: ProductImage[];
  tags: string[];
  material: string;
  status: ProductStatus;
  /** Stock disponible, o null si no se controla inventario. */
  stock: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
