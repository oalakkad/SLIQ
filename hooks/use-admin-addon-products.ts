import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { api } from "@/components/utils/api";

/* =====================
 Types
===================== */

export interface AdminProduct {
  id: number;
  name: string;
  name_ar?: string;
  slug: string;
}

/* =====================
 API Calls
===================== */

// Fetch ALL products (admin)
const fetchAdminProducts = async (): Promise<AdminProduct[]> => {
  const res: AxiosResponse<AdminProduct[]> = await api.get("/admin/products/", {
    withCredentials: true,
  });

  return res.data;
};

// Fetch linked products for addon category
const fetchLinkedProducts = async (
  addonCategoryId: number,
): Promise<AdminProduct[]> => {
  const res: AxiosResponse<AdminProduct[]> = await api.get(
    `/admin/addon-categories/${addonCategoryId}/products/`,
    { withCredentials: true },
  );

  return res.data;
};

// Set product links
const setLinkedProducts = async ({
  addonCategoryId,
  productIds,
}: {
  addonCategoryId: number;
  productIds: number[];
}): Promise<void> => {
  await api.post(
    `/admin/addon-categories/${addonCategoryId}/products/set/`,
    { product_ids: productIds },
    { withCredentials: true },
  );
};

/* =====================
 Hooks
===================== */

export const useAllProducts = () =>
  useQuery<AdminProduct[], Error>({
    queryKey: ["adminProducts"],
    queryFn: fetchAdminProducts,
    staleTime: 60_000,
  });

export const useLinkedProducts = (addonCategoryId?: number) =>
  useQuery<AdminProduct[], Error>({
    queryKey: ["addonCategoryProducts", addonCategoryId],
    enabled: !!addonCategoryId,
    queryFn: () => fetchLinkedProducts(addonCategoryId as number),
    staleTime: 60_000,
  });

export const useSetLinkedProducts = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { addonCategoryId: number; productIds: number[] }
  >({
    mutationFn: setLinkedProducts,
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["addonCategoryProducts", vars.addonCategoryId],
      });
    },
  });
};
