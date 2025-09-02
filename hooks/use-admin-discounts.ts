import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/components/utils/api";
import { AxiosResponse } from "axios";

// --- Types ---
export interface AdminDiscount {
  id: number;
  code: string;
  description?: string;
  discount_type: "percent" | "fixed";
  value: string; // keep string to match backend DecimalField
  active: boolean;
  usage_limit?: number | null;
  per_user_limit?: number | null;
  expiry_date?: string | null;
  applies_to_all: boolean;
  products?: number[]; // array of product IDs
  categories?: number[]; // array of category IDs
  created_at: string;
}

interface AdminDiscountsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminDiscount[];
}

// --- API Requests ---
const fetchAllAdminDiscounts = async (
  params?: Record<string, string>,
  signal?: AbortSignal
): Promise<AdminDiscount[]> => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  const url = `/admin/discounts/${qs}`;

  const { data } = await api.get<AdminDiscount[] | AdminDiscountsResponse>(
    url,
    { signal }
  );

  if (Array.isArray(data)) {
    return data; // non-paginated backend
  }
  if (data && Array.isArray((data as AdminDiscountsResponse).results)) {
    return (data as AdminDiscountsResponse).results;
  }
  throw new Error("Unexpected discounts response shape");
};

const createDiscountRequest = async (data: Partial<AdminDiscount>) => {
  const res: AxiosResponse<AdminDiscount> = await api.post(
    "/admin/discounts/",
    data
  );
  return res.data;
};

const updateDiscountRequest = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<AdminDiscount>;
}) => {
  const res: AxiosResponse<AdminDiscount> = await api.patch(
    `/admin/discounts/${id}/`,
    data
  );
  return res.data;
};

const deleteDiscountRequest = async (id: number) => {
  const res: AxiosResponse<void> = await api.delete(`/admin/discounts/${id}/`);
  return res.data;
};

// --- Hook ---
export const useAdminDiscounts = (
  search?: string,
  filters?: Record<string, string>
) => {
  const queryClient = useQueryClient();

  // Build query params
  const queryParams: Record<string, string> = {};
  if (search) queryParams.search = search;
  if (filters) Object.assign(queryParams, filters);

  // Fetch ALL Discounts
  const discountsQuery = useQuery<AdminDiscount[], Error>({
    queryKey: ["adminDiscounts", search, filters],
    queryFn: () =>
      fetchAllAdminDiscounts(
        Object.keys(queryParams).length ? queryParams : undefined
      ),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  // Create
  const createDiscount = useMutation({
    mutationFn: createDiscountRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDiscounts"] });
    },
  });

  // Update
  const updateDiscount = useMutation({
    mutationFn: updateDiscountRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDiscounts"] });
    },
  });

  // Delete
  const deleteDiscount = useMutation({
    mutationFn: deleteDiscountRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDiscounts"] });
    },
  });

  return {
    discounts: discountsQuery.data ?? [],
    isLoading: discountsQuery.isLoading,
    isError: discountsQuery.isError,
    refetch: discountsQuery.refetch,
    createDiscount,
    updateDiscount,
    deleteDiscount,
  };
};