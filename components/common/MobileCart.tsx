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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

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

  // ---- Stable client-side order so items don't rearrange on quantity updates ----
  const [itemOrder, setItemOrder] = useState<number[]>([]);
  useEffect(() => {
    if (!items.length) {
      setItemOrder([]);
      return;
    }
    setItemOrder((prev) => {
      const prevSet = new Set(prev);
      // keep existing order, append any new ids
      const appended = [
        ...prev,
        ...items.map((i: any) => i.id).filter((id) => !prevSet.has(id)),
      ];
      // drop ids that no longer exist
      const currentSet = new Set(items.map((i: any) => i.id));
      return appended.filter((id) => currentSet.has(id));
    });
  }, [items]);

  const sortedItems = useMemo(() => {
    if (!itemOrder.length) return items as any[];
    const map = new Map(items.map((it: any) => [it.id, it]));
    return itemOrder.map((id) => map.get(id)).filter(Boolean) as any[];
  }, [itemOrder, items]);

  // Prefer server line_total; fallback to compute
  const subtotal = sortedItems.reduce((acc: number, it: any) => {
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
        <Spinner color="brandPink.500" size="xl" />
      </Flex>
    );
  }

  return (
    <Box px={4} py={6} dir={isArabic ? "rtl" : "ltr"} fontFamily={bodyFont}>
      <Text
        fontSize="2xl"
        fontWeight="bold"
        mb={2}
        textAlign={
          sortedItems.length > 0 ? (isArabic ? "right" : "left") : "center"
        }
        fontFamily={headingFont}
      >
        {isArabic ? "سلة التسوق" : "SHOPPING BAG"}
      </Text>

      {!(sortedItems.length > 0) && (
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
            sortedItems.length > 0 ? (isArabic ? "right" : "left") : "center"
          }
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
              p={3}
            >
              {/* Header row */}
              <HStack align="start" spacing={3} w="full">
                <Link href={`/products/${item.product.slug}`}>
                  <Image
                    boxSize="84px"
                    src={item.product.image}
                    alt={isArabic ? item.product.name_ar : item.product.name}
                    borderRadius="md"
                    objectFit="cover"
                  />
                </Link>

                <Box flex="1" textAlign={isArabic ? "right" : "left"}>
                  <Link href={`/products/${item.product.slug}`}>
                    <Text
                      fontWeight="semibold"
                      fontFamily={headingFont}
                      noOfLines={2}
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

                  <HStack spacing={3} mt={2}>
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

                  <Button
                    size="xs"
                    variant="link"
                    mt={1}
                    color={muted}
                    onClick={() => removeCartItem.mutate(item.id)}
                  >
                    {isArabic ? "إزالة" : "Remove"}
                  </Button>
                </Box>

                <Box textAlign={isArabic ? "left" : "right"} minW="72px" pt={1}>
                  <Text fontWeight="bold" fontFamily={headingFont}>
                    {kwd(lineTotal)}
                  </Text>
                </Box>
              </HStack>

              {/* Customization accordion (mobile-friendly) */}
              {addons.length > 0 && (
                <Accordion allowToggle mt={3}>
                  <AccordionItem border="none">
                    <h2>
                      <AccordionButton
                        border="1px solid"
                        borderColor={cardBorder}
                        borderRadius="md"
                        px={3}
                        py={2}
                        _expanded={{
                          bg: "brandPink.500", // brand pink when opened
                          color: "black",
                          borderColor: "brandPink.500",
                        }}
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
                    <AccordionPanel pb={3} pt={2}>
                      <VStack align="stretch" spacing={3}>
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
                              bg={"brandBlue.200"}
                            >
                              <Stack spacing={2}>
                                <Text
                                  fontWeight="semibold"
                                  fontFamily={headingFont}
                                >
                                  {catName}
                                </Text>
                                <HStack spacing={2} wrap="wrap">
                                  <Badge
                                    colorScheme="brandBlue"
                                    variant="subtle"
                                  >
                                    {isArabic ? "إضافة" : "Addon"}
                                  </Badge>
                                  <Text fontWeight="medium">{addonName}</Text>
                                  {sel.addon?.custom_name && (
                                    <Badge colorScheme="blue" variant="outline">
                                      {isArabic
                                        ? `اسم مخصص: ${sel.addon.custom_name}`
                                        : `Custom name: ${sel.addon.custom_name}`}
                                    </Badge>
                                  )}
                                </HStack>

                                {Array.isArray(sel.options) &&
                                  sel.options.length > 0 && (
                                    <VStack align="stretch" spacing={1}>
                                      <Text color={muted} fontSize="sm">
                                        {isArabic ? "الخيارات" : "Options"}
                                      </Text>
                                      {sel.options.map((op) => (
                                        <Flex
                                          key={op.id}
                                          justify="space-between"
                                          py={0.5}
                                        >
                                          <Text>
                                            {isArabic
                                              ? op.name_ar || op.name
                                              : op.name}
                                          </Text>
                                          <Text fontSize="sm" color={muted}>
                                            + {kwd(parseMoney(op.extra_price))}
                                          </Text>
                                        </Flex>
                                      ))}
                                    </VStack>
                                  )}

                                <Flex justify="space-between" mt={1}>
                                  <Text color={muted} fontSize="sm">
                                    {isArabic
                                      ? "مجموع هذا التحديد"
                                      : "This selection"}
                                  </Text>
                                  <Text fontWeight="semibold">
                                    {kwd(selectionSubtotal)}
                                  </Text>
                                </Flex>
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

      {sortedItems.length > 0 && (
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

          <HStack justify="space-between" mb={2}>
            <Text fontWeight="medium">
              {isArabic ? "المجموع الفرعي" : "Subtotal"}
            </Text>
            <Text fontWeight="bold">{kwd(subtotal)}</Text>
          </HStack>

          <Link href={"/checkout"}>
            <Button
              mt={4}
              w="full"
              variant={"solidYellow"}
              px={10}
              py={6}
              fontFamily={headingFont}
            >
              {isArabic ? "الدفع" : "CHECK OUT"}
            </Button>
          </Link>

          <Text fontSize="sm" mt={3} textAlign="center" color={muted}>
            {isArabic
              ? "اشترك لكسب نقاط مع كل عملية شراء ✨"
              : "Sign up to earn rewards for every purchase ✨"}
          </Text>
        </Box>
      )}
    </Box>
  );
}
