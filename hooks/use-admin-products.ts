import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/components/utils/api";

export interface ProductImage {
  id: number;
  product: number;
  image: string;
  alt_text: string;
}

export interface AdminProduct {
  id: number;
  name: string;
  name_ar?: string;
  slug: string;
  description?: string;
  description_ar?: string;
  price: number;
  stock_quantity: number;
  image: string; // Thumbnail
  is_new_arrival: boolean;
  is_best_seller: boolean;
  categories: { id: number; name: string; name_ar?: string }[];
  images: ProductImage[];
  created_at: string;
  updated_at: string;
}

export type UpdateProductPayload = {
  id: number;
  data: Partial<AdminProduct> | FormData;
};

type UploadImagesVars = {
  id: number;
  files: File[];
  thumbnailIndex?: number; // 👈 new
};
type SetThumbVars = { productId: number; imageId: number };
type SetThumbResp = { status: string; thumbnail_url: string };
type UploadImagesResp = any;

export function useAdminProducts(search?: string) {
  const queryClient = useQueryClient();

  // 🔹 Fetch Products
  const { data: products = [], isLoading } = useQuery<AdminProduct[]>({
    queryKey: ["adminProducts", search],
    queryFn: async () => {
      const res = await api.get("/admin/products/", {
        params: { search },
        withCredentials: true,
      });
      return res.data;
    },
  });

  // 🔹 Create Product
  const createProduct = useMutation({
    mutationFn: async (data: Partial<AdminProduct>) => {
      const res = await api.post("/admin/products/", data, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] }),
  });

  // 🔹 Update Product
  const updateProduct = useMutation({
    mutationFn: async ({
      id,
      data,
    }: UpdateProductPayload) => {
      const res = await api.patch(`/admin/products/${id}/`, data, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] }),
  });

  // 🔹 Delete Product
  const deleteProduct = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/products/${id}/`, {
        withCredentials: true,
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] }),
  });

  // 🔹 Delete Product Image
  const deleteProductImage = useMutation({
    mutationFn: async ({
      productId,
      imageId,
    }: {
      productId: number;
      imageId: number;
    }) => {
      await api.delete(
        `/admin/products/${productId}/images/${imageId}/`,
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({
        queryKey: ["adminProduct", variables.productId],
      });
    },
  });

  // 🔹 Set Thumbnail Image
const setThumbnailImage = useMutation<SetThumbResp, Error, SetThumbVars>({
  mutationFn: async ({ productId, imageId }) => {
    const res = await api.post(`/admin/products/${productId}/set-thumbnail/`, {
      image_id: imageId,
    });
    return res.data as SetThumbResp;
  },
  onSuccess: (_, vars) => {
    queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    queryClient.invalidateQueries({ queryKey: ["adminProduct", vars.productId] });
  },
});

  // 🔹 Upload Product Images
  const uploadProductImages = useMutation<UploadImagesResp, Error, UploadImagesVars>({
  mutationFn: async ({ id, files, thumbnailIndex }) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (thumbnailIndex !== undefined && thumbnailIndex !== null) {
      formData.append("thumbnail_index", String(thumbnailIndex));
    }

    const res = await api.post(`/admin/products/${id}/upload-images/`, formData);
    return res.data as UploadImagesResp;
  },
  onSuccess: (_, vars) => {
    queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    queryClient.invalidateQueries({ queryKey: ["adminProduct", vars.id] });
  },
});

  return {
    products,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteProductImage,
    setThumbnailImage,
    uploadProductImages,
  };
}
