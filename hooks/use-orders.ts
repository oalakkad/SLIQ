import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/components/utils/api';

export interface OrderItem {
  id: number;
  product: any; // You can import Product if defined elsewhere
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

export const useOrders = () => {
  const queryClient = useQueryClient();

  // Get user orders
  const ordersQuery = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await api.get("/orders/", { withCredentials: true });
      return response.data.results;
    },
  });

  // Create an order from cart
  const createOrder = useMutation({
    mutationFn: async () => {
      const response = await api.post("/orders/checkout/", {}, { withCredentials: true });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return { ...ordersQuery, createOrder };
};
