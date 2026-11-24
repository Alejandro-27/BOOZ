import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DetalleProducto } from "@/components/DetalleProducto";
import {
  ErrorApi,
  obtenerConfiguracionSegura,
  obtenerProducto,
  type ProductoConCategoria,
} from "@/lib/api";
import { urlCloudinary } from "@/lib/imagenes";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const producto = await obtenerProducto(slug);
    const imagen = producto.images[0];
    // WhatsApp descarga esta imagen para la tarjeta: se pide ya optimizada
    // (las subidas nuevas guardan el secure_url original, sin transformar).
    const imagenOg = imagen
      ? { url: urlCloudinary(imagen.url, 800), alt: imagen.alt || producto.name }
      : undefined;

    return {
      title: producto.name,
      description: producto.short_description,
      alternates: { canonical: `/producto/${producto.slug}` },
      openGraph: {
        type: "website",
        title: producto.name,
        description: producto.short_description,
        url: `/producto/${producto.slug}`,
        images: imagenOg ? [imagenOg] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: producto.name,
        description: producto.short_description,
        images: imagenOg ? [imagenOg.url] : undefined,
      },
    };
  } catch {
    return { title: "Producto no encontrado" };
  }
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;

  let producto: ProductoConCategoria;
  try {
    producto = await obtenerProducto(slug);
  } catch (error) {
    if (error instanceof ErrorApi && error.estado === 404) {
      notFound();
    }
    throw error;
  }

  const configuracion = await obtenerConfiguracionSegura();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
      <nav aria-label="Ruta de navegación" className="mb-8 text-sm">
        <Link href="/catalogo" className="text-pizarra transition-colors hover:text-oxblood">
          Catálogo
        </Link>
        <span className="mx-2 text-carbon/30">/</span>
        <span className="text-pizarra">{producto.name}</span>
      </nav>

      <DetalleProducto producto={producto} whatsapp={configuracion?.whatsapp ?? ""} />
    </div>
  );
}
