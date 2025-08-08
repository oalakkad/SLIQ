"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  Switch,
  VStack,
  HStack,
  Image,
  Box,
  IconButton,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AdminProduct, useAdminProducts } from "@/hooks/use-admin-products";
import { FaTrash } from "react-icons/fa";

interface EditProductModalProps {
  product: AdminProduct;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProductModal({
  product,
  isOpen,
  onClose,
}: EditProductModalProps) {
  const toast = useToast();
  const {
    updateProduct,
    deleteProductImage,
    setThumbnailImage,
    uploadProductImages,
  } = useAdminProducts();

  // 🔹 Local state
  const [name, setName] = useState(product.name);
  const [nameAr, setNameAr] = useState(product.name_ar ?? "");
  const [slug, setSlug] = useState(product.slug);
  const [description, setDescription] = useState(product.description ?? "");
  const [descriptionAr, setDescriptionAr] = useState(
    product.description_ar ?? ""
  );
  const [price, setPrice] = useState(parseFloat(product.price));
  const [stock, setStock] = useState(product.stock_quantity);
  const [isNew, setIsNew] = useState(product.is_new_arrival);
  const [isBest, setIsBest] = useState(product.is_best_seller);
  const [images, setImages] = useState(
    product.images?.map((img) => ({
      ...img,
      is_thumbnail: img.image === product.image,
    })) || []
  );
  const [thumbnailId, setThumbnailId] = useState<number | null>(
    product.images?.find((img) => img.image === product.image)?.id ?? null
  );

  // 🔹 Reset modal state on open
  useEffect(() => {
    if (product) {
      setName(product.name);
      setNameAr(product.name_ar ?? "");
      setSlug(product.slug);
      setDescription(product.description ?? "");
      setDescriptionAr(product.description_ar ?? "");
      setPrice(parseFloat(product.price));
      setStock(product.stock_quantity);
      setIsNew(product.is_new_arrival);
      setIsBest(product.is_best_seller);
      setImages(
        product.images?.map((img) => ({
          ...img,
          is_thumbnail: img.image === product.image,
        })) || []
      );
      setThumbnailId(
        product.images?.find((img) => img.image === product.image)?.id ?? null
      );
    }
  }, [product, isOpen]);

  // 🔹 Handle Save
  const handleSave = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("name_ar", nameAr);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("description_ar", descriptionAr);
    formData.append("price", price.toFixed(3));
    formData.append("stock_quantity", stock.toString());
    formData.append("is_new_arrival", isNew ? "1" : "0");
    formData.append("is_best_seller", isBest ? "1" : "0");

    updateProduct.mutate(
      { id: product.id, data: formData },
      {
        onSuccess: () => {
          toast({ title: "Product updated successfully!", status: "success" });
          onClose();
        },
        onError: () => {
          toast({ title: "Failed to update product.", status: "error" });
        },
      }
    );
  };

  // 🔹 Handle Image Delete
  const handleDeleteImage = (imageId: number) => {
    deleteProductImage.mutate(
      { productId: product.id, imageId },
      {
        onSuccess: () => {
          toast({ title: "Image deleted.", status: "success" });
          setImages((prev) => prev.filter((img) => img.id !== imageId));
          if (thumbnailId === imageId) {
            setThumbnailId(null);
          }
        },
      }
    );
  };

