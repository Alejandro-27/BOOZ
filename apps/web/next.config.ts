import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // La hoja de Tailwind son ~8 KB: meterla en el HTML evita un viaje de ida
  // y vuelta en móvil (Lighthouse marcaba ~156 ms de CSS bloqueante).
  experimental: { inlineCss: true },
  images: {
    // Cloudinary entrega las imágenes ya transformadas, así que next/image usa
    // un loader custom (srcset con w_ por breakpoint) en vez del optimizador de
    // Next, que no está disponible en Cloudflare Workers.
    loader: "custom",
    loaderFile: "./lib/imagenes.ts",
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
