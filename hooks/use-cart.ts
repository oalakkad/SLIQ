import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/components/utils/api';

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
  // Optional: server can start returning this later
  // addons?: AddonSelection[];
  // unit_extra_price?: string; // price impact per unit from addons
}

export interface Cart {
  id: number;
  items: CartItem[];
}

// ---- NEW: addon selection payload we’ll send when adding to cart ----
export type AddonSelection = {
  category_id: number;
  addon_id: number;
  option_ids: number[];
  custom_name?: string | null;
};

// ---- NEW: add-to-cart payload shape (addons optional for backwards compat) ----
export interface AddToCartPayload {
  product_id: number;
  quantity: number;
  addons?: AddonSelection[];
}

// --- API Requests ---
const fetchCart = async (): Promise<Cart> => {
  const res = await api.get("/cart/", { withCredentials: true });
  return res.data;
};

const addToCartRequest = async (payload: AddToCartPayload) => {
  const res = await api.post("/cart/items/add/", payload, {
    withCredentials: true,
  });
  return res.data;
};

const updateCartItemRequest = async (payload: { id: number; quantity: number }) => {
  const res = await api.patch(
    `/cart/items/${payload.id}/update/`,
    { quantity: payload.quantity },
    { withCredentials: true }
  );
  return res.data;
};

const removeCartItemRequest = async (id: number) => {
  const res = await api.delete(`/cart/items/${id}/delete/`, {
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
