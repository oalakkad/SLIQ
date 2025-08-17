import { useQuery } from '@tanstack/react-query';
import { api } from '@/components/utils/api';

export interface MenuCategory {
  id: number;
  name: string;
  name_ar: string;
  slug: string;
  parent: number | null;
  products: MenuProduct[];
}

export interface MenuProduct {
  id: number;
  name: string;
  name_ar: string;
  slug: string;
  description: string;
  description_ar: string;
  price: string;
  stock_quantity: number;
  image: string;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  categories: ProductCategory[];
  images: ProductImage[];
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  name_ar: string;
  slug: string;
  parent: number | null;
}

export interface ProductImage {
  id: number;
  product: number;
  image: string;
  alt_text: string;
}

export const useMenuCategories = () =>
  useQuery<MenuCategory[]>({
    queryKey: ['menu-categories'],
    queryFn: async () => {
      const response = await api.get("/menu-categories/", {
        withCredentials: true,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 10,
  });
