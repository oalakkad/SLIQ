"use client";

import AccountMenu from "@/components/common/AccountMenu";
import { useOrders } from "@/hooks/use-orders";
import {
  Box,
  Heading,
  Spinner,
  Text,
  VStack,
  HStack,
  Image,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  Divider,
  Center,
  Badge,
  Stack,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders();
  const isArabic = useSelector((state: any) => state.lang.isArabic);

  if (isLoading) {
    return (
      <Box py={20} textAlign="center">
        <Spinner color="brand.pink" size="xl" />
      </Box>
    );
  }

  return (
    <Box
      py={10}
      bg="#fdf8f7"
      minH="50vh"
      px={[4, 8, 12]}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <AccountMenu />
      <Heading
        mb={8}
        fontSize="lg"
        color="gray.700"
        textAlign={isArabic ? "right" : "left"}
      >
        {isArabic ? "الطلبات" : "ORDERS"}
      </Heading>

      <Box>
        {!orders || orders.length === 0 ? (
          <Center>
            <Box
              bg="white"
              borderRadius="md"
              p={10}
              textAlign="center"
              maxW="2xl"
              w="full"
              boxShadow="sm"
            >
              <Text fontWeight="bold" fontSize="md" mb={2}>
                {isArabic ? "لا توجد طلبات بعد" : "NO ORDERS YET"}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {isArabic
                  ? "توجه إلى المتجر لإجراء عملية شراء."
                  : "Go to store to place an order."}
              </Text>
            </Box>
          </Center>
        ) : (
          <Accordion allowToggle>
            {orders.map((order) => {
              const totalItems = order.items.reduce(
                (acc, item) => acc + item.quantity,
                0
              );
              const statusColor =
                order.status === "paid"
                  ? "green"
                  : order.status === "pending"
                  ? "orange"
                  : order.status === "shipped"
                  ? "blue"
                  : "red";

              const statusLabel = isArabic
                ? order.status === "paid"
                  ? "مدفوع"
                  : order.status === "pending"
                  ? "قيد المعالجة"
                  : order.status === "shipped"
                  ? "تم الشحن"
                  : "ملغي"
                : order.status.toUpperCase();

              return (
                <AccordionItem
                  key={order.id}
                  border="none"
                  mb={4}
                  bg="white"
                  borderRadius="md"
                  boxShadow="sm"
                >
                  <AccordionButton
                    px={6}
                    py={4}
                    _expanded={{ bg: "brand.blue" }}
                    justifyContent="space-between"
                  >
                    <Box textAlign={isArabic ? "right" : "left"}>
                      <Text fontWeight="bold">
                        {isArabic
                          ? `طلب رقم #${order.id}`
                          : `Order #${order.id}`}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {new Date(order.created_at).toLocaleDateString()} ·{" "}
                        <Badge colorScheme={statusColor}>{statusLabel}</Badge>
                      </Text>
                    </Box>
                    <HStack spacing={4}>
                      <Text fontWeight="medium">
                        {order.total_price} {isArabic ? "دينار كويتي" : "KWD"}
                      </Text>
                      <Button size="sm" variant="outline">
                        {isArabic ? "عرض التفاصيل" : "Show Details"}
                      </Button>
                      <AccordionIcon />
                    </HStack>
                  </AccordionButton>

                  <AccordionPanel px={6} pb={6}>
                    <VStack align="stretch" spacing={4}>
                      {/* Order Summary */}
                      <Box bg="brand.yellow" p={4} borderRadius="md">
                        <Text fontWeight="bold" mb={1}>
                          {isArabic ? "ملخص الطلب" : "Order Summary"}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {isArabic ? "رقم الطلب" : "Order ID"}: {order.id}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {isArabic ? "التاريخ" : "Created"}:{" "}
                          {new Date(order.created_at).toLocaleString()}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {isArabic ? "عدد المنتجات" : "Items"}: {totalItems}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {isArabic ? "الإجمالي" : "Total"}: {order.total_price}{" "}
                          {isArabic ? "دينار كويتي" : "KWD"}
                        </Text>
                      </Box>

                      {/* 🚚 Shipping Address */}
                      {order.shipping_line && (
                        <Box
                          bg="gray.50"
                          p={4}
                          borderRadius="md"
                          border="1px solid #e2e8f0"
                        >
                          <Text fontWeight="bold" mb={2}>
                            {isArabic ? "عنوان الشحن" : "Shipping Address"}
                          </Text>
                          <Stack spacing={1} fontSize="sm" color="gray.700">
                            <Text>
                              {isArabic ? "الاسم:" : "Full Name:"}{" "}
                              {order.shipping_full_name}
                            </Text>
                            <Text>
                              {isArabic ? "العنوان:" : "Address:"}{" "}
                              {order.shipping_line}
                            </Text>
                            <Text>
                              {isArabic ? "المدينة:" : "City:"}{" "}
                              {order.shipping_city}
                            </Text>
                            <Text>
                              {isArabic ? "الرمز البريدي:" : "Postal Code:"}{" "}
                              {order.shipping_postal_code}
                            </Text>
                            <Text>
                              {isArabic ? "الدولة:" : "Country:"}{" "}
                              {order.shipping_country}
                            </Text>
                            <Text>
                              {isArabic ? "رقم الهاتف:" : "Phone:"}{" "}
                              {order.shipping_phone}
                            </Text>
                          </Stack>
                        </Box>
                      )}

                      <Divider />

                      {/* Order Items */}
                      {order.items.map((item) => (
                        <HStack key={item.id} spacing={4} align="flex-start">
                          <Image
                            src={item.product.image}
                            alt={
                              isArabic
                                ? item.product.name_ar
                                : item.product.name
                            }
                            boxSize="60px"
                            borderRadius="md"
                            objectFit="cover"
                          />
                          <Box textAlign={isArabic ? "right" : "left"}>
                            <Text fontWeight="medium">
                              {isArabic
                                ? item.product.name_ar
                                : item.product.name}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              {isArabic ? "الكمية" : "Qty"}: {item.quantity} ·{" "}
                              {isArabic ? "السعر" : "Price"}:{" "}
                              {item.price_at_purchase}{" "}
                              {isArabic ? "دينار كويتي" : "KWD"}
                            </Text>
                          </Box>
                        </HStack>
                      ))}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </Box>
    </Box>
  );
}
