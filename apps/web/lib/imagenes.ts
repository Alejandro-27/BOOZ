import type { ImageLoader } from "next/image";

/**
 * next/image con loader custom: el optimizador lo hace Cloudinary.
 * Next calcula los anchos del srcset y nosotros los traducimos a w_.
 */
export function urlCloudinary(src: string, width: number) {
  if (!src.includes("/upload/")) return src;
  // Si la URL ya trae transformación, la reemplaza por el ancho pedido.
  const limpia = src.replace(/\/upload\/[^/?]*w_\d+[^/?]*\//, "/upload/");
  return limpia.replace("/upload/", `/upload/w_${width},q_auto,f_auto/`);
}

const cloudinaryLoader: ImageLoader = ({ src, width }) => urlCloudinary(src, width);

export default cloudinaryLoader;
