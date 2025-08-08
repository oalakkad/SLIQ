import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Address } from "./use-address";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// --- Axios Instance with Interceptor ---
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        // Attempt to refresh session
        await axios.post(`${API_URL}/auth/refresh/`, {}, { withCredentials: true });
        // Retry original request
        return api(error.config!);
      } catch (refreshError) {
        console.error("Session expired. Redirecting to login...");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

// --- Types ---
export interface AdminCustomer {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  address: Address[];
  date_joined: string; // ✅ API returns string
}

interface AdminCustomersResponse {
  count: number;
  results: AdminCustomer[];
}

// --- API Requests ---
const fetchAdminCustomers = async (
  params?: Record<string, string>
): Promise<AdminCustomer[]> => {
  const res: AxiosResponse<AdminCustomersResponse> = await api.get(
    `/admin/customers/`,
    { params }
  );
  return res.data.results;
};

const createCustomerRequest = async (data: Partial<AdminCustomer>) => {
  const res = await api.post(`/admin/customers/`, data);
  return res.data;
};

const updateCustomerRequest = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<AdminCustomer>;
}) => {
  const res = await api.patch(`/admin/customers/${id}/`, data);
  return res.data;
};

const deleteCustomerRequest = async (id: number) => {
  const res = await api.delete(`/admin/customers/${id}/`);
  return res.data;
};

// --- Hook ---
export const useAdminCustomers = (search?: string) => {
  const queryClient = useQueryClient();

  const queryParams: Record<string, string> = {};
  if (search) queryParams.search = search;

  // 🔹 Fetch Customers
  const customersQuery = useQuery<AdminCustomer[], Error>({
    queryKey: ["adminCustomers", search],
    queryFn: () =>
      fetchAdminCustomers(
        Object.keys(queryParams).length ? queryParams : undefined
      ),
    staleTime: 60_000,
    refetchOnWindowFocus: true, // ✅ Refetch after idle
    retry: 1, // ✅ Retry once if 401 is refreshed
  });

  // 🔹 Mutations
  const createCustomer = useMutation({
    mutationFn: createCustomerRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["adminCustomers"] }),
  });

  const updateCustomer = useMutation({
    mutationFn: updateCustomerRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["adminCustomers"] }),
  });

  const deleteCustomer = useMutation({
    mutationFn: deleteCustomerRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["adminCustomers"] }),
  });

  return {
    customers: customersQuery.data ?? [],
    isLoading: customersQuery.isLoading,
    isError: customersQuery.isError,
    refetch: customersQuery.refetch,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
};
