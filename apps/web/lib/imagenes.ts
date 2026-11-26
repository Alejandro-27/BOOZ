import type { ImageLoader } from "next/image";

/**
 * next/image con loader custom: el optimizador lo hace Cloudinary.
 * Next calcula los anchos del srcset y nosotros los traducimos a w_.
 *
 * Cada ancho distinto es una transformación facturable y un derivado que ocupa
 * storage, así que el srcset se limita a esta escalera. Sin el tope de 1600, un
 * portátil retina pedía variantes de 2048 y 3840 para una foto que nunca se ve
 * a más de ~960 px.
 */
const ANCHOS = [256, 384, 640, 960, 1280, 1600];

function anchoCanonico(width: number) {
  return ANCHOS.find((ancho) => ancho >= width) ?? ANCHOS[ANCHOS.length - 1];
}

export function urlCloudinary(src: string, width: number) {
  if (!src.includes("/upload/")) return src;
  // Si la URL ya trae transformación, la reemplaza por el ancho pedido.
  const limpia = src.replace(/\/upload\/[^/?]*w_\d+[^/?]*\//, "/upload/");
  return limpia.replace("/upload/", `/upload/w_${anchoCanonico(width)},q_auto,f_auto/`);
}

const cloudinaryLoader: ImageLoader = ({ src, width }) => urlCloudinary(src, width);

export default cloudinaryLoader;