  // 🔹 Handle Set Thumbnail
  const handleSetThumbnail = (imageId: number) => {
    // Optimistic UI update
    setThumbnailId(imageId);
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        is_thumbnail: img.id === imageId,
      }))
    );

    setThumbnailImage.mutate(
      { productId: product.id, imageId },
      {
        onSuccess: () => {
          toast({ title: "Thumbnail updated!", status: "success" });
        },
        onError: () => {
          toast({ title: "Failed to update thumbnail.", status: "error" });
          // Revert to original thumbnail
          const oldThumbnailId =
            product.images?.find((img) => img.image === product.image)?.id ??
            null;
          setThumbnailId(oldThumbnailId);
          setImages((prev) =>
            prev.map((img) => ({
              ...img,
              is_thumbnail: img.id === oldThumbnailId,
            }))
          );
        },
      }
    );
  };

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  // 🔹 Handle New Images (Instant Upload)
  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    uploadProductImages.mutate(
      { id: product.id, files },
      {
        onSuccess: (uploadedImages) => {
          // ✅ Ensure we use the actual server response
          const newImgs = Array.isArray(uploadedImages)
            ? uploadedImages
            : uploadedImages.images || [];

          setImages((prev) => [
            ...prev,
            ...newImgs.map((img: any) => ({
              ...img,
              is_thumbnail: false,
            })),
          ]);

          toast({ title: "Images uploaded!", status: "success" });
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent maxH="90vh" overflowY="auto">
        <ModalHeader>Edit Product</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Product Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>

            <FormControl>
              <FormLabel>Product Name (Arabic)</FormLabel>
              <Input
                value={nameAr}
                dir="rtl"
                onChange={(e) => setNameAr(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Slug</FormLabel>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description (Arabic)</FormLabel>
              <Textarea
                value={descriptionAr}
                dir="rtl"
                onChange={(e) => setDescriptionAr(e.target.value)}
              />
            </FormControl>

            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Price</FormLabel>
                <NumberInput
                  min={0}
                  value={price}
                  onChange={(val) => setPrice(parseFloat(val || "0"))}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Stock Quantity</FormLabel>
                <NumberInput
                  min={0}
                  value={stock}
                  onChange={(val) => setStock(parseInt(val || "0"))}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </HStack>

            <HStack spacing={4}>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">New Arrival</FormLabel>
                <Switch
                  isChecked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Best Seller</FormLabel>
                <Switch
                  isChecked={isBest}
                  onChange={(e) => setIsBest(e.target.checked)}
                />
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel>Upload New Images</FormLabel>
              <Input type="file" multiple onChange={handleNewImages} />
            </FormControl>

            <FormControl>
              <FormLabel>Product Images</FormLabel>
              <HStack wrap="wrap" spacing={4}>
                {images.map((img) => (
                  <Box key={img.id} position="relative">
                    {/* Delete button */}
                    <IconButton
                      icon={<FaTrash />}
                      size="sm"
                      bg={"transparent"}
                      border={"1px solid"}
                      borderColor={"gray.700"}
                      color={"gray.700"}
                      _hover={{ color: "white", bg: "gray.700" }}
                      position="absolute"
                      bottom="2"
                      right="2"
                      onClick={() => handleDeleteImage(img.id)}
                      aria-label="Delete Image"
                    />

                    {/* Thumbnail badge */}
                    {img.is_thumbnail ? (
                      <Badge
                        position="absolute"
                        top="2"
                        right="2"
                        colorScheme="green"
                        cursor={"default"}
                      >
                        Thumbnail
                      </Badge>
                    ) : (
                      <Badge
                        position="absolute"
                        top="1"
                        right="1"
                        onClick={() => handleSetThumbnail(img.id)}
                        transition={"0.3s all ease-in-out"}
                        color={"gray.700"}
                        border={"1px solid"}
                        borderColor={"gray.700"}
                        _hover={{ color: "white", bg: "gray.700" }}
                        bg={"transparent"}
                        cursor={"pointer"}
                      >
                        Set as Thumbnail
                      </Badge>
                    )}

                    <Image
                      src={
                        img.image.startsWith("http")
                          ? img.image
                          : `${BACKEND_URL}${img.image}`
                      }
                      alt={img.alt_text || ""}
                      boxSize="150px"
                      objectFit="cover"
                      border={"1px solid"}
                      borderColor={"brand.500"}
                      borderRadius="md"
                    />
                  </Box>
                ))}
              </HStack>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSave}
            isLoading={updateProduct.isPending}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
