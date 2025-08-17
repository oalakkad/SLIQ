import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { api } from "@/components/utils/api";

// --- Types ---
export interface AddonOption {
  id: number;
  name: string;
  name_ar?: string;
}

export interface Addon {
  id: number;
  name: string;
  name_ar?: string;
  price: string;
  allow_multiple_options: boolean;
  requires_custom_name: boolean;
  options: AddonOption[];
  category: number; // FK to AddonCategory
}

export interface AddonCategory {
  id: number;
  name: string;
  name_ar?: string;
  addons: Addon[];
}

interface AddonCategoryResponse {
  count: number;
  results: AddonCategory[];
}

// --- API Requests ---
const fetchAddonCategories = async (): Promise<AddonCategory[]> => {
  const res: AxiosResponse<AddonCategoryResponse> = await api.get(
    `/addons/categories/`,
    { withCredentials: true }
  );
  return res.data.results;
};

const createAddonCategory = async (
  data: Partial<AddonCategory>
): Promise<AddonCategory> => {
  const res: AxiosResponse<AddonCategory> = await api.post(
    "/addons/categories/",
    data,
    { withCredentials: true }
  );
  return res.data;
};

const updateAddonCategory = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<AddonCategory>;
}): Promise<AddonCategory> => {
  const res: AxiosResponse<AddonCategory> = await api.patch(
    `/addons/categories/${id}/`,
    data,
    { withCredentials: true }
  );
  return res.data;
};

const deleteAddonCategory = async (id: number): Promise<void> => {
  await api.delete(`/addons/categories/${id}/`, { withCredentials: true });
};

// --- Hook ---
export const useAddonCategories = () => {
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery<AddonCategory[], Error>({
    queryKey: ["addonCategories"],
    queryFn: fetchAddonCategories,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const createCategory = useMutation({
    mutationFn: createAddonCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addonCategories"] }),
  });

  const updateCategory = useMutation({
    mutationFn: updateAddonCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addonCategories"] }),
  });

  const deleteCategory = useMutation({
    mutationFn: deleteAddonCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addonCategories"] }),
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
