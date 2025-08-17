import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

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
  price: string;
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


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export function useAdminProducts(search?: string) {
  const queryClient = useQueryClient();

  // 🔹 Fetch Products
  const { data: products = [], isLoading } = useQuery<AdminProduct[]>({
    queryKey: ["adminProducts", search],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/admin/products/`, {
        params: { search },
        withCredentials: true,
      });
      return res.data;
    },
  });

  // 🔹 Create Product
  const createProduct = useMutation({
    mutationFn: async (data: Partial<AdminProduct>) => {
      const res = await axios.post(`${API_URL}/admin/products/`, data, {
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
      const res = await axios.patch(`${API_URL}/admin/products/${id}/`, data, {
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
      await axios.delete(`${API_URL}/admin/products/${id}/`, {
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
      await axios.delete(
        `${API_URL}/admin/products/${productId}/images/${imageId}/`,
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
const setThumbnailImage = useMutation({
  mutationFn: async ({
    productId,
    imageId,
  }: {
    productId: number;
    imageId: number;
  }) => {
    const formData = new FormData();
    formData.append("image_id", imageId.toString());

    const res = await axios.post(
      `${API_URL}/admin/products/${productId}/set-thumbnail/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );

    return { image: res.data.image, imageId }; // Return structured response
  },
  onSuccess: (_, variables) => {
    queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    queryClient.invalidateQueries({
      queryKey: ["adminProduct", variables.productId],
    });
  },
});

  // 🔹 Upload Product Images
  const uploadProductImages = useMutation({
  mutationFn: async ({
    id,
    files,
  }: {
    id: number;
    files: File[];
  }) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const res = await axios.post(
      `${API_URL}/admin/products/${id}/upload-images/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );

    return res.data; // Should return UploadedImage[]
  },

  onSuccess: (_, variables) => {
    queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    queryClient.invalidateQueries({ queryKey: ["adminProduct", variables.id] });
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
