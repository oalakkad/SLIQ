import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/components/utils/api";
import { AxiosResponse } from "axios";

// --- Types ---
export interface AdminOrderItem {
  id: number;
  quantity: number;
  price_at_purchase: string;
  product: {
    id: number;
    name: string;
    name_ar?: string;
  };
}

export interface AdminOrder {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  total_price: string;
  status: string;
  created_at: string;
  items: AdminOrderItem[];
}

interface AdminOrdersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminOrder[];
}

// --- API Requests ---
// ✅ Fetch ALL pages of orders
const fetchAllAdminOrders = async (
  params?: Record<string, string>,
  signal?: AbortSignal
): Promise<AdminOrder[]> => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  const url = `/admin/orders/${qs}`;

  const { data } = await api.get<AdminOrder[] | AdminOrdersResponse>(url, { signal });

  if (Array.isArray(data)) {
    return data;                 // non-paginated backend
  }
  if (data && Array.isArray((data as AdminOrdersResponse).results)) {
    return (data as AdminOrdersResponse).results; // paginated backend
  }
  throw new Error("Unexpected orders response shape");
};

const updateOrderRequest = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<AdminOrder>;
}) => {
  const res: AxiosResponse<AdminOrder> = await api.patch(
    `/admin/orders/${id}/`,
    data
  );
  return res.data;
};

const deleteOrderRequest = async (id: number) => {
  const res: AxiosResponse<void> = await api.delete(`/admin/orders/${id}/`);
  return res.data;
};

// --- Hook ---
export const useAdminOrders = (
  search?: string,
  filters?: Record<string, string>
) => {
  const queryClient = useQueryClient();

  // Build query params
  const queryParams: Record<string, string> = {};
  if (search) queryParams.search = search;
  if (filters) Object.assign(queryParams, filters);

  // Fetch ALL Orders (no pagination on frontend)
  const ordersQuery = useQuery<AdminOrder[], Error>({
    queryKey: ["adminOrders", search, filters],
    queryFn: () =>
      fetchAllAdminOrders(
        Object.keys(queryParams).length ? queryParams : undefined
      ),
    staleTime: 60_000,
    refetchOnWindowFocus: true, // ✅ Auto refetch after idle
    retry: 1, // Retry once after refresh
  });

  // Update order
  const updateOrder = useMutation({
    mutationFn: updateOrderRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
    },
  });

  // Delete order
  const deleteOrder = useMutation({
    mutationFn: deleteOrderRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
    },
  });

  return {
    orders: ordersQuery.data ?? [],
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
    refetch: ordersQuery.refetch,
    updateOrder,
    deleteOrder,
  };
};
