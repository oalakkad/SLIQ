"use client";

import { useCart } from "@/hooks/use-cart";
import { useAppSelector } from "@/redux/hooks";
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  VStack,
  HStack,
  Spinner,
  Textarea,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DesktopCart() {
  const { data: cart, isLoading, updateCartItem, removeCartItem } = useCart();

  const isArabic = useAppSelector((state) => state.lang.isArabic);
  const headingFont = isArabic
    ? "var(--font-cairo), sans-serif"
    : "var(--font-readex-pro), sans-serif";

  const bodyFont = isArabic
    ? "var(--font-cairo), serif"
    : "var(--font-work-sans), serif";
  const items = cart?.items ?? [];

  // Store initial item ID order
  const [itemOrder, setItemOrder] = useState<string[]>([]);

  // On first load, lock in the original order
  useEffect(() => {
    if (items.length && itemOrder.length === 0) {
      setItemOrder(items.map((item) => item.id.toString()));
    }
  }, [items]);

  // Sort items according to the initial order
  const sortedItems = itemOrder.length
    ? itemOrder
        .map((id) => items.find((item) => item.id === Number(id)))
        .filter((item): item is NonNullable<typeof item> => !!item)
    : items;

  const subtotal = sortedItems.reduce(
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
    <Flex
      w="full"
      px={10}
      py={10}
      direction={isArabic ? "row-reverse" : "row"}
      justify="space-between"
      align="start"
      gap={10}
      fontFamily={bodyFont}
    >
      {/* Cart Items */}
      <Box flex="3" dir={isArabic ? "rtl" : "ltr"}>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          mb={4}
          textAlign={isArabic ? "right" : "left"}
          fontFamily={headingFont}
        >
          {isArabic ? "سلة التسوق" : "SHOPPING BAG"}
        </Text>

        {!sortedItems.length && (
          <Text textAlign="center" my={2}>
            {isArabic ? "سلتك فارغة" : "Your bag is empty."}
          </Text>
        )}

        <Link href="/shop">
          <Text
            fontSize="sm"
            mb={6}
            color="gray.500"
            textAlign={isArabic ? "right" : "left"}
          >
            <u>{isArabic ? "متابعة التسوق" : "Continue shopping"}</u>
          </Text>
        </Link>

        <VStack spacing={8} align="stretch">
          {sortedItems.map((item) => (
            <Flex
              key={item.id}
              align="center"
              justify="space-between"
              dir={isArabic ? "rtl" : "ltr"}
            >
              <HStack
                spacing={6}
                flex="2"
                direction={isArabic ? "row-reverse" : "row"}
              >
                <Link href={`/products/${item.product.slug}`}>
                  <Image
                    boxSize="100px"
                    src={item.product.image}
                    alt={isArabic ? item.product.name_ar : item.product.name}
                  />
                </Link>
                <Box textAlign={isArabic ? "right" : "left"}>
                  <Link href={`/products/${item.product.slug}`}>
                    <Text fontWeight="medium">
                      {isArabic ? item.product.name_ar : item.product.name}
                    </Text>
                  </Link>
                  <Button
                    size="xs"
                    variant="link"
                    mt={2}
                    onClick={() => removeCartItem.mutate(item.id)}
                  >
                    {isArabic ? "إزالة" : "Remove"}
                  </Button>
                </Box>
              </HStack>

              <HStack
                spacing={4}
                flex="1"
                direction={isArabic ? "row-reverse" : "row"}
              >
                <Button
                  size="sm"
                  onClick={() => {
                    if (item.quantity === 1) {
                      removeCartItem.mutate(item.id);
                    } else {
                      updateCartItem.mutate({
                        id: item.id,
                        quantity: item.quantity - 1,
                      });
                    }
                  }}
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

              <Flex textAlign={isArabic ? "left" : "right"} flex={"1"}>
                <Text>
                  {(parseFloat(item.product.price) * item.quantity).toFixed(3)}{" "}
                  {isArabic ? "دينار كويتي" : "KWD"}
                </Text>
              </Flex>
            </Flex>
          ))}
        </VStack>
      </Box>

      {/* Summary & Note */}
      {sortedItems.length > 0 && (
        <Box
          flex="2"
          p={6}
          border="1px solid #eee"
          borderRadius="md"
          dir={isArabic ? "rtl" : "ltr"}
          textAlign={isArabic ? "left" : "right"}
        >
          <Text
            fontWeight="medium"
            mb={2}
            textAlign={isArabic ? "right" : "left"}
            fontFamily={headingFont}
          >
            {isArabic ? "ملاحظة الطلب" : "ORDER NOTE"}
          </Text>
          <Textarea
            placeholder={isArabic ? "أضف ملاحظة..." : "Add a note..."}
            mb={4}
            minH="150px"
          />

          <Flex
            justify="space-between"
            fontWeight="medium"
            mb={2}
            dir={isArabic ? "rtl" : "ltr"}
          >
            <Text>{isArabic ? "المجموع الفرعي" : "Subtotal"}</Text>
            <Text>
              {subtotal.toFixed(3)} {isArabic ? "دينار كويتي" : "KWD"}
            </Text>
          </Flex>

          <Link href="/checkout">
            <Button
              mt={4}
              w="full"
              variant="solidYellow"
              px={10}
              py={6}
              fontFamily={headingFont}
            >
              {isArabic ? "الدفع" : "CHECK OUT"}
            </Button>
          </Link>

          <Text fontSize="sm" mt={3} textAlign="center">
            {isArabic
              ? "اشترك لتحصل على نقاط مقابل كل عملية شراء ✨"
              : "Sign up to earn rewards for every purchase ✨"}
          </Text>
        </Box>
      )}
    </Flex>
  );
}
