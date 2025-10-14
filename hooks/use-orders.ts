import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/components/utils/api";
import { useAppSelector } from "@/redux/hooks";

// --- Types ---
export interface OrderAddress {
  full_name: string;
  address_line: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  phone: string | null;
}

export interface OrderAddonOption {
  id: number;
  name: string;
  name_ar?: string;
  extra_price: string;
}

export interface OrderAddon {
  category: {
    id: number;
    name: string;
    name_ar?: string;
  };
  addon: {
    id: number;
    name: string;
    name_ar?: string;
    base_price: string;
    allow_multiple_options: boolean;
    requires_custom_name: boolean;
    custom_name?: string | null;
  };
  options: OrderAddonOption[];
  selection_subtotal: string;
}

export interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    name_ar?: string;
    image: string;
    price: string;
  };
  quantity: number;
  price_at_purchase: string;
  addons?: OrderAddon[];
}

export interface OrderDiscount {
  id: number;
  code: string;
  value: string;
  discount_type: "percent" | "fixed";
}

export interface Order {
  id: number;
  status: string;
  total_price: string;
  discount?: OrderDiscount | null;
  discount_amount?: string;

  created_at: string;
  updated_at: string;

  guest_name?: string | null;
  guest_email?: string | null;
  guest_phone?: string | null;

  // ✅ Address info
  shipping_full_name: string;
  shipping_line: string | null;
  shipping_city: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  shipping_phone: string | null;
  address?: OrderAddress | null;

  items: OrderItem[];
}

// --- Hook ---
export const useOrders = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const queryClient = useQueryClient();

  // Fetch user orders (only if authenticated)
  const ordersQuery = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await api.get("/orders/", { withCredentials: true });
      return response.data.results ?? response.data;
    },
    enabled: isAuthenticated, // Don’t fetch if guest
  });

  // Create an order from cart (works for both guest + user)
  const createOrder = useMutation({
    mutationFn: async (guestData?: {
      name: string;
      email: string;
      phone?: string;
    }) => {
      const response = await api.post(
        "/orders/checkout/",
        guestData ? { guest: guestData } : {},
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      }
    },
  });

  return { ...ordersQuery, createOrder };
};
