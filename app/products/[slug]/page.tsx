"use client";

import {
  Box,
  Flex,
  Image,
  Text,
  VStack,
  HStack,
  Button,
  IconButton,
  useMediaQuery,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";
import { useProduct } from "@/hooks/use-products";
import { useParams } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import AddonsModal from "@/components/common/AddonsModal";

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { data: product, isLoading } = useProduct(slug);
  const { addToCart, data: cart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(product?.image ?? "");
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const isArabic = useAppSelector((state) => state.lang.isArabic);

  const {
    isOpen: isAddonOpen,
    onOpen: onAddonOpen,
    onClose: onAddonClose,
  } = useDisclosure();

  const [selectedProduct, setSelectedProduct] = useState<null | {
    id: number;
    slug: string;
    name: string;
  }>(null);
  const openAddons = (p: { id: number; slug: string; name: string }) => {
    setSelectedProduct(p);
    onAddonOpen();
  };

  const headingFont = isArabic
    ? "var(--font-cairo), sans-serif"
    : "var(--font-readex-pro), sans-serif";

  const bodyFont = isArabic
    ? "var(--font-cairo), serif"
    : "var(--font-work-sans), serif";

  useEffect(() => {
    if (product?.image) {
      setImage(product.image);
    }
  }, [product]);

  const isInCart = useMemo(() => {
    return cart?.items?.some((item) => item.product?.id === product?.id);
  }, [cart, product]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Spinner color="brand.pink" size="xl" />
      </Flex>
    );
  }

  return (
    <Flex
      direction={isMobile ? "column" : "row"}
      gap={10}
      px={isMobile ? 4 : 20}
      py={10}
      alignItems={isMobile ? "center" : "start"}
      fontFamily={bodyFont}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Image Section */}
      <VStack flex={1} spacing={4} align="center">
        <Image
          src={image}
          alt={product?.name}
          maxW={isMobile ? "100%" : "400px"}
          h={"400px"}
          objectFit={"contain"}
          borderRadius="md"
        />
        <HStack spacing={2} justify="center" flexWrap="wrap">
          {product?.images?.map((img, index) => (
            <Image
              key={index}
              border={img.image === image ? "2px solid pink" : "2px solid grey"}
              onClick={() => setImage(img.image)}
              src={img.image}
              alt={`thumb-${index}`}
              _hover={{ filter: "brightness(1.05);" }}
              cursor={"pointer"}
              boxSize="60px"
              borderRadius="md"
              objectFit="cover"
            />
          ))}
        </HStack>
      </VStack>

      {/* Details Section */}
      <Box flex={1}>
        <Text fontSize="sm" color="gray.600" fontWeight="bold">
          {isArabic ? "إصدار محدود" : "LIMITED EDITION"}
        </Text>
        <Text fontSize="2xl" fontWeight="bold" mt={2} fontFamily={headingFont}>
          {isArabic ? product?.name_ar : product?.name}
        </Text>
        <HStack spacing={3} mt={1}>
          <Text fontSize="xl" fontWeight="semibold">
            {Number(product?.price).toFixed(3)}{" "}
            {isArabic ? "دينار كويتي" : "KWD"}
          </Text>
        </HStack>

        <Text mt={6} fontWeight="medium">
          {isArabic ? "الكمية" : "QUANTITY"}
        </Text>
        <HStack
          mt={2}
          flexDir={isArabic ? "row-reverse" : "row"}
          justifyContent={isArabic ? "right" : "left"}
        >
          <Button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
            -
          </Button>
          <Text>{quantity}</Text>
          <Button onClick={() => setQuantity((q) => q + 1)}>+</Button>
        </HStack>

        <Button
          mt={6}
          w="full"
          bg={isInCart ? "gray.400" : "gray.700"}
          color="white"
          _hover={{ bg: isInCart ? "gray.400" : "gray.800" }}
          onClick={() =>
            openAddons({
              id: product?.id ?? -1,
              slug: product?.slug ?? "",
              name: product?.name ?? "",
            })
          }
          disabled={isInCart}
          py={6}
          fontSize="sm"
        >
          {isArabic
            ? isInCart
              ? "في السلة"
              : "أضف إلى الحقيبة"
            : isInCart
            ? "IN CART"
            : "ADD TO BAG"}
        </Button>

        <Button leftIcon={<FiHeart />} variant="ghost" mt={2} w={"full"}>
          {isArabic ? "أضف إلى المفضلة" : "Add to Wishlist"}
        </Button>

        <Text mt={6} fontSize="sm" color="gray.700">
          {isArabic
            ? "امنح شعرك لمسة ساحرة. زيني تسريحاتك أثناء التنقل بأكثر القطع المطلوبة سهولة وجمالاً."
            : "Give the gift of heavenly hair. Elevate your on-the-go hairstyles with our most effortless and desired pieces."}
        </Text>

        <VStack spacing={1} align="start" mt={4} fontSize="sm">
          <Text fontWeight="bold">{isArabic ? "الوصف" : "Description"}</Text>
        </VStack>
      </Box>
      <AddonsModal
        isOpen={isAddonOpen}
        onClose={onAddonClose}
        productSlug={selectedProduct !== null ? selectedProduct.slug : ""}
        onConfirm={(selection) => {
          // shape 'selection' per your API (addonId, optionIds, customName, etc.)
          addToCart.mutate({
            product_id: selectedProduct !== null ? selectedProduct.id : -1,
            quantity: 1,
            addons: selection.map((s) => ({
              category_id: s.categoryId,
              addon_id: s.addonId!, // you’ll have ensured one is chosen
              option_ids: s.optionIds,
              custom_name: s.customName ?? null,
            })),
          });
          onAddonClose();
        }}
        title={isArabic ? "خصّصي شباصتك" : "Customize your clip"}
      />
    </Flex>
  );
}
