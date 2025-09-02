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
  addons?: Array<{
    category: {
      id: number;
      name: string;
      name_ar: string;
    };
    addon: {
      id: number;
      name: string;
      name_ar: string;
      base_price: string;
      allow_multiple_options: boolean;
      requires_custom_name: boolean;
      custom_name?: string | null;
    };
    options: Array<{
      id: number;
      name: string;
      name_ar: string;
      extra_price: string;
    }>;
    selection_subtotal: string;
  }>;
}

export interface AdminOrderDiscount {
  id: number;
  code: string;
  value: string; // percentage or fixed value
  discount_type: "percent" | "fixed";
}

export interface AdminOrder {
  id: number;
  user: { id: number; first_name: string; last_name: string; email: string } | null;
  guest_name?: string | null;
  guest_email?: string | null;
  guest_phone?: string | null;

  total_price: string;
  discount?: AdminOrderDiscount | null;   // full object
  discount_amount?: string;

  status: string;
  created_at: string;
  updated_at?: string;
  items: AdminOrderItem[];
}

// Separate type just for update requests
export interface AdminOrderUpdatePayload {
  status?: string;
  total_price?: string;
  discount?: number | null;        // 👈 only the ID here
  discount_amount?: string;
  items_write?: {
    id: number;
    product: number;
    quantity: number;
    price_at_purchase: string;
    addons?: {
      category_id: number | null;
      addon_id: number | null;
      option_ids: number[];
      custom_name?: string | null;
    }[];
  }[];
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
  data: Partial<AdminOrderUpdatePayload>;
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
