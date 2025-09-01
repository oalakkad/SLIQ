import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/components/utils/api";
import { AxiosResponse } from "axios";

// --- Types ---
export interface AdminPayment {
  id: number;
  order: {
    id: number;
    total_price: string;
    status: string;
    created_at: string;
    user?: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
    } | null;
    guest_name?: string | null;
    guest_email?: string | null;
    guest_phone?: string | null;
  } | null;
  amount: string;
  currency: string;
  status: string;
  invoice_id?: string | null;
  payment_id?: string | null;
  method_id?: number | null;
  gateway_response?: any; // raw JSON from provider
  paid_at?: string | null;
  created_at: string;
  updated_at: string;
}

interface AdminPaymentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminPayment[];
}

// --- API Requests ---
const fetchAllAdminPayments = async (
  params?: Record<string, string>,
  signal?: AbortSignal
): Promise<AdminPayment[]> => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  const url = `/admin/payments/${qs}`;

  const { data } = await api.get<AdminPayment[] | AdminPaymentsResponse>(url, {
    signal,
  });

  if (Array.isArray(data)) {
    return data; // non-paginated backend
  }
  if (data && Array.isArray((data as AdminPaymentsResponse).results)) {
    return (data as AdminPaymentsResponse).results; // paginated backend
  }
  throw new Error("Unexpected payments response shape");
};

const updatePaymentRequest = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<AdminPayment>;
}) => {
  const res: AxiosResponse<AdminPayment> = await api.patch(
    `/admin/payments/${id}/`,
    data
  );
  return res.data;
};

const deletePaymentRequest = async (id: number) => {
  const res: AxiosResponse<void> = await api.delete(`/admin/payments/${id}/`);
  return res.data;
};

// --- Hook ---
export const useAdminPayments = (
  search?: string,
  filters?: Record<string, string>
) => {
  const queryClient = useQueryClient();

  const queryParams: Record<string, string> = {};
  if (search) queryParams.search = search;
  if (filters) Object.assign(queryParams, filters);

  const paymentsQuery = useQuery<AdminPayment[], Error>({
    queryKey: ["adminPayments", search, filters],
    queryFn: () =>
      fetchAllAdminPayments(
        Object.keys(queryParams).length ? queryParams : undefined
      ),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const updatePayment = useMutation({
    mutationFn: updatePaymentRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPayments"] });
    },
  });

  const deletePayment = useMutation({
    mutationFn: deletePaymentRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPayments"] });
    },
  });

  return {
    payments: paymentsQuery.data ?? [],
    isLoading: paymentsQuery.isLoading,
    isError: paymentsQuery.isError,
    refetch: paymentsQuery.refetch,
    updatePayment,
    deletePayment,
  };
};