import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { api } from "@/components/utils/api";

// --- Types ---
export interface AddonOption {
  id: number;
  name: string;
  name_ar?: string;
  price: string; // coming from Decimal in DRF; keep as string to avoid float issues
}

export interface Addon {
  id: number;
  name: string;
  name_ar?: string;
  price: string; // base price of addon (can be "0.000")
  allow_multiple_options: boolean;
  requires_custom_name: boolean;
  options: AddonOption[];
}

export interface AddonCategory {
  id: number;
  name: string;
  name_ar?: string;
  addons: Addon[];
}

// --- API Request ---
const fetchProductAddonsBySlug = async (slug: string): Promise<AddonCategory[]> => {
  const res: AxiosResponse<AddonCategory[]> = await api.get(
    `/products/${slug}/addons/`,
    { withCredentials: true }
  );
  return res.data;
};

// --- Hook ---
export const useProductAddons = (slug?: string) => {
  return useQuery<AddonCategory[], Error>({
    queryKey: ["productAddons", slug],
    queryFn: () => fetchProductAddonsBySlug(slug as string),
    enabled: !!slug,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
};
