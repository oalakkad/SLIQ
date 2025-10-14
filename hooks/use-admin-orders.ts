import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/components/utils/api";
import { AxiosResponse } from "axios";

/* ───────────────────────────────────────────────
 * 🧾 Types
 * ───────────────────────────────────────────────*/

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

/* 🟢 MAIN ORDER TYPE */
export interface AdminOrder {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  } | null;

  guest_name?: string | null;
  guest_email?: string | null;
  guest_phone?: string | null;

  total_price: string;
  discount?: AdminOrderDiscount | null;
  discount_amount?: string;

  status: string;
  created_at: string;
  updated_at?: string;

  // 🟢 Shipping fields (editable in admin)
  shipping_full_name?: string | null;
  shipping_line?: string | null;
  shipping_city?: string | null;
  shipping_postal_code?: string | null;
  shipping_country?: string | null;
  shipping_phone?: string | null;

  // 🟡 Billing fields (not editable)
  billing_line?: string | null;
  billing_city?: string | null;
  billing_postal_code?: string | null;
  billing_country?: string | null;
  billing_phone?: string | null;

  // 🟢 Nested address object for display
  address?: {
    full_name?: string | null;
    address_line?: string | null;
    city?: string | null;
    postal_code?: string | null;
    country?: string | null;
    phone?: string | null;
  } | null;

  items: AdminOrderItem[];
}

/* 🔹 Update payload for PATCH */
export interface AdminOrderUpdatePayload {
  status?: string;
  total_price?: string;
  discount?: number | null; // only the ID
  discount_amount?: string;

  // 🟢 Allow updating shipping info
  shipping_full_name?: string | null;
  shipping_line?: string | null;
  shipping_city?: string | null;
  shipping_postal_code?: string | null;
  shipping_country?: string | null;
  shipping_phone?: string | null;

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

/* ───────────────────────────────────────────────
 * 🔗 API Requests
 * ───────────────────────────────────────────────*/

const fetchAllAdminOrders = async (
  params?: Record<string, string>,
  signal?: AbortSignal
): Promise<AdminOrder[]> => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  const url = `/admin/orders/${qs}`;
  const { data } = await api.get<AdminOrder[] | AdminOrdersResponse>(url, {
    signal,
  });

  if (Array.isArray(data)) return data;
  if (data && Array.isArray((data as AdminOrdersResponse).results))
    return (data as AdminOrdersResponse).results;

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

/* ───────────────────────────────────────────────
 * 🧩 Hook
 * ───────────────────────────────────────────────*/

export const useAdminOrders = (
  search?: string,
  filters?: Record<string, string>
) => {
  const queryClient = useQueryClient();
  const queryParams: Record<string, string> = {};
  if (search) queryParams.search = search;
  if (filters) Object.assign(queryParams, filters);

  const ordersQuery = useQuery<AdminOrder[], Error>({
    queryKey: ["adminOrders", search, filters],
    queryFn: () =>
      fetchAllAdminOrders(
        Object.keys(queryParams).length ? queryParams : undefined
      ),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const updateOrder = useMutation({
    mutationFn: updateOrderRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
    },
  });

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
