import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/components/utils/api';
import { useAppSelector } from '@/redux/hooks';

// --- Types ---
export interface Address {
  id: number;
  full_name: string;
  address_line: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
}

export interface PaginatedAddressResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Address[];
}

type CreateAddressPayload = Omit<Address, 'id'>;
type UpdateAddressPayload = Partial<CreateAddressPayload> & { id: number };

// --- API Calls ---
const fetchAddresses = async (): Promise<PaginatedAddressResponse> => {
  const res = await api.get(`/addresses/`, { withCredentials: true });
  return res.data;
};

const addAddress = async (payload: CreateAddressPayload): Promise<Address> => {
  const res = await api.post(`/addresses/`, payload, {
    withCredentials: true,
  });
  return res.data;
};

const updateAddress = async ({ id, ...payload }: UpdateAddressPayload): Promise<Address> => {
  const res = await api.patch(`/addresses/${id}/`, payload, {
    withCredentials: true,
  });
  return res.data;
};

const deleteAddress = async (id: number) => {
  const res = await api.delete(`/addresses/${id}/`, {
    withCredentials: true,
  });
  return res.data;
};

const setDefaultAddressRequest = async (id: number) => {
  await api.post(`/addresses/${id}/set-default/`, {}, {
    withCredentials: true,
  });
};

// --- Hook ---
export const useAddress = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  const addressQuery = useQuery<PaginatedAddressResponse>({
    queryKey: ['addresses'],
    queryFn: fetchAddresses,
    staleTime: 60 * 1000,
    enabled: isAuthenticated,
  });

  const create = useMutation({
    mutationFn: addAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  });

  const update = useMutation({
    mutationFn: updateAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  });

  const remove = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  });

  const setAsDefault = useMutation({
  mutationFn: setDefaultAddressRequest,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["addresses"] });
  },
});

  return {
    ...addressQuery,
    addAddress: create,
    updateAddress: update,
    deleteAddress: remove,
    setDefault: setAsDefault,
  };
};
