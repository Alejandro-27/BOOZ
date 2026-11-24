"use client";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import type { ProductoConCategoria } from "@/lib/api";
import { urlCloudinary } from "@/lib/imagenes";

interface Props {
  imagenes: ProductoConCategoria["images"];
  nombre: string;
  indice: number;
  alCerrar: () => void;
}

/** Visor a pantalla completa: swipe nativo, pinch-to-zoom y teclado (Esc/flechas). */
export default function ProductLightboxCaja({ imagenes, nombre, indice, alCerrar }: Props) {
  return (
    <Lightbox
      open
      index={indice}
      close={alCerrar}
      slides={imagenes.map((imagen) => ({
        src: urlCloudinary(imagen.url, 2000),
        alt: imagen.alt || nombre,
      }))}
      plugins={[Zoom]}
      carousel={{ finite: true }}
      zoom={{ maxZoomPixelRatio: 3 }}
      labels={{
        Close: "Cerrar",
        Previous: "Imagen anterior",
        Next: "Imagen siguiente",
        "Zoom in": "Acercar",
        "Zoom out": "Alejar",
      }}
      styles={{ container: { backgroundColor: "#1c1917" } }}
    />
  );
}
