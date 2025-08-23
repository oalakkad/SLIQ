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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  Stack,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";

type CartAddonOption = {
  id: number;
  name: string;
  name_ar?: string;
  extra_price?: string;
};

type CartAddon = {
  category: { id: number; name: string; name_ar?: string };
  addon: {
    id: number;
    name: string;
    name_ar?: string;
    base_price?: string;
    allow_multiple_options?: boolean;
    requires_custom_name?: boolean;
    custom_name?: string | null;
  };
  options: CartAddonOption[];
  selection_subtotal?: string;
};

const parseMoney = (v: unknown) => Number.parseFloat(String(v ?? "0")) || 0;
const kwd = (n: number) => `${n.toFixed(3)} KWD`;

export default function DesktopCart() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: cart, isLoading, updateCartItem, removeCartItem } = useCart();

  const isArabic = useAppSelector((state) => state.lang.isArabic);
  const headingFont = isArabic
    ? "var(--font-cairo), sans-serif"
    : "var(--font-readex-pro), sans-serif";
  const bodyFont = isArabic
    ? "var(--font-cairo), serif"
    : "var(--font-work-sans), serif";

  const items = cart?.items ?? [];

  // Preserve initial order
  const [itemOrder, setItemOrder] = useState<string[]>([]);
  useEffect(() => {
    if (items.length && itemOrder.length === 0) {
      setItemOrder(items.map((item) => item.id.toString()));
    }
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  const sortedItems =
    itemOrder.length > 0
      ? itemOrder
          .map((id) => items.find((it) => it.id === Number(id)))
          .filter((x): x is NonNullable<typeof x> => !!x)
      : items;

  // Prefer server totals; fallback to calculating
  const subtotal = sortedItems.reduce((acc, it: any) => {
    const lt =
      it?.line_total != null
        ? parseMoney(it.line_total)
        : (parseMoney(it?.product?.price) + parseMoney(it?.unit_extra_price)) *
          (it?.quantity ?? 0);
    return acc + lt;
  }, 0);

  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const muted = useColorModeValue("gray.600", "gray.300");

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Spinner color="brand.blue" size="xl" />
      </Flex>
    );
  }

  return (
    <Flex
      w="full"
      px={{ base: 4, md: 10 }}
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

        <VStack spacing={5} align="stretch">
          {sortedItems.map((item: any) => {
            const unitPrice =
              item?.unit_price != null
                ? parseMoney(item.unit_price)
                : parseMoney(item?.product?.price) +
                  parseMoney(item?.unit_extra_price);
            const lineTotal =
              item?.line_total != null
                ? parseMoney(item.line_total)
                : unitPrice * (item?.quantity ?? 0);
            const addons: CartAddon[] = Array.isArray(item?.addons)
              ? item.addons
              : [];

            return (
              <Box
                key={item.id}
                bg={cardBg}
                border="1px solid"
                borderColor={cardBorder}
                borderRadius="lg"
                p={4}
                transition="all 0.2s ease"
                _hover={{ boxShadow: "lg" }}
              >
                {/* Item header row */}
                <Flex
                  align={{ base: "stretch", md: "center" }}
                  justify="space-between"
                  gap={6}
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  <HStack spacing={4} flex="2" align="start">
                    <Link href={`/products/${item.product.slug}`}>
                      <Image
                        boxSize="96px"
                        src={item.product.image}
                        alt={
                          isArabic ? item.product.name_ar : item.product.name
                        }
                        borderRadius="md"
                        objectFit="cover"
                      />
                    </Link>

                    <Box textAlign={isArabic ? "right" : "left"}>
                      <Link href={`/products/${item.product.slug}`}>
                        <Text
                          fontWeight="semibold"
                          fontFamily={headingFont}
                          lineHeight="1.4"
                        >
                          {isArabic ? item.product.name_ar : item.product.name}
                        </Text>
                      </Link>

                      <HStack mt={1} spacing={2}>
                        <Badge variant="subtle" colorScheme="brandBlue">
                          {isArabic ? "سعر الوحدة" : "Unit"}: {kwd(unitPrice)}
                        </Badge>
                        {parseMoney(item.unit_extra_price) > 0 && (
                          <Badge variant="outline" colorScheme="brandPink">
                            {isArabic ? "مصمّم حسب الطلب" : "Customized"}
                          </Badge>
                        )}
                      </HStack>

                      <Button
                        size="xs"
                        variant="link"
                        mt={2}
                        color={muted}
                        onClick={() => removeCartItem.mutate(item.id)}
                      >
                        {isArabic ? "إزالة" : "Remove"}
                      </Button>
                    </Box>
                  </HStack>

                  {/* Qty controls */}
                  <HStack spacing={3} flex="1" justify="center">
                    <Button
                      size="sm"
                      variant="outlineBlue"
                      p={"10px 30px"}
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
                      –
                    </Button>
                    <Text minW="2ch" textAlign="center">
                      {item.quantity}
                    </Text>
                    <Button
                      size="sm"
                      variant="outlineBlue"
                      p={"10px 30px"}
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

                  {/* Line total */}
                  <Flex
                    textAlign={isArabic ? "left" : "right"}
                    flex="1"
                    justify="flex-end"
                    align="center"
                  >
                    <Text fontWeight="bold" fontSize="lg">
                      {kwd(lineTotal)}
                    </Text>
                  </Flex>
                </Flex>

                {/* Accordion: customization details */}
                {addons.length > 0 && (
                  <Accordion allowToggle mt={4}>
                    <AccordionItem border="none">
                      <h2>
                        <AccordionButton
                          border="1px solid"
                          borderColor={cardBorder}
                          borderRadius="md"
                          _expanded={{
                            bg: "brand.blue", // << when opened
                            color: "black",
                            borderColor: "brand.blue",
                          }}
                          _hover={{ bg: "#afcbed" }}
                          px={4}
                          py={3}
                        >
                          <Box
                            as="span"
                            flex="1"
                            textAlign={isArabic ? "right" : "left"}
                            fontWeight="semibold"
                            fontFamily={headingFont}
                          >
                            {isArabic
                              ? "تفاصيل التصميم"
                              : "Customization Details"}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>

                      <AccordionPanel pb={4} pt={3} dir={"ltr"}>
                        <VStack align="stretch" spacing={4}>
                          {addons.map((sel, idx) => {
                            const catName = isArabic
                              ? sel.category?.name_ar || sel.category?.name
                              : sel.category?.name;
                            const addonName = isArabic
                              ? sel.addon?.name_ar || sel.addon?.name
                              : sel.addon?.name;
                            const selectionSubtotal = parseMoney(
                              sel.selection_subtotal
                            );

                            return (
                              <Box
                                key={`${item.id}-addon-${idx}`}
                                border="1px dashed"
                                borderColor={cardBorder}
                                borderRadius="md"
                                p={3}
                                bg={"brand.blue"}
                              >
                                <Stack
                                  direction={{
                                    base: "column",
                                    md: isArabic ? "row-reverse" : "row",
                                  }}
                                  justify="space-between"
                                  align="start"
                                  spacing={3}
                                >
                                  <Box>
                                    <Text
                                      fontWeight="semibold"
                                      fontFamily={headingFont}
                                    >
                                      {catName}
                                    </Text>
                                    <HStack
                                      wrap="wrap"
                                      spacing={2}
                                      mt={2}
                                      dir={isArabic ? "rtl" : "ltr"}
                                    >
                                      <Badge
                                        colorScheme="brandBlue"
                                        variant="subtle"
                                      >
                                        {isArabic ? "إضافة" : "Addon"}
                                      </Badge>
                                      <Text as="span" fontWeight="medium">
                                        {addonName}
                                      </Text>
                                      {sel.addon?.custom_name && (
                                        <Badge
                                          colorScheme="blue"
                                          variant="outline"
                                        >
                                          {isArabic
                                            ? `اسم مخصص: ${sel.addon.custom_name}`
                                            : `Custom name: ${sel.addon.custom_name}`}
                                        </Badge>
                                      )}
                                    </HStack>

                                    {Array.isArray(sel.options) &&
                                      sel.options.length > 0 && (
                                        <VStack
                                          align="stretch"
                                          spacing={1}
                                          mt={3}
                                          dir={isArabic ? "rtl" : "ltr"}
                                        >
                                          <Text color={muted} fontSize="sm">
                                            {isArabic ? "الخيارات" : "Options"}
                                          </Text>

                                          {sel.options.map((op) => (
                                            <Flex
                                              key={op.id}
                                              justify="space-between"
                                              align="center"
                                              py={1}
                                            >
                                              <Text>
                                                {isArabic
                                                  ? op.name_ar || op.name
                                                  : op.name}
                                              </Text>
                                              <Text fontSize="sm" color={muted}>
                                                +{" "}
                                                {kwd(
                                                  parseMoney(op.extra_price)
                                                )}
                                              </Text>
                                            </Flex>
                                          ))}
                                        </VStack>
                                      )}
                                  </Box>

                                  <Box minW="160px" textAlign="right">
                                    <Text color={muted} fontSize="sm">
                                      {isArabic
                                        ? "مجموع هذا التحديد"
                                        : "This selection"}
                                    </Text>
                                    <Text fontWeight="semibold">
                                      {kwd(selectionSubtotal)}
                                    </Text>
                                  </Box>
                                </Stack>
                              </Box>
                            );
                          })}

                          <Divider />

                          <Flex justify="space-between" align="center">
                            <Text color={muted}>
                              {isArabic
                                ? "إجمالي الزيادة لكل وحدة"
                                : "Unit extra total"}
                            </Text>
                            <Text fontWeight="bold">
                              {kwd(parseMoney(item.unit_extra_price))}
                            </Text>
                          </Flex>
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                )}
              </Box>
            );
          })}
        </VStack>
      </Box>

      {/* Summary & Note */}
      {sortedItems.length > 0 && (
        <Box
          flex="2"
          p={6}
          border="1px solid"
          borderColor={cardBorder}
          borderRadius="lg"
          dir={isArabic ? "rtl" : "ltr"}
          textAlign={isArabic ? "left" : "right"}
          bg={cardBg}
          boxShadow="sm"
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
            <Text>{kwd(subtotal)}</Text>
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

          <Text fontSize="sm" mt={3} textAlign="center" color={muted}>
            {isArabic
              ? "اشترك لتحصل على نقاط مقابل كل عملية شراء ✨"
              : "Sign up to earn rewards for every purchase ✨"}
          </Text>
        </Box>
      )}
    </Flex>
  );
}
