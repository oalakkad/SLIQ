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
import ReactSelect from "react-select";
import { FaTrash } from "react-icons/fa";

import { AdminProduct, useAdminProducts } from "@/hooks/use-admin-products";
import { useAdminCategories } from "@/hooks/use-admin-categories";

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
    createProduct, // JSON
    updateProduct, // JSON
    deleteProductImage,
    setThumbnailImage, // JSON: { image_id }, used in edit mode
    uploadProductImages, // multipart; should accept { id, files, thumbnailIndex? }
  } = useAdminProducts();

  // Categories
  const { categories, isLoading: isCategoriesLoading } = useAdminCategories();
  const categoryOptions = useMemo(
    () => (categories ?? []).map((c) => ({ value: c.id, label: c.name })),
    [categories]
  );

  // ---------- Local state ----------
  const [name, setName] = useState(product?.name ?? "");
  const [nameAr, setNameAr] = useState(product?.name_ar ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [descriptionAr, setDescriptionAr] = useState(
    product?.description_ar ?? ""
  );
  // price in AdminProduct is string; store as number in state
  const [price, setPrice] = useState<number>(product ? product.price || 0 : 0);
  const [stock, setStock] = useState<number>(product?.stock_quantity ?? 0);
  const [isNew, setIsNew] = useState<boolean>(product?.is_new_arrival ?? false);
  const [isBest, setIsBest] = useState<boolean>(
    product?.is_best_seller ?? false
  );

  const [selectedCategories, setSelectedCategories] = useState<
    Array<{ value: number; label: string }>
  >([]);

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
  // Index (in pendingFiles) of the pre-picked thumbnail (create mode)
  const [pendingThumbIndex, setPendingThumbIndex] = useState<number | null>(
    null
  );

  // Reset state when modal opens or product changes
  useEffect(() => {
    if (!isOpen) return;
    setName(product?.name ?? "");
    setNameAr(product?.name_ar ?? "");
    setSlug(product?.slug ?? "");
    setDescription(product?.description ?? "");
    setDescriptionAr(product?.description_ar ?? "");
    setPrice(product ? product.price || 0 : 0);
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
    setPendingThumbIndex(null);

    if (product?.categories?.length) {
      setSelectedCategories(
        product.categories.map((c) => ({ value: c.id, label: c.name }))
      );
    } else {
      setSelectedCategories([]);
    }
  }, [product, isOpen]);

  // ---------- Actions ----------
  const handleSave = async () => {
    // Build JSON payload for your serializer
    const payload = {
      name,
      name_ar: nameAr || undefined,
      slug,
      description: description || undefined,
      description_ar: descriptionAr || undefined,
      price: Number.isFinite(price) ? Number(price) : 0,
      stock_quantity: Number.isFinite(stock) ? Number(stock) : 0,
      is_new_arrival: !!isNew,
      is_best_seller: !!isBest,
      category_ids: selectedCategories.map((opt) => opt.value),
    };

    if (payload.category_ids.length === 0) {
      toast({
        title: "Please select at least one category.",
        status: "warning",
      });
      return;
    }

    try {
      if (mode === "edit" && product) {
        await updateProduct.mutateAsync({ id: product.id, data: payload });
        toast({ title: "Product updated successfully!", status: "success" });
        onClose();
        return;
      }

      // CREATE
      const created = await createProduct.mutateAsync(payload);

      // Upload any pending files after product exists
      if (pendingFiles.length > 0) {
        // ✅ Send thumbnail_index so backend sets the thumbnail atomically
        await uploadProductImages.mutateAsync({
          id: created.id,
          files: pendingFiles,
          thumbnailIndex: pendingThumbIndex ?? undefined,
        });
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
      const tempIndex = Math.abs(imageId) - 1;
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      setPendingFiles((prev) => prev.filter((_, i) => i !== tempIndex));
      if (pendingThumbIndex === tempIndex) setPendingThumbIndex(null);
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

  // Set thumbnail (edit: hit API immediately; create: mark temp + remember index)
  const handleSetThumbnail = (imageId: number) => {
    if (mode === "create") {
      setThumbnailId(imageId);
      setImages((prev) =>
        prev.map((img) => ({ ...img, is_thumbnail: img.id === imageId }))
      );
      if (imageId < 0) {
        const idx = Math.abs(imageId) - 1; // temp id -> index in pendingFiles
        setPendingThumbIndex(idx);
      } else {
        setPendingThumbIndex(null);
      }
      return;
    }
    if (!product) return;

    // Optimistic update for edit mode
    setThumbnailId(imageId);
    setImages((prev) =>
      prev.map((img) => ({ ...img, is_thumbnail: img.id === imageId }))
    );

    setThumbnailImage.mutate(
      { productId: product.id, imageId },
      {
        onError: () => {
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

            {/* ✅ Categories multi-select (JSON) */}
            <FormControl isRequired>
              <FormLabel>Categories</FormLabel>
              <ReactSelect
                isMulti
                options={categoryOptions}
                isLoading={isCategoriesLoading}
                value={selectedCategories}
                onChange={(vals) => setSelectedCategories(vals as any)}
                placeholder="Select categories..."
                classNamePrefix="rs"
              />
            </FormControl>

            <FormControl>
              <FormLabel>
                {mode === "edit"
                  ? "Upload New Images"
                  : "Images (will upload after create)"}
              </FormLabel>
              <Input
                type="file"
                multiple
                onChange={(e) => {
                  if (!e.target.files) return;
                  const files = Array.from(e.target.files);

                  if (mode === "edit" && product) {
                    uploadProductImages.mutate(
                      { id: product.id, files },
                      {
                        onSuccess: (uploadedImages) => {
                          const items = Array.isArray(uploadedImages)
                            ? uploadedImages
                            : (uploadedImages as any)?.images || [];
                          setImages((prev) => [
                            ...prev,
                            ...items.map((img: any) => ({
                              ...img,
                              is_thumbnail: false,
                            })),
                          ]);
                        },
                      }
                    );
                    return;
                  }

                  // CREATE mode: previews & queue files
                  const startIndex = pendingFiles.length;
                  const tempPreviews: DisplayImage[] = files.map(
                    (file, idx) => ({
                      id: -(startIndex + idx + 1),
                      image: URL.createObjectURL(file),
                      is_thumbnail: false,
                      _isTemp: true,
                    })
                  );

                  setPendingFiles((prev) => [...prev, ...files]);
                  setImages((prev) => [...prev, ...tempPreviews]);
                }}
              />
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
                        onClick={() => {
                          // temp preview?
                          if (mode === "create" && img.id < 0) {
                            const tempIndex = Math.abs(img.id) - 1;
                            setImages((prev) =>
                              prev.filter((i) => i.id !== img.id)
                            );
                            setPendingFiles((prev) =>
                              prev.filter((_, i) => i !== tempIndex)
                            );
                            if (pendingThumbIndex === tempIndex)
                              setPendingThumbIndex(null);
                            if (thumbnailId === img.id) setThumbnailId(null);
                            return;
                          }
                          if (!product) return;
                          deleteProductImage.mutate(
                            { productId: product.id, imageId: img.id },
                            {
                              onSuccess: () => {
                                setImages((prev) =>
                                  prev.filter((i) => i.id !== img.id)
                                );
                                if (thumbnailId === img.id)
                                  setThumbnailId(null);
                              },
                            }
                          );
                        }}
                        aria-label="Delete Image"
                      />

                      {img.is_thumbnail ? (
                        <Badge
                          position="absolute"
                          top="2"
                          right="2"
                          colorScheme="green"
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
