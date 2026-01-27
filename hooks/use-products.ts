import { useQuery } from "@tanstack/react-query";
import { ProductCategory } from "./use-menu-categories";
import { api } from "@/components/utils/api";

export interface Product {
  id: number;
  name: string;
  name_ar: string;
  slug: string;
  price: string;
  image: string;
  images: { image: string }[];
  is_new_arrival: boolean;
  is_best_seller: boolean;
  categories: ProductCategory[];
  stock_quantity: number;
  description: string;
  description_ar: string;
}

export interface Filters {
  search?: string;
  is_new_arrival?: boolean;
  is_best_seller?: boolean;
  categories?: number[];
  category_slug?: string; // 👈 Add this
  ordering?: string;
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export type SortKey = "featured" | "price-lth" | "price-htl" | undefined;

const buildQueryParams = (filters: Filters, page: number) => {
  const params = new URLSearchParams({ page: page.toString() });

  if (filters.search) params.append("search", filters.search);
  if (filters.is_new_arrival) params.append("is_new_arrival", "true");
  if (filters.is_best_seller) params.append("is_best_seller", "true");
  if (filters.ordering) params.append("ordering", filters.ordering);
  if (filters.category_slug)
    params.append("category_slug", filters.category_slug);
  filters.categories?.forEach((id) => params.append("categories", String(id)));

  return params.toString();
};

export const usePaginatedProducts = (
  page: number,
  filters: Filters = {},
  sort?: SortKey,
) =>
  useQuery<PaginatedResponse>({
    // include `sort` in the cache key so each sort has its own cache entry
    queryKey: ["products", { ...filters, page, sort }],
    queryFn: async () => {
      const query = buildQueryParams(filters, page); // ← unchanged
      const ordering = sort ? `&ordering=${encodeURIComponent(sort)}` : "";
      const response = await api.get(`/products/?${query}${ordering}`, {
        withCredentials: true,
      });
      return response.data;
    },
    placeholderData: (prev) => prev,
  });

// ✅ New hook to fetch a single product by ID
export const useProduct = (slug: string) =>
  useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await api.get(`/products/${slug}/`, {
        withCredentials: true,
      });
      return response.data;
    },
    enabled: !!slug,
  });
