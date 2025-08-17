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
import { useEffect, useMemo, useState } from "react";
import { AdminProduct, useAdminProducts } from "@/hooks/use-admin-products";
import { FaTrash } from "react-icons/fa";

type Mode = "create" | "edit";

interface EditProductModalProps {
  product?: AdminProduct; // undefined in create mode
  mode?: Mode; // default "edit" when product provided
  isOpen: boolean;
  onClose: () => void;
}

type DisplayImage = {
  id: number; // server id OR negative temp id for previews
  image: string; // url or blob:
  alt_text?: string;
  is_thumbnail?: boolean;
  _isTemp?: boolean; // mark local previews before create
};

export default function EditProductModal({
  product,
  mode: incomingMode,
  isOpen,
  onClose,
}: EditProductModalProps) {
  const mode: Mode = incomingMode ?? (product ? "edit" : "create");
  const toast = useToast();

  const {
    createProduct,
    updateProduct,
    deleteProductImage,
    setThumbnailImage,
    uploadProductImages,
  } = useAdminProducts();

  // ---------- Local state ----------
  const [name, setName] = useState(product?.name ?? "");
  const [nameAr, setNameAr] = useState(product?.name_ar ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [descriptionAr, setDescriptionAr] = useState(
    product?.description_ar ?? ""
  );
  const [price, setPrice] = useState<number>(
    product ? parseFloat(product.price) : 0
  );
  const [stock, setStock] = useState<number>(product?.stock_quantity ?? 0);
  const [isNew, setIsNew] = useState<boolean>(product?.is_new_arrival ?? false);
  const [isBest, setIsBest] = useState<boolean>(
    product?.is_best_seller ?? false
  );

  const initialImages: DisplayImage[] = useMemo(() => {
    if (!product) return [];
    return (
      product.images?.map((img) => ({
        id: img.id,
        image: img.image,
        alt_text: img.alt_text,
        is_thumbnail: img.image === product.image,
      })) || []
    );
  }, [product]);

  const [images, setImages] = useState<DisplayImage[]>(initialImages);
  const [thumbnailId, setThumbnailId] = useState<number | null>(
    product
      ? product.images?.find((img) => img.image === product.image)?.id ?? null
      : null
  );

  // For CREATE: hold files to upload after create
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  // Reset state when modal opens or product changes
  useEffect(() => {
    if (!isOpen) return;
    setName(product?.name ?? "");
    setNameAr(product?.name_ar ?? "");
    setSlug(product?.slug ?? "");
    setDescription(product?.description ?? "");
    setDescriptionAr(product?.description_ar ?? "");
    setPrice(product ? parseFloat(product.price) : 0);
    setStock(product?.stock_quantity ?? 0);
    setIsNew(product?.is_new_arrival ?? false);
    setIsBest(product?.is_best_seller ?? false);

    const imgs: DisplayImage[] = product
      ? product.images?.map((img) => ({
          id: img.id,
          image: img.image,
          alt_text: img.alt_text,
          is_thumbnail: img.image === product.image,
        })) || []
      : [];

    setImages(imgs);
    setThumbnailId(
      product
        ? product.images?.find((i) => i.image === product.image)?.id ?? null
        : null
    );
    setPendingFiles([]);
  }, [product, isOpen]);

  // ---------- Actions ----------
  const handleSave = async () => {
    // Build payload (FormData for both cases to keep backend consistent)
    const formData = new FormData();
    formData.append("name", name);
    formData.append("name_ar", nameAr);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("description_ar", descriptionAr);
    formData.append("price", (Number.isFinite(price) ? price : 0).toFixed(3));
    formData.append(
      "stock_quantity",
      String(Number.isFinite(stock) ? stock : 0)
    );
    formData.append("is_new_arrival", isNew ? "1" : "0");
    formData.append("is_best_seller", isBest ? "1" : "0");

    try {
      if (mode === "edit" && product) {
        await updateProduct.mutateAsync({ id: product.id, data: formData });
        toast({ title: "Product updated successfully!", status: "success" });
        onClose();
        return;
      }

      // CREATE
      const created = await createProduct.mutateAsync(
        Object.fromEntries(formData as any)
      );
      // Upload any pending files after product exists
      if (pendingFiles.length > 0) {
        const uploaded = await uploadProductImages.mutateAsync({
          id: created.id,
          files: pendingFiles,
        });

        // If user pre-picked a thumbnail among temp previews, map by index
        const tempThumbIndex = images.findIndex(
          (img) => img._isTemp && img.is_thumbnail
        );
        if (
          tempThumbIndex >= 0 &&
          Array.isArray(uploaded) &&
          uploaded[tempThumbIndex]
        ) {
          const newThumbId = uploaded[tempThumbIndex].id;
          await setThumbnailImage.mutateAsync({
            productId: created.id,
            imageId: newThumbId,
          });
        }
      }

      toast({ title: "Product created successfully!", status: "success" });
      onClose();
    } catch (e) {
      toast({
        title:
          mode === "edit"
            ? "Failed to update product."
            : "Failed to create product.",
        status: "error",
      });
    }
  };

  // Delete image (edit mode) or remove temp (create mode)
  const handleDeleteImage = (imageId: number) => {
    // temp preview ids are negative
    if (mode === "create" && imageId < 0) {
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      // also remove corresponding file by its index
      const tempIndex = Math.abs(imageId) - 1;
      setPendingFiles((prev) => prev.filter((_, i) => i !== tempIndex));
      if (thumbnailId === imageId) setThumbnailId(null);
      return;
    }

    if (!product) return;
    deleteProductImage.mutate(
      { productId: product.id, imageId },
      {
        onSuccess: () => {
          setImages((prev) => prev.filter((img) => img.id !== imageId));
          if (thumbnailId === imageId) setThumbnailId(null);
        },
      }
    );
  };

  // Set thumbnail (edit: hit API immediately; create: mark temp)
  const handleSetThumbnail = (imageId: number) => {
    if (mode === "create") {
      setThumbnailId(imageId);
      setImages((prev) =>
        prev.map((img) => ({ ...img, is_thumbnail: img.id === imageId }))
      );
      return;
    }
    if (!product) return;

    // Optimistic update
    setThumbnailId(imageId);
    setImages((prev) =>
      prev.map((img) => ({ ...img, is_thumbnail: img.id === imageId }))
    );

    setThumbnailImage.mutate(
      { productId: product.id, imageId },
      {
        onError: () => {
          // revert
          const oldId =
            product.images?.find((img) => img.image === product.image)?.id ??
            null;
          setThumbnailId(oldId);
          setImages((prev) =>
            prev.map((img) => ({ ...img, is_thumbnail: img.id === oldId }))
          );
        },
      }
    );
  };

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  // Upload/select images
  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    if (mode === "edit" && product) {
      uploadProductImages.mutate(
        { id: product.id, files },
        {
          onSuccess: (uploadedImages) => {
            const items = Array.isArray(uploadedImages)
              ? uploadedImages
              : // backend returns { images: [...] } in some cases; keep safe:
                (uploadedImages as any)?.images || [];

            setImages((prev) => [
              ...prev,
              ...items.map((img: any) => ({ ...img, is_thumbnail: false })),
            ]);
            // no toast spam if you prefer; keep it:
            // toast({ title: "Images uploaded!", status: "success" });
          },
        }
      );
      return;
    }

    // CREATE mode: keep as previews & pending files
    const startIndex = pendingFiles.length;
    const tempPreviews: DisplayImage[] = files.map((file, idx) => ({
      id: -(startIndex + idx + 1), // negative temp id
      image: URL.createObjectURL(file),
      is_thumbnail: false,
      _isTemp: true,
    }));

    setPendingFiles((prev) => [...prev, ...files]);
    setImages((prev) => [...prev, ...tempPreviews]);
  };

  const isSubmitting =
    (mode === "edit" ? updateProduct.isPending : createProduct.isPending) ||
    setThumbnailImage.isPending ||
    uploadProductImages.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent maxH="90vh" overflowY="auto">
        <ModalHeader>
          {mode === "edit" ? "Edit Product" : "Add Product"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
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

            <FormControl isRequired>
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
              <FormControl isRequired>
                <FormLabel>Price</FormLabel>
                <NumberInput
                  min={0}
                  value={price}
                  onChange={(val) => setPrice(parseFloat(val || "0"))}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
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
              <FormLabel>
                {mode === "edit"
                  ? "Upload New Images"
                  : "Images (will upload after create)"}
              </FormLabel>
              <Input type="file" multiple onChange={handleNewImages} />
            </FormControl>

            <FormControl>
              <FormLabel>Product Images</FormLabel>
              <HStack wrap="wrap" spacing={4}>
                {images.map((img) => {
                  const src =
                    img.image.startsWith("http") ||
                    img.image.startsWith("blob:")
                      ? img.image
                      : `${BACKEND_URL}${img.image}`;
                  return (
                    <Box key={img.id} position="relative">
                      {/* Delete */}
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

                      {/* Thumbnail badge / action */}
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
                        src={src}
                        alt={img.alt_text || ""}
                        boxSize="150px"
                        objectFit="cover"
                        border={"1px solid"}
                        borderColor={"brand.500"}
                        borderRadius="md"
                      />
                    </Box>
                  );
                })}
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
            isLoading={isSubmitting}
          >
            {mode === "edit" ? "Save" : "Create"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
