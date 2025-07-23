"use client";

import {
  Box,
  VStack,
  Image,
  Text,
  Button,
  HStack,
  Divider,
  Spinner,
  Textarea,
  Flex,
} from "@chakra-ui/react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { useSelector } from "react-redux";

export default function MobileCart() {
  const { data: cart, isLoading, updateCartItem, removeCartItem } = useCart();
  const isArabic = useSelector((state: any) => state.lang.isArabic);
  const headingFont = isArabic
    ? "var(--font-cairo), sans-serif"
    : "var(--font-readex-pro), sans-serif";

  const bodyFont = isArabic
    ? "var(--font-cairo), serif"
    : "var(--font-work-sans), serif";

  const items = cart?.items ?? [];

  const subtotal = items.reduce(
    (acc, item) => acc + parseFloat(item?.product?.price) * item?.quantity,
    0
  );

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Spinner color="brand.pink" size="xl" />
      </Flex>
    );
  }

  return (
    <Box px={4} py={6} dir={isArabic ? "rtl" : "ltr"} fontFamily={bodyFont}>
      <Text
        fontSize="2xl"
        fontWeight="bold"
        mb={2}
        textAlign={items.length > 0 ? (isArabic ? "right" : "left") : "center"}
        fontFamily={headingFont}
      >
        {isArabic ? "سلة التسوق" : "SHOPPING BAG"}
      </Text>

      {!(items.length > 0) && (
        <Text textAlign="center" my={2}>
          {isArabic ? "سلتك فارغة." : "Your bag is empty."}
        </Text>
      )}

      <Link href={"/shop"}>
        <Text
          fontSize="sm"
          mb={6}
          color="gray.500"
          fontFamily={bodyFont}
          textAlign={
            items.length > 0 ? (isArabic ? "right" : "left") : "center"
          }
        >
          <u>{isArabic ? "متابعة التسوق" : "Continue shopping"}</u>
        </Text>
      </Link>

      <VStack spacing={6} align="stretch">
        {items.map((item) => (
          <Box key={item.id}>
            <HStack
              align="start"
              spacing={4}
              w="full"
              direction={isArabic ? "row-reverse" : "row"}
            >
              <Link href={`/products/${item.product.slug}`}>
                <Image
                  boxSize="100px"
                  src={item.product.image}
                  alt={isArabic ? item.product.name_ar : item.product.name}
                />
              </Link>
              <Box flex="1" textAlign={isArabic ? "right" : "left"}>
                <Link href={`/products/${item.product.slug}`}>
                  <Text fontWeight="bold" fontFamily={headingFont}>
                    {isArabic ? item.product.name_ar : item.product.name}
                  </Text>
                </Link>
                <HStack
                  spacing={3}
                  mt={2}
                  direction={isArabic ? "row-reverse" : "row"}
                >
                  <Button
                    size="sm"
                    onClick={() =>
                      updateCartItem.mutate({
                        id: item.id,
                        quantity: item.quantity - 1,
                      })
                    }
                  >
                    -
                  </Button>
                  <Text>{item.quantity}</Text>
                  <Button
                    size="sm"
                    onClick={() =>
                      updateCartItem.mutate({
                        id: item.id,
                        quantity: item.quantity + 1,
                      })
                    }
                  >
                    +
                  </Button>
                </HStack>
                <Button
                  size="xs"
                  variant="link"
                  mt={1}
                  onClick={() => removeCartItem.mutate(item.id)}
                >
                  {isArabic ? "إزالة" : "Remove"}
                </Button>
              </Box>
              <Box textAlign={isArabic ? "left" : "right"} minW="60px">
                <Text fontWeight="medium" fontFamily={headingFont}>
                  {(parseFloat(item.product.price) * item.quantity).toFixed(3)}{" "}
                  {isArabic ? "دينار كويتي" : "KWD"}
                </Text>
              </Box>
            </HStack>
            <Divider mt={4} />
          </Box>
        ))}
      </VStack>

      {items.length > 0 && (
        <Box mt={6} textAlign={isArabic ? "right" : "left"}>
          <Text fontWeight="bold" fontFamily={headingFont} mb={2}>
            {isArabic ? "ملاحظة الطلب" : "ORDER NOTE"}
          </Text>
          <Textarea
            placeholder={isArabic ? "أضف ملاحظة..." : "Add a note..."}
            mb={4}
            minH="120px"
            textAlign={isArabic ? "right" : "left"}
          />

          <HStack
            justify="space-between"
            mb={2}
            direction={isArabic ? "row-reverse" : "row"}
          >
            <Text fontWeight="medium">
              {isArabic ? "المجموع الفرعي" : "Subtotal"}
            </Text>
            <Text fontWeight="medium">
              {subtotal.toFixed(3)} {isArabic ? "دينار كويتي" : "KWD"}
            </Text>
          </HStack>

          <Link href={"/checkout"}>
            <Button mt={4} w="full" variant={"solidYellow"} px={10} py={6}>
              {isArabic ? "الدفع" : "CHECK OUT"}
            </Button>
          </Link>

          <Text fontSize="sm" mt={3} textAlign="center">
            {isArabic
              ? "اشترك لكسب نقاط مع كل عملية شراء ✨"
              : "Sign up to earn rewards for every purchase ✨"}
          </Text>
        </Box>
      )}
    </Box>
  );
}
