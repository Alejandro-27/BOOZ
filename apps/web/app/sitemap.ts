import type { MetadataRoute } from "next";
import { obtenerProductos } from "@/lib/api";

const URL_SITIO = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// El catálogo cambia seguido: se genera por petición en lugar de en el build.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paginas: MetadataRoute.Sitemap = [
    { url: URL_SITIO, changeFrequency: "weekly", priority: 1 },
    { url: `${URL_SITIO}/catalogo`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${URL_SITIO}/nosotros`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${URL_SITIO}/contacto`, changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const productos = await obtenerProductos();
    return [
      ...paginas,
      ...productos.map((producto) => ({
        url: `${URL_SITIO}/producto/${producto.slug}`,
        lastModified: new Date(producto.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    // Si la API no responde, el sitemap conserva las páginas estáticas
    return paginas;
  }
}
