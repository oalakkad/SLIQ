"use client";

import {
  Box,
  Text,
  Image,
  Button,
  IconButton,
  Flex,
  Spinner,
  SimpleGrid,
} from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import Link from "next/link";
import { useWishlist } from "@/hooks/use-wishlist";
import { useSelector } from "react-redux";

export default function MobileWishlist() {
  const { items, isLoading, removeFromWishlist, clearWishlist } = useWishlist();
  const isArabic = useSelector((state: any) => state.lang.isArabic);

  const headingFont = isArabic
    ? "var(--font-cairo), sans-serif"
    : "var(--font-readex-pro), sans-serif";
  const bodyFont = isArabic
    ? "var(--font-cairo), serif"
    : "var(--font-work-sans), serif";

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Spinner color="brand.pink" size="xl" />
      </Flex>
    );
  }

  return (
    <Box px={4} py={6} dir={isArabic ? "rtl" : "ltr"}>
      {/* Title and Clear Wishlist */}
      <Flex direction="column" align="center" mb={6}>
        <Text fontSize="2xl" fontWeight="bold" mb={1}>
          {isArabic ? "قائمة الرغبات" : "WISHLIST"}
        </Text>
        {items.length > 0 && (
          <Button
            onClick={() => clearWishlist.mutate()}
            size="sm"
            variant="link"
            color="gray.600"
            leftIcon={<FiX />}
          >
            {isArabic ? "إفراغ القائمة" : "Clear wishlist"}
          </Button>
        )}
      </Flex>

      {/* Items Grid */}
      <SimpleGrid columns={2} spacing={4}>
        {items.map((item) => (
          <Box
            key={item.id}
            position="relative"
            border="1px solid #eee"
            borderRadius="md"
            bg="white"
            overflow="hidden"
            p={3}
          >
            {/* Remove Button */}
            <IconButton
              icon={<FiX />}
              size="sm"
              aria-label="Remove"
              variant="ghost"
              position="absolute"
              top="8px"
              right="8px"
              onClick={() => removeFromWishlist.mutate(item.id)}
            />

            {/* Image */}
            <Image
              src={item.product.image}
              alt={item.product.name}
              w="100%"
              h="160px"
              objectFit="contain"
              mb={3}
            />

            {/* View Product */}
            <Link href={`/products/${item.product.slug}`} passHref>
              <Button
                as="a"
                w="100%"
                variant="outline"
                fontWeight="bold"
                fontSize="xs"
                borderRadius="none"
              >
                {isArabic ? "عرض المنتج" : "VIEW"}
              </Button>
            </Link>
          </Box>
        ))}
      </SimpleGrid>
      {items.length === 0 && (
        <Flex flexDir={"column"} w={"100%"} alignItems={"center"} mt={10}>
          <Text>
            {isArabic ? "قائمة الرغبات فارغة." : "Your wishlist is empty."}
          </Text>
          <Link href={"/shop"}>
            <Button variant={"link"} my={3}>
              {isArabic ? "تصفح المزيد" : "Discover More"}
            </Button>
          </Link>
        </Flex>
      )}
    </Box>
  );
}
