import { useAppSelector } from "@/redux/hooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/components/utils/api";
import { guestApi } from "@/components/utils/guestApi"; // 👈 import the guest API

// --- Types ---
export interface CartProduct {
  id: number;
  name: string;
  name_ar: string;
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

export type AddonSelection = {
  category_id: number;
  addon_id: number;
  option_ids: number[];
  custom_name?: string | null;
};

export interface AddToCartPayload {
  product_id: number;
  quantity: number;
  addons?: AddonSelection[];
}

// --- Hook ---
export const useCart = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const queryClient = useQueryClient();

  // Choose the correct API instance
  const client = isAuthenticated ? api : guestApi;

  // Fetch cart
  const cartQuery = useQuery<Cart, Error>({
    queryKey: ["cart", isAuthenticated], // 👈 separate cache for auth/guest
    queryFn: async () => {
      const { data } = await client.get<Cart>("/cart/");
      return data;
    },
    staleTime: 60 * 1000,
  });

  // Add item
  const addToCart = useMutation({
    mutationFn: async (payload: AddToCartPayload) => {
      const { data } = await client.post("/cart/items/add/", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", isAuthenticated] });
    },
  });

  // Update item
  const updateCartItem = useMutation({
    mutationFn: async (payload: { id: number; quantity: number }) => {
      const { data } = await client.patch(`/cart/items/${payload.id}/update/`, {
        quantity: payload.quantity,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", isAuthenticated] });
    },
  });

  // Remove item
  const removeCartItem = useMutation({
    mutationFn: async (id: number) => {
      const { data } = await client.delete(`/cart/items/${id}/delete/`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", isAuthenticated] });
    },
  });

  return {
    ...cartQuery,
    addToCart,
    updateCartItem,
    removeCartItem,
  };
};
