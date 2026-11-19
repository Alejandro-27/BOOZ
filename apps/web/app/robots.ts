import type { MetadataRoute } from "next";

const URL_SITIO = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${URL_SITIO}/sitemap.xml`,
  };
}
