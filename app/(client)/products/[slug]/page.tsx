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
import { AnimatePresence, motion } from "framer-motion";
import { useProduct } from "@/hooks/use-products";
import { useParams } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import AddonsModal from "@/components/common/AddonsModal";
import { useWishlist } from "@/hooks/use-wishlist";

const MotionText = motion(Text);

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
    if (product?.image) setImage(product.image);
  }, [product]);

  const { data: wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isInCart = useMemo(
    () => cart?.items?.some((item) => item.product?.id === product?.id),
    [cart, product]
  );

  const isInWishlist = useMemo(
    () => wishlist?.results?.some((item) => item.product?.id === product?.id),
    [wishlist, product]
  );

  const wishlistId = useMemo(
    () =>
      wishlist?.results.find((item) => item.product?.id === product?.id)?.id,
    [wishlist, product]
  );

  // 🟢 Hover state for animated button
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  // 🟣 Dynamic button label (Arabic + English)
  const buttonLabel = useMemo(() => {
    if (product?.stock_quantity === 0)
      return isArabic ? "غير متوفر" : "OUT OF STOCK";

    if (isInCart)
      return isHoveringButton
        ? isArabic
          ? "أضف المزيد"
          : "ADD MORE"
        : isArabic
        ? "في السلة"
        : "IN CART";

    return isArabic ? "أضف إلى الحقيبة" : "ADD TO BAG";
  }, [isArabic, isInCart, isHoveringButton, product?.stock_quantity]);

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
      {/* 🖼️ Image Section */}
      <VStack flex={1} spacing={4} align="center">
        <Image
          src={image}
          alt={product?.name}
          maxW={isMobile ? "100%" : "400px"}
          minW={"400px"}
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
              _hover={{ filter: "brightness(1.05)" }}
              cursor={"pointer"}
              boxSize="60px"
              borderRadius="md"
              objectFit="cover"
            />
          ))}
        </HStack>
      </VStack>

      {/* 🧾 Details Section */}
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

        {/* Quantity */}
        <Text mt={6} fontWeight="medium">
          {isArabic ? "الكمية" : "QUANTITY"}
        </Text>
        <HStack
          mt={2}
          flexDir={isArabic ? "row-reverse" : "row"}
          justifyContent={isArabic ? "right" : "left"}
        >
          <Button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            variant="ghost"
          >
            -
          </Button>
          <Text>{quantity}</Text>
          <Button onClick={() => setQuantity((q) => q + 1)} variant="ghost">
            +
          </Button>
        </HStack>

        {/* 🛍️ Add to Cart Button with Animation */}
        <Box
          mt={6}
          onMouseEnter={() => setIsHoveringButton(true)}
          onMouseLeave={() => setIsHoveringButton(false)}
        >
          <Button
            w="full"
            bg={
              product?.stock_quantity === 0
                ? "gray.400"
                : isInCart
                ? "gray.500"
                : "gray.700"
            }
            color="white"
            _hover={{
              bg:
                product?.stock_quantity === 0
                  ? "gray.400"
                  : isInCart
                  ? "gray.500"
                  : "gray.800",
            }}
            onClick={() => {
              if (product?.stock_quantity === 0) return;
              openAddons({
                id: product?.id ?? -1,
                slug: product?.slug ?? "",
                name: product?.name ?? "",
              });
            }}
            py={6}
            fontSize="sm"
            fontFamily={headingFont}
          >
            <AnimatePresence mode="wait" initial={false}>
              <MotionText
                key={buttonLabel}
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {buttonLabel}
              </MotionText>
            </AnimatePresence>
          </Button>
        </Box>

        {/* ❤️ Wishlist */}
        <Button
          leftIcon={<FiHeart />}
          variant="ghost"
          bg={isInWishlist ? "brand.pink" : "transparent"}
          _hover={{ bg: "brandPink.600", color: "gray.700" }}
          mt={2}
          w="full"
          onClick={
            isInWishlist
              ? () => removeFromWishlist.mutate(wishlistId ?? -1)
              : () => addToWishlist.mutate({ product: product?.id ?? -1 })
          }
        >
          {isInWishlist
            ? isArabic
              ? "في قائمة الرغبات"
              : "In Wishlist"
            : isArabic
            ? "أضف إلى الرغبات"
            : "Add to Wishlist"}
        </Button>

        {/* 📜 Description */}
        <Text mt={6} fontSize="sm" color="gray.700">
          {isArabic
            ? "امنح شعرك لمسة ساحرة. زيني تسريحاتك أثناء التنقل بأكثر القطع المطلوبة سهولة وجمالاً."
            : "Give the gift of heavenly hair. Elevate your on-the-go hairstyles with our most effortless and desired pieces."}
        </Text>

        <VStack spacing={1} align="start" mt={4} fontSize="sm">
          <Text fontWeight="bold">{isArabic ? "الوصف" : "Description"}</Text>
        </VStack>
      </Box>

      {/* Addons Modal */}
      <AddonsModal
        isOpen={isAddonOpen}
        onClose={onAddonClose}
        productSlug={selectedProduct?.slug ?? ""}
        onConfirm={(selection) => {
          addToCart.mutate({
            product_id: selectedProduct?.id ?? -1,
            quantity,
            addons: selection.map((s) => ({
              category_id: s.categoryId,
              addon_id: s.addonId!,
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
