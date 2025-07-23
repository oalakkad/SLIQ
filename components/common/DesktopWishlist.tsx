"use client";

import {
  Box,
  Button,
  Flex,
  Grid,
  IconButton,
  Image,
  Text,
} from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import { useWishlist } from "@/hooks/use-wishlist";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function DesktopWishlist() {
  const { items, isLoading, removeFromWishlist, clearWishlist } = useWishlist();
  const isArabic = useSelector((state: any) => state.lang.isArabic);

  const wishlistTitle = isArabic ? "قائمة الرغبات" : "WISHLIST";
  const clearBtnLabel = isArabic ? "إفراغ القائمة" : "Clear wishlist";
  const viewProductLabel = isArabic ? "عرض المنتج" : "VIEW PRODUCT";
  const emptyText = isArabic
    ? "قائمة الرغبات فارغة."
    : "Your wishlist is empty.";
  const discoverMoreText = isArabic ? "تصفح المزيد" : "Discover More";

  return (
    <Box px={[4, 10]} py={10} dir={isArabic ? "rtl" : "ltr"}>
      <Flex justify="center" align="center" mb={8} flexDir="column">
        <Text fontSize="2xl" fontWeight="bold">
          {wishlistTitle}
        </Text>

        {items.length > 0 && (
          <Button
            size="sm"
            variant="link"
            _hover={{ textDecor: "none" }}
            my={3}
            fontFamily="'Work Sans', serif"
            leftIcon={<FiX />}
            onClick={() => clearWishlist.mutate()}
          >
            {clearBtnLabel}
          </Button>
        )}
      </Flex>

      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
        {items.map((item) => (
          <Box
            key={item.id}
            position="relative"
            border="1px solid #eee"
            borderRadius="md"
            bg="white"
            overflow="hidden"
            p={4}
          >
            <IconButton
              icon={<FiX />}
              size="sm"
              position="absolute"
              top="10px"
              {...(isArabic ? { left: "10px" } : { right: "10px" })}
              aria-label={isArabic ? "إزالة" : "Remove"}
              onClick={() => removeFromWishlist.mutate(item.id)}
              variant="ghost"
            />

            <Image
              src={item.product.image}
              alt={isArabic ? item.product.name_ar : item.product.name}
              w="100%"
              h="250px"
              objectFit="contain"
              mb={4}
            />

            <Link href={`/products/${item.product.slug}`} passHref>
              <Button
                as="a"
                w="100%"
                variant="outline"
                fontWeight="bold"
                fontSize="sm"
                py={6}
                borderRadius="none"
              >
                {viewProductLabel}
              </Button>
            </Link>
          </Box>
        ))}
      </Grid>

      {items.length === 0 && (
        <Flex flexDir="column" w="100%" alignItems="center" mt={10}>
          <Text>{emptyText}</Text>
          <Link href={"/shop"}>
            <Button variant="link" my={3} fontFamily="'Work Sans', serif">
              {discoverMoreText}
            </Button>
          </Link>
        </Flex>
      )}
    </Box>
  );
}
