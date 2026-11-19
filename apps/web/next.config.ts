import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cloudinary ya entrega imágenes optimizadas (w_, q_auto, f_auto).
    // Desactivamos el optimizador de Next para no depender de un servidor
    // de imágenes en Cloudflare Pages.
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
