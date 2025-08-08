import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

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
  category: number;
}

export interface AddonCategory {
  id: number;
  name: string;
  name_ar?: string;
  addons: Addon[];
}

// --- API Request ---
const fetchProductAddons = async (productId: number): Promise<AddonCategory[]> => {
  const res: AxiosResponse<AddonCategory[]> = await axios.get(
    `${API_URL}/products/${productId}/addons/`,
    { withCredentials: true }
  );
  return res.data;
};

// --- Hook ---
export const useProductAddons = (productId: number) => {
  return useQuery<AddonCategory[], Error>({
    queryKey: ["productAddons", productId],
    queryFn: () => fetchProductAddons(productId),
    enabled: !!productId,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
};
