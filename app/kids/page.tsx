"use client";

import AddonsModal from "@/components/common/AddonsModal";
import FeaturedCard, {
  FeaturedCardProps,
} from "@/components/common/FeaturedCard";
import PaginationButtons from "@/components/common/PaginationButtons";
import { useCart } from "@/hooks/use-cart";
import { usePaginatedProducts } from "@/hooks/use-products";
import { useWishlist } from "@/hooks/use-wishlist";
import { useAppSelector } from "@/redux/hooks";
import {
  Box,
  Flex,
  Heading,
  Portal,
  SimpleGrid,
  useMediaQuery,
  Select,
  Center,
  Circle,
  useDisclosure,
  Button,
  Text,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useState, useRef } from "react";

export default function Page() {
  const [isMobile] = useMediaQuery(["(max-width: 950px)"]);
  const slug = "kids";

  const [page, setPage] = useState(1);

  const { data, isLoading } = usePaginatedProducts(page, {
    category_slug: slug,
  });

  const { items: wishlist } = useWishlist();

  const wishlistMap = new Map(
    wishlist.map((item) => [item.product.id, item.id])
  );

  const totalPages = Math.ceil((data?.count || 0) / 12);

  const [color, setColor] = useState<string>("all");
  const [sort, setSort] = useState<string>("none");

  const isArabic = useAppSelector((state) => state.lang.isArabic);
  const headingFont = isArabic
    ? "var(--font-cairo), sans-serif"
    : "var(--font-readex-pro), sans-serif";

  const bodyFont = isArabic
    ? "var(--font-cairo), serif"
    : "var(--font-work-sans), serif";

  const COLORS = [
    {
      name: "all",
      value:
        "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)",
    },
    { name: "black", value: "#000", name_ar: "أسود" },
    { name: "white", value: "#fff", name_ar: "أبيض" },
    { name: "brown", value: "#8B4513", name_ar: "بني" },
    { name: "beige", value: "#f5f5dc", name_ar: "بيج" },
    { name: "gold", value: "#ffd700", name_ar: "ذهبي" },
    { name: "gray", value: "#808080", name_ar: "رمادي" },
    { name: "pink", value: "#ffc0cb", name_ar: "وردي" },
    { name: "silver", value: "#c0c0c0", name_ar: "فضي" },
    { name: "lavender", value: "#e6e6fa", name_ar: "لافندر" },
    { name: "purple", value: "#800080", name_ar: "أرجواني" },
    { name: "yellow", value: "#ffff00", name_ar: "أصفر" },
  ];

  const { isOpen, onToggle } = useDisclosure();
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

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

  const { addToCart } = useCart();

  return (
    <Box bg={"#FAFAF9"} py={7}>
      {!isLoading ? (
        <>
          <Heading
            fontFamily={"'Readex Pro', sans-serif"}
            textAlign={"center"}
            px={isMobile ? 2 : "100px"}
            color={"gray.600"}
          >
            {isArabic
              ? data?.results[0].categories[0].name_ar
              : data?.results[0].categories[0].name}
          </Heading>
          <Flex
            px={isMobile ? 2 : "100px"}
            justifyContent={"space-between"}
            pt={10}
          >
            <Button
              onClick={onToggle}
              w={isMobile ? "150px" : "250px"}
              h={"45px"}
              fontWeight={300}
              color={"gray.400"}
              fontFamily={bodyFont}
              leftIcon={
                <Circle
                  size="20px"
                  border={"1px solid #ccc"}
                  bg={
                    color === "all"
                      ? undefined
                      : COLORS.find((c) => c.name === color)?.value
                  }
                  bgGradient={
                    color === "all"
                      ? "linear(to-r, red, orange, yellow, green, blue, indigo, violet)"
                      : undefined
                  }
                />
              }
            >
              {color === "all"
                ? isArabic
                  ? "كل الألوان"
                  : "All Colors"
                : color[0].toUpperCase() + color.slice(1)}
            </Button>
            {!isMobile && isOpen && (
              <Center mt={6} flexDir="column">
                {hoveredColor && (
                  <Text
                    mb={2}
                    fontSize="lg"
                    fontWeight="semibold"
                    position={"absolute"}
                    color={"gray.400"}
                    fontFamily={bodyFont}
                    mt={"-115px"}
                  >
                    {hoveredColor.toUpperCase()}
                  </Text>
                )}
                {
                  <Flex wrap="wrap" gap={1} justify="center" maxW={"285px"}>
                    {COLORS.map((color) => (
                      <Circle
                        key={color.name}
                        size="26px"
                        bg={color.value}
                        border="1px solid #ccc"
                        onClick={() => setColor(color.name)}
                        cursor="pointer"
                        onMouseEnter={() => setHoveredColor(color.name)}
                        onMouseLeave={() => setHoveredColor(null)}
                        _hover={{ transform: "scale(1.1)" }}
                      />
                    ))}
                  </Flex>
                }
              </Center>
            )}
            <Select
              placeholder={isArabic ? "فرز حسب" : "SORT BY"}
              size="lg"
              w={isMobile ? "150px" : "250px"}
              borderRadius={0}
              border={"none"}
              color={"gray.400"}
              fontWeight={300}
              fontFamily={bodyFont}
              variant={"filled"}
              h={"45px"}
              bg="white"
              value={sort}
              style={{ paddingTop: "0" }}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="featured">{isArabic ? "مميز" : "Featured"}</option>
              <option value="price-lth">
                {isArabic ? "السعر من الأقل إلى الأعلى" : "Price, Low to High"}
              </option>
              <option value="price-htl">
                {isArabic ? "السعر من الأعلى إلى الأقل" : "Price, High to Low"}
              </option>
            </Select>
          </Flex>
          {isMobile && (
            <Flex wrap="wrap" gap={1} justify="center" w={"100%"} mt={4}>
              {isOpen &&
                COLORS.map((color) => (
                  <Circle
                    key={color.name}
                    size="26px"
                    bg={color.value}
                    border="1px solid #ccc"
                    onClick={() => setColor(color.name)}
                    cursor="pointer"
                    onMouseEnter={() => setHoveredColor(color.name)}
                    onMouseLeave={() => setHoveredColor(null)}
                    _hover={{ transform: "scale(1.1)" }}
                  />
                ))}
            </Flex>
          )}
          <AnimatePresence mode="wait">
            {data && (
              <motion.div
                key={page} // Animate only when page changes
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <SimpleGrid
                  columns={{ base: 2, md: 4 }}
                  spacing={isMobile ? 2 : 6}
                  pt={5}
                  px={isMobile ? 2 : "100px"}
                >
                  {data.results.map((product) => (
                    <Flex
                      key={`${product.id}-${page}`}
                      direction="column"
                      justify="space-between"
                      height="100%"
                      minHeight="100%"
                    >
                      <Box width="100%" height="100%">
                        <FeaturedCard
                          product={product}
                          height={200}
                          isWishlist={wishlistMap.has(product.id)}
                          wishlistItemId={wishlistMap.get(product.id) ?? -1}
                          onCustomize={() =>
                            openAddons({
                              id: product.id,
                              slug: product.slug,
                              name: product.name,
                            })
                          }
                        />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Pagination Control */}
          <PaginationButtons
            totalPages={totalPages}
            page={page}
            setPage={setPage}
          />
        </>
      ) : (
        <Flex justify="center" align="center" h="50vh">
          <Spinner color="brand.pink" size="xl" />
        </Flex>
      )}
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
        title={isArabic ? "تخصيص منتجكِ" : "Your Customizations"}
      />
    </Box>
  );
}
