import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { api } from "@/components/utils/api";

// --- Types ---
export interface AdminAddonOption {
  id?: number;
  name: string;
  name_ar?: string;
  price: number;
}

export interface AdminAddonCategory {
  id: number;
  name: string;
  name_ar?: string;
}

export interface AdminAddon {
  id: number;
  name: string;
  name_ar?: string;
  price: number;
  requires_custom_name: boolean;
  allow_multiple_options: boolean;
  categories: AdminAddonCategory[];
  options: AdminAddonOption[];
  created_at?: string;
  updated_at?: string;
}

interface AdminAddonsResponse {
  count: number;
  results: AdminAddon[];
}

// --- API Requests ---
const fetchAdminAddons = async (
  search?: string
): Promise<AdminAddon[]> => {
  const res: AxiosResponse<AdminAddonsResponse> = await api.get(
    "/admin/addons/",
    { params: search ? { search } : undefined, withCredentials: true }
  );
  return res.data.results;
};

const createAddonRequest = async (
  data: Partial<AdminAddon> & { category_ids?: number[] }
): Promise<AdminAddon> => {
  const res: AxiosResponse<AdminAddon> = await api.post(
    "/admin/addons/",
    data,
    { withCredentials: true }
  );
  return res.data;
};

const updateAddonRequest = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<AdminAddon> & { category_ids?: number[] };
}): Promise<AdminAddon> => {
  const res: AxiosResponse<AdminAddon> = await api.patch(
    `/admin/addons/${id}/`,
    data,
    { withCredentials: true }
  );
  return res.data;
};

const deleteAddonRequest = async (id: number): Promise<void> => {
  await api.delete(`/admin/addons/${id}/`, { withCredentials: true });
};

// --- Hook ---
export const useAdminAddons = (search?: string) => {
  const queryClient = useQueryClient();

  const addonsQuery = useQuery<AdminAddon[], Error>({
    queryKey: ["adminAddons", search],
    queryFn: () => fetchAdminAddons(search),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const createAddon = useMutation<AdminAddon, Error, Partial<AdminAddon> & { category_ids?: number[] }>({
    mutationFn: createAddonRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminAddons"] }),
  });

  const updateAddon = useMutation<
    AdminAddon,
    Error,
    { id: number; data: Partial<AdminAddon> & { category_ids?: number[] } }
  >({
    mutationFn: updateAddonRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminAddons"] }),
  });

  const deleteAddon = useMutation<void, Error, number>({
    mutationFn: deleteAddonRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminAddons"] }),
  });

  return {
    addons: addonsQuery.data ?? [],
    isLoading: addonsQuery.isLoading,
    isError: addonsQuery.isError,
    refetch: addonsQuery.refetch,
    createAddon,
    updateAddon,
    deleteAddon,
  };
};
