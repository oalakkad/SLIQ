import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// --- Types ---
export interface CartProduct {
  id: number;
  name: string;
  price: string;
  slug: string;
  image: string;
}

export interface CartItem {
  id: number;
  quantity: number;
  product: CartProduct;
}

export interface Cart {
  id: number;
  items: CartItem[];
}

// --- API Requests ---
const fetchCart = async (): Promise<Cart> => {
  const res = await axios.get(`${API_URL}/cart/`, { withCredentials: true });
  return res.data;
};

const addToCartRequest = async (payload: { product_id: number; quantity: number }) => {
  const res = await axios.post(`${API_URL}/cart/items/add/`, payload, {
    withCredentials: true,
  });
  return res.data;
};

const updateCartItemRequest = async (payload: { id: number; quantity: number }) => {
  const res = await axios.patch(`${API_URL}/cart/items/${payload.id}/update/`, { quantity: payload.quantity }, {
    withCredentials: true,
  });
  return res.data;
};

const removeCartItemRequest = async (id: number) => {
  const res = await axios.delete(`${API_URL}/cart/items/${id}/delete/`, {
    withCredentials: true,
  });
  return res.data;
};

// --- Hook ---
export const useCart = () => {
  const queryClient = useQueryClient();

  const cartQuery = useQuery<Cart, Error>({
    queryKey: ['cart'],
    queryFn: fetchCart,
    staleTime: 60 * 1000,
  });

  const addToCart = useMutation({
    mutationFn: addToCartRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const updateCartItem = useMutation({
    mutationFn: updateCartItemRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeCartItem = useMutation({
    mutationFn: removeCartItemRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return {
    ...cartQuery,
    addToCart,
    updateCartItem,
    removeCartItem,
  };
};
