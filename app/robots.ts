import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.NODE_ENV === "production";

  return {
    rules: [
      {
        userAgent: "*",
        allow: isProd ? "/" : "",
        disallow: isProd
          ? ["/api/", "/admin/", "/checkout", "/account", "/cart"]
          : ["/"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
