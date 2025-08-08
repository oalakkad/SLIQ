import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface AdminAddonCategory {
  id: number;
  name: string;
  name_ar?: string;
  created_at?: string;
  updated_at?: string;
}

interface AdminAddonCategoriesResponse {
  count: number;
  results: AdminAddonCategory[];
}

// --- API Requests ---
const fetchAdminAddonCategories = async (
  search?: string
): Promise<AdminAddonCategory[]> => {
  const res: AxiosResponse<AdminAddonCategoriesResponse> = await axios.get(
    `${API_URL}/admin/addon-categories/`,
    { params: search ? { search } : undefined, withCredentials: true }
  );
  return res.data.results;
};

const createAddonCategoryRequest = async (
  data: Partial<AdminAddonCategory>
): Promise<AdminAddonCategory> => {
  const res: AxiosResponse<AdminAddonCategory> = await axios.post(
    `${API_URL}/admin/addon-categories/`,
    data,
    { withCredentials: true }
  );
  return res.data;
};

const updateAddonCategoryRequest = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<AdminAddonCategory>;
}): Promise<AdminAddonCategory> => {
  const res: AxiosResponse<AdminAddonCategory> = await axios.patch(
    `${API_URL}/admin/addon-categories/${id}/`,
    data,
    { withCredentials: true }
  );
  return res.data;
};

const deleteAddonCategoryRequest = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/admin/addon-categories/${id}/`, {
    withCredentials: true,
  });
};

// --- Hook ---
export const useAdminAddonCategories = (search?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery<AdminAddonCategory[], Error>({
    queryKey: ["adminAddonCategories", search],
    queryFn: () => fetchAdminAddonCategories(search),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const createAddonCategory = useMutation<
    AdminAddonCategory,
    Error,
    Partial<AdminAddonCategory>
  >({
    mutationFn: createAddonCategoryRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminAddonCategories"] }),
  });

  const updateAddonCategory = useMutation<
    AdminAddonCategory,
    Error,
    { id: number; data: Partial<AdminAddonCategory> }
  >({
    mutationFn: updateAddonCategoryRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminAddonCategories"] }),
  });

  const deleteAddonCategory = useMutation<void, Error, number>({
    mutationFn: deleteAddonCategoryRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminAddonCategories"] }),
  });

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    createAddonCategory,
    updateAddonCategory,
    deleteAddonCategory,
  };
};
