import { useAppSelector } from '@/redux/hooks';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { api } from '@/components/utils/api';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// --- Types ---
export interface WishlistProduct {
  id: number;
  name: string;
  name_ar: string;
  slug: string;
  image: string;
}

export interface WishlistItem {
  id: number;
  product: WishlistProduct;
  created_at: string;
}

export interface WishlistResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: WishlistItem[];
}

// --- API Requests ---
const fetchWishlist = async (): Promise<WishlistResponse> => {
  const res = await axios.get(`${API_URL}/wishlist/`, {
    withCredentials: true,
  });
  return res.data;
};

const addToWishlistRequest = async (payload: { product: number }) => {
  const res = await api.post("/wishlist/items/add/", payload, {
    withCredentials: true,
  });
  return res.data;
};

const removeWishlistItemRequest = async (id: number) => {
  const res = await api.delete(`/wishlist/items/${id}/delete/`, {
    withCredentials: true,
  });
  return res.data;
};

const clearWishlistRequest = async () => {
  const res = await api.delete("/wishlist/clear/", {
    withCredentials: true,
  });
  return res.data;
};

// --- Hook ---
export const useWishlist = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const wishlistQuery = useQuery<WishlistResponse, Error>({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });

  const addToWishlist = useMutation({
    mutationFn: addToWishlistRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const removeFromWishlist = useMutation({
    mutationFn: removeWishlistItemRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const clearWishlist = useMutation({
    mutationFn: clearWishlistRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  return {
    ...wishlistQuery,
    items: wishlistQuery.data?.results ?? [],
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
  };
};
