"use client";

import {
  Box,
  Text,
  Image,
  Button,
  Stack,
  IconButton,
  Flex,
  useMediaQuery,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Product } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/hooks/use-wishlist";
import { useAppSelector } from "@/redux/hooks";

const MotionBox = motion(Box);
const MotionText = motion(Text);

export interface FeaturedCardProps {
  product: Product;
  height: number;
  isWishlist: boolean;
  wishlistItemId: number;
  onCustomize?: () => void;
}

export default function FeaturedCard({
  product,
  height,
  isWishlist,
  wishlistItemId,
  onCustomize,
}: FeaturedCardProps) {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  const { data: cart } = useCart();
  const { addToWishlist, removeFromWishlist } = useWishlist();
  const router = useRouter();

  const isArabic = useAppSelector((state) => state.lang.isArabic);
  const headingFont = isArabic
    ? "var(--font-cairo), sans-serif"
    : "var(--font-readex-pro), sans-serif";
  const bodyFont = isArabic
    ? "var(--font-cairo), serif"
    : "var(--font-work-sans), serif";

  const isInCart = useMemo(
    () => cart?.items?.some((item) => item.product.id === product.id),
    [cart, product.id]
  );

  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [isTablet] = useMediaQuery("(max-width: 1200px)");

  const adjustedHeight = isMobile
    ? `${height}px`
    : isTablet
    ? `${height * 1.2}px`
    : `${height * 1.5}px`;

  const hoverImage =
    product.image === product.images?.[0]?.image
      ? product.images?.[1]?.image
      : product.images?.[0]?.image;
  const productLink = `/products/${product.slug}`;

  const badge =
    product.is_new_arrival || product.is_best_seller
      ? product.is_new_arrival
        ? isArabic
          ? "جديد"
          : "New Arrival"
        : isArabic
        ? "أكثر مبيعتاً"
        : "Best Seller"
      : null;

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

  return (
    <MotionBox
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      position="relative"
      bg="white"
      borderColor="gray.200"
      w="100%"
      overflow="hidden"
      textAlign="center"
      borderRadius={6}
      fontFamily={headingFont}
    >
      {/* Badge + Wishlist */}
      <Flex
        position="absolute"
        alignItems="center"
        justifyContent="space-between"
        w="100%"
        top={0}
        p={2}
      >
        {badge && !isImageHovered && (
          <Text
            fontSize={isMobile ? "0.5rem" : "xs"}
            fontWeight="bold"
            color="gray.600"
            zIndex={2}
            position="absolute"
            pointerEvents="none"
            fontFamily={headingFont}
            ml={3}
          >
            {badge}
          </Text>
        )}

        <IconButton
          aria-label="wishlist"
          icon={isWishlist ? <FaHeart /> : <FiHeart />}
          size="sm"
          variant="ghost"
          onClick={
            isWishlist
              ? () => removeFromWishlist.mutate(wishlistItemId)
              : () => addToWishlist.mutate({ product: product.id })
          }
          color={isWishlist ? "brand.pink" : "gray.300"}
          zIndex={2}
          _hover={{ bg: "transparent", color: "gray.600" }}
        />
      </Flex>

      {/* Image Area */}
      <Box
        position="relative"
        h={adjustedHeight}
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
        onClick={() => router.push(productLink)}
        cursor="pointer"
      >
        <Image
          src={product.image}
          alt={product.name}
          height={adjustedHeight}
          w="100%"
          objectFit="cover"
          opacity={isImageHovered ? 0 : 1}
          transition="opacity 0.3s ease"
          position="absolute"
          top={0}
          left={0}
        />
        <Image
          src={hoverImage}
          alt={`${product.name} Hover`}
          height={adjustedHeight}
          w="100%"
          objectFit="cover"
          opacity={isImageHovered ? 1 : 0}
          transition="opacity 0.3s ease"
          position="absolute"
          top={0}
          left={0}
        />
      </Box>

      {/* Content Area */}
      <Box px={4} py={3}>
        <Text
          fontWeight="bold"
          fontSize={isMobile ? "0.6rem" : isTablet ? "0.7rem" : "sm"}
          color="gray.800"
          h="45px"
          cursor="pointer"
          onClick={() => router.push(productLink)}
        >
          {isArabic ? product.name_ar : product.name}
        </Text>

        <Stack direction="row" justify="center" align="center" mb={2}>
          <Text
            fontSize={isMobile ? "0.6rem" : isTablet ? "0.7rem" : "sm"}
            color="pink.600"
            fontFamily={bodyFont}
          >
            {parseFloat(product.price).toFixed(3)} KWD
          </Text>
        </Stack>

        {/* Button */}
        <Box
          onMouseEnter={() => setIsHoveringButton(true)}
          onMouseLeave={() => setIsHoveringButton(false)}
        >
          <Button
            variant="outline"
            size="sm"
            borderRadius="none"
            fontWeight="medium"
            fontSize={isMobile ? "0.5rem" : "xs"}
            w="100%"
            py={6}
            bg={
              product?.stock_quantity === 0
                ? "gray.300"
                : isInCart
                ? "brand.pink"
                : "transparent"
            }
            fontFamily={headingFont}
            color={
              product?.stock_quantity === 0
                ? "gray.600"
                : isInCart
                ? "black"
                : "gray.600"
            }
            onClick={(e) => {
              if (product?.stock_quantity === 0) return;
              e.stopPropagation();
              onCustomize?.();
            }}
            _hover={
              product?.stock_quantity === 0
                ? { backgroundColor: "gray.300" }
                : isInCart
                ? { backgroundColor: "brand.pink" }
                : { backgroundColor: "gray.500", color: "white" }
            }
            cursor={product?.stock_quantity === 0 ? "not-allowed" : "pointer"}
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
      </Box>
    </MotionBox>
  );
}
