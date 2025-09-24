import { useAppSelector } from "@/redux/hooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/components/utils/api";
import { guestApi } from "@/components/utils/guestApi";
import { useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";

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
  const toast = useToast();

  // Choose the correct API instance
  const client = isAuthenticated ? api : guestApi;

  // Fetch cart
  const cartQuery = useQuery<Cart, Error>({
    queryKey: ["cart", isAuthenticated],
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
    onError: (error: AxiosError<any>) => {
      if (error.response?.data) {
        const errData = error.response.data;
        Object.entries(errData).forEach(([field, messages]) => {
          (Array.isArray(messages) ? messages : [messages]).forEach((msg) => {
            toast({
              title: field === "non_field_errors" ? "Error" : field,
              description: msg,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top-right",
            });
          });
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
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
    onError: (error: AxiosError<any>) => {
      toast({
        title: "Update failed",
        description: error.response?.data?.detail || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
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
    onError: (error: AxiosError<any>) => {
      toast({
        title: "Remove failed",
        description: error.response?.data?.detail || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    },
  });

  return {
    ...cartQuery,
    addToCart,
    updateCartItem,
    removeCartItem,
  };
};
