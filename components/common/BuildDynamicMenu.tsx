import { MenuCategory, MenuProduct } from "@/hooks/use-menu-categories";

interface MenuItem {
  id: string;
  name: string;
  href: string;
  children: MenuItem[] | null;
  dir?: "rtl" | "ltr";
}

export function buildDynamicMenu(
  categoriesFromApi: MenuCategory[],
  isArabic: boolean
) {
  const featuredChildren = new Map<string, MenuProduct>();

  const categoryChildren: MenuItem[] = categoriesFromApi.map((cat) => ({
    id: cat.slug,
    name: isArabic ? cat.name_ar ?? cat.name : cat.name,
    href: `/category/${cat.slug}`,
    dir: isArabic ? "rtl" : "ltr",
    children: cat.products.map((prod) => {
      const prodId = prod.slug;

      if (prod.is_best_seller || prod.is_new_arrival) {
        featuredChildren.set(prodId, prod);
      }

      return {
        id: prodId,
        name: isArabic ? prod.name_ar ?? prod.name : prod.name,
        href: `/products/${prod.slug}`,
        dir: isArabic ? "rtl" : "ltr",
        children: null,
      };
    }),
  }));

  const featuredSection: MenuItem = {
    id: "featured",
    name: isArabic ? "مميز" : "Featured",
    href: "/featured",
    dir: isArabic ? "rtl" : "ltr",
    children: Array.from(featuredChildren.values())
      .slice(0, 12)
      .map((prod) => ({
        id: prod.slug,
        name: isArabic ? prod.name_ar ?? prod.name : prod.name,
        href: `/products/${prod.slug}`,
        dir: isArabic ? "rtl" : "ltr",
        children: null,
      })),
  };

  return {
    shopChildren: [featuredSection, ...categoryChildren],
  };
}
