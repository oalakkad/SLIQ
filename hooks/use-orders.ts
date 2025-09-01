import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/components/utils/api";
import { useAppSelector } from "@/redux/hooks"; // to check if user is logged in

// --- Types ---
export interface OrderItem {
  id: number;
  product: any; // Replace with Product type if you have it
  quantity: number;
  price_at_purchase: string;
}

export interface Order {
  id: number;
  status: string;
  total_price: string;
  created_at: string;
  updated_at: string;
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
    enabled: isAuthenticated, // don’t fetch if guest
  });

  // Create an order from cart (works for both guest + user)
  const createOrder = useMutation({
    mutationFn: async (guestData?: { name: string; email: string; phone?: string }) => {
      const response = await api.post(
        "/orders/checkout/",
        guestData ? { guest: guestData } : {}, // send guest info if not logged in
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      }
      // guests don’t have history to invalidate
    },
  });

  return { ...ordersQuery, createOrder };
};