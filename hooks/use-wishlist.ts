import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// --- Types ---
export interface WishlistProduct {
  id: number;
  name: string;
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
  const res = await axios.post(`${API_URL}/wishlist/items/add/`, payload, {
    withCredentials: true,
  });
  return res.data;
};

const removeWishlistItemRequest = async (id: number) => {
  const res = await axios.delete(`${API_URL}/wishlist/items/${id}/delete/`, {
    withCredentials: true,
  });
  return res.data;
};

const clearWishlistRequest = async () => {
  const res = await axios.delete(`${API_URL}/wishlist/clear/`, {
    withCredentials: true,
  });
  return res.data;
};

// --- Hook ---
export const useWishlist = () => {
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery<WishlistResponse, Error>({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
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
