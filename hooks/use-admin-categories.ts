import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// --- Axios Instance with 401 Handling ---
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        // Try refreshing the session
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
export interface AdminCategory {
  id: number;
  name: string;
  name_ar?: string;
  slug: string;
  parent: number | null;
  created_at?: string;
  updated_at?: string;
}

interface AdminCategoriesResponse {
  count: number;
  results: AdminCategory[];
}

// --- API Requests ---
const fetchAdminCategories = async (
  params?: Record<string, string>
): Promise<AdminCategory[]> => {
  const res: AxiosResponse<AdminCategoriesResponse> = await api.get(
    `/admin/categories/`,
    { params }
  );
  return res.data.results;
};

const createCategoryRequest = async (
  data: Partial<AdminCategory>
): Promise<AdminCategory> => {
  const res: AxiosResponse<AdminCategory> = await api.post(`/admin/categories/`, data);
  return res.data;
};

const updateCategoryRequest = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<AdminCategory>;
}): Promise<AdminCategory> => {
  const res: AxiosResponse<AdminCategory> = await api.patch(
    `/admin/categories/${id}/`,
    data
  );
  return res.data;
};

const deleteCategoryRequest = async (id: number): Promise<void> => {
  await api.delete(`/admin/categories/${id}/`);
};

// --- Hook ---
export const useAdminCategories = (search?: string) => {
  const queryClient = useQueryClient();

  const queryParams: Record<string, string> = {};
  if (search) queryParams.search = search;

  // 🔹 Fetch Categories
  const categoriesQuery = useQuery<AdminCategory[], Error>({
    queryKey: ["adminCategories", search],
    queryFn: () =>
      fetchAdminCategories(
        Object.keys(queryParams).length ? queryParams : undefined
      ),
    staleTime: 60_000,
    refetchOnWindowFocus: true, // ✅ Auto-refetch after idle
    retry: 1, // ✅ Retry once on 401 refresh
  });

  // 🔹 Mutations
  const createCategory = useMutation<AdminCategory, Error, Partial<AdminCategory>>({
    mutationFn: createCategoryRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] }),
  });

  const updateCategory = useMutation<
    AdminCategory,
    Error,
    { id: number; data: Partial<AdminCategory> }
  >({
    mutationFn: updateCategoryRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] }),
  });

  const deleteCategory = useMutation<void, Error, number>({
    mutationFn: deleteCategoryRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] }),
  });

  return {
    categories: categoriesQuery.data ?? [],
    isLoading: categoriesQuery.isLoading,
    isError: categoriesQuery.isError,
    refetch: categoriesQuery.refetch,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
