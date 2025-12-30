import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productsRes = await fetch(`${API_URL}/api/products/sitemap/`);
  console.log(
    "PRODUCTS STATUS",
    productsRes.status,
    productsRes.headers.get("content-type")
  );

  const categoriesRes = await fetch(`${API_URL}/api/categories/sitemap/`);
  console.log(
    "CATEGORIES STATUS",
    categoriesRes.status,
    categoriesRes.headers.get("content-type")
  );

  const products = await productsRes.json();
  const categories = await categoriesRes.json();

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      priority: 1,
    },

    // Categories
    ...categories.map((c: any) => ({
      url: `${SITE_URL}/category/${c.slug}`,
      lastModified: c.updated_at ?? new Date(),
      priority: 0.7,
    })),

    // Products
    ...products.map((p: any) => ({
      url: `${SITE_URL}/product/${p.slug}`,
      lastModified: p.updated_at,
      priority: 0.8,
    })),
  ];
}
