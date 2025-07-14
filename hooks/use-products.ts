import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  image: string;
  images: { image: string }[];
  is_new_arrival: boolean;
  is_best_seller: boolean;
}

export interface Filters {
  search?: string;
  is_new_arrival?: boolean;
  is_best_seller?: boolean;
  categories?: number[];
  ordering?: string;
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

const buildQueryParams = (filters: Filters, page: number) => {
  const params = new URLSearchParams({ page: page.toString() });

  if (filters.search) params.append('search', filters.search);
  if (filters.is_new_arrival) params.append('is_new_arrival', 'true');
  if (filters.is_best_seller) params.append('is_best_seller', 'true');
  if (filters.ordering) params.append('ordering', filters.ordering);
  filters.categories?.forEach((id) => params.append('categories', String(id)));

  return params.toString();
};

export const usePaginatedProducts = (
  page: number,
  filters: Filters = {}
) =>
  useQuery<PaginatedResponse>({
    queryKey: ['products', { ...filters, page }],
    queryFn: async () => {
      const query = buildQueryParams(filters, page);
      const response = await axios.get(`${API_URL}/products/?${query}`, {
        withCredentials: true,
      });
      return response.data;
    },
    placeholderData: (prev) => prev,
  });

// ✅ New hook to fetch a single product by ID
export const useProduct = (slug: string) =>
  useQuery<Product>({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/products/${slug}/`, {
        withCredentials: true,
      });
      return response.data;
    },
    enabled: !!slug,
  });