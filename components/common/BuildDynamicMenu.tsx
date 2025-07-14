import { MenuCategory, MenuProduct } from "@/hooks/use-menu-categories";
import slugify from "slugify"; // optional, to ensure slugs are safe for IDs

export function buildDynamicMenu(categoriesFromApi: MenuCategory[]) {
  const featuredChildren = new Map<string, MenuProduct>();

  const categoryChildren = categoriesFromApi.map((cat) => ({
    id: cat.slug,
    name: cat.name,
    href: `/category/${cat.slug}`,
    children: cat.products.map((prod) => {
      const prodId = prod.slug;

      // Collect featured for global 'Featured' section
      if (prod.is_best_seller || prod.is_new_arrival) {
        featuredChildren.set(prodId, prod);
      }

      return {
        id: prodId,
        name: prod.name,
        href: `/products/${prod.slug}`,
        children: null,
      };
    }),
  }));

  const featuredSection = {
    id: "featured",
    name: "Featured",
    href: "/featured",
    children: Array.from(featuredChildren.values())
      .slice(0, 12)
      .map((prod) => ({
        id: prod.slug,
        name: prod.name,
        href: `/products/${prod.slug}`,
        children: null,
      })),
  };

  return {
    shopChildren: [featuredSection, ...categoryChildren],
  };
}
