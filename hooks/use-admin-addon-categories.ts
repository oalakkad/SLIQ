// hooks/use-admin-addon-categories.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { api } from "@/components/utils/api";

/* ============================
 * Types
 * ============================ */
export interface AdminAddonCategory {
  id: number;
  name: string;
  name_ar?: string;
  created_at?: string;
  updated_at?: string;
}

interface AdminAddonCategoriesResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: AdminAddonCategory[];
}

export interface CategoryItem {
  id: number;
  name: string;
  name_ar?: string;
  slug: string;
}

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

/* ============================
 * Low-level API calls
 * ============================ */

// Admin: CRUD addon categories
const fetchAdminAddonCategories = async (
  search?: string
): Promise<AdminAddonCategory[]> => {
  const res: AxiosResponse<AdminAddonCategoriesResponse> = await api.get(
    "/admin/addon-categories/",
    { params: search ? { search } : undefined, withCredentials: true }
  );
  return res.data.results;
};

const createAddonCategoryRequest = async (
  data: Partial<AdminAddonCategory>
): Promise<AdminAddonCategory> => {
  const res: AxiosResponse<AdminAddonCategory> = await api.post(
    "/admin/addon-categories/",
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
  const res: AxiosResponse<AdminAddonCategory> = await api.patch(
    `/admin/addon-categories/${id}/`,
    data,
    { withCredentials: true }
  );
  return res.data;
};

const deleteAddonCategoryRequest = async (id: number): Promise<void> => {
  await api.delete(`/admin/addon-categories/${id}/`, {
    withCredentials: true,
  });
};

// Public: list all product categories to assign (supports both array and paginated)
const fetchAllProductCategories = async (): Promise<CategoryItem[]> => {
  const res: AxiosResponse<CategoryItem[] | Paginated<CategoryItem>> =
    await api.get("/categories/");

  const data = res.data;
  if (Array.isArray(data)) {
    // unpaginated DRF response
    return data;
  }
  // paginated DRF response
  return data.results ?? [];
};

// Admin: linked product categories for a specific addon category
const fetchAddonCategoryLinkedProductCategories = async (
  addonCategoryId: number
): Promise<CategoryItem[]> => {
  const res: AxiosResponse<CategoryItem[]> = await api.get(
    `admin/addon-categories/${addonCategoryId}/product-categories/`,
    { withCredentials: true }
  );
  return res.data;
};

// Admin: assignment actions
const setAddonCategoryProductCategories = async ({
  addonCategoryId,
  categoryIds,
}: {
  addonCategoryId: number;
  categoryIds: number[];
}): Promise<void> => {
  await api.post(
    `/admin/addon-categories/${addonCategoryId}/product-categories/set/`,
    { category_ids: categoryIds },
    { withCredentials: true }
  );
};

const addAddonCategoryProductCategories = async ({
  addonCategoryId,
  categoryIds,
}: {
  addonCategoryId: number;
  categoryIds: number[];
}): Promise<void> => {
  await api.post(
    `/admin/addon-categories/${addonCategoryId}/product-categories/add/`,
    { category_ids: categoryIds },
    { withCredentials: true }
  );
};

const removeAddonCategoryProductCategories = async ({
  addonCategoryId,
  categoryIds,
}: {
  addonCategoryId: number;
  categoryIds: number[];
}): Promise<void> => {
  await api.post(
    `/admin/addon-categories/${addonCategoryId}/product-categories/remove/`,
    { category_ids: categoryIds },
    { withCredentials: true }
  );
};

/* ============================
 * Hooks
 * ============================ */

// Public: fetch all product categories (for checkboxes/select)
export const useAllProductCategories = () =>
  useQuery<CategoryItem[], Error>({
    queryKey: ["allProductCategories"],
    queryFn: fetchAllProductCategories,
    staleTime: 5 * 60_000,
  });

// Admin: fetch linked product categories for a given addon category
export const useLinkedProductCategories = (addonCategoryId?: number) =>
  useQuery<CategoryItem[], Error>({
    queryKey: ["addonCategoryProductCategories", addonCategoryId],
    queryFn: () =>
      fetchAddonCategoryLinkedProductCategories(addonCategoryId as number),
    enabled: !!addonCategoryId,
    staleTime: 60_000,
  });

// Admin: primary hook (list + CRUD + assignment mutations)
export const useAdminAddonCategories = (search?: string) => {
  const queryClient = useQueryClient();

  // List admin addon categories
  const query = useQuery<AdminAddonCategory[], Error>({
    queryKey: ["adminAddonCategories", search],
    queryFn: () => fetchAdminAddonCategories(search),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  // Create
  const createAddonCategory = useMutation<
    AdminAddonCategory,
    Error,
    Partial<AdminAddonCategory>
  >({
    mutationFn: createAddonCategoryRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAddonCategories"] });
    },
  });

  // Update
  const updateAddonCategory = useMutation<
    AdminAddonCategory,
    Error,
    { id: number; data: Partial<AdminAddonCategory> }
  >({
    mutationFn: updateAddonCategoryRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAddonCategories"] });
    },
  });

  // Delete
  const deleteAddonCategory = useMutation<void, Error, number>({
    mutationFn: deleteAddonCategoryRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAddonCategories"] });
    },
  });

  // Assignments
  const setLinkedProductCategories = useMutation<
    void,
    Error,
    { addonCategoryId: number; categoryIds: number[] }
  >({
    mutationFn: setAddonCategoryProductCategories,
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["addonCategoryProductCategories", vars.addonCategoryId],
      });
      queryClient.invalidateQueries({ queryKey: ["adminAddonCategories"] });
    },
  });

  const addLinkedProductCategories = useMutation<
    void,
    Error,
    { addonCategoryId: number; categoryIds: number[] }
  >({
    mutationFn: addAddonCategoryProductCategories,
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["addonCategoryProductCategories", vars.addonCategoryId],
      });
      queryClient.invalidateQueries({ queryKey: ["adminAddonCategories"] });
    },
  });

  const removeLinkedProductCategories = useMutation<
    void,
    Error,
    { addonCategoryId: number; categoryIds: number[] }
  >({
    mutationFn: removeAddonCategoryProductCategories,
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["addonCategoryProductCategories", vars.addonCategoryId],
      });
      queryClient.invalidateQueries({ queryKey: ["adminAddonCategories"] });
    },
  });

  return {
    // data
    categories: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,

    // actions
    refetch: query.refetch,
    createAddonCategory,
    updateAddonCategory,
    deleteAddonCategory,

    // assignment actions
    setLinkedProductCategories,
    addLinkedProductCategories,
    removeLinkedProductCategories,
  };
};
