import { useQuery } from "@tanstack/react-query";
import { api } from "@/components/utils/api";
import { AxiosResponse } from "axios";

// --- Types ---
export interface AdminStatsResponse {
  users_count: number;
  orders_count: number;
  total_revenue: string; // Decimal as string from API
}

// --- API Request ---
const fetchAdminStats = async (signal?: AbortSignal): Promise<AdminStatsResponse> => {
  const res: AxiosResponse<AdminStatsResponse> = await api.get("/admin/stats/", { signal });
  return res.data;
};

// --- Hook ---
export const useAdminStats = () => {
  const statsQuery = useQuery<AdminStatsResponse, Error>({
    queryKey: ["adminStats"],
    queryFn: ({ signal }) => fetchAdminStats(signal),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  return {
    stats: statsQuery.data,                     // { users_count, orders_count, total_revenue }
    totalRevenueNumber: parseFloat(statsQuery.data?.total_revenue ?? "0"),
    isLoading: statsQuery.isLoading,
    isError: statsQuery.isError,
    refetch: statsQuery.refetch,
  };
};
