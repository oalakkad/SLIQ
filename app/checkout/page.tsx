"use client";

import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
  useDisclosure,
  Spinner,
  Image,
  InputLeftAddon,
  InputGroup,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAddress } from "@/hooks/use-address";
import AddAddressModal from "@/components/common/AddressModal";
import { Cart, CartItem, useCart } from "@/hooks/use-cart";
import { useOrders } from "@/hooks/use-orders";
import { useSelector } from "react-redux";

const OrderSummary = ({
  cart,
  isLoading,
  isArabic,
}: {
  cart: Cart;
  isLoading: any;
  isArabic: boolean;
}) => (
  <Box bg="brand.yellow" borderRadius="md" p={6} minW="300px">
    <Heading size="md" mb={4} textAlign={isArabic ? "right" : "left"}>
      {isArabic ? "ملخص الطلب" : "ORDER SUMMARY"}
    </Heading>
    <Stack spacing={4}>
      {!isLoading && cart && cart?.items?.length > 0 ? (
        cart.items.map((item: CartItem) => (
          <Flex key={item.id} align="center" justify="space-between">
            <Flex gap={3} align="center">
              <Box boxSize="50px" bg="gray.200" borderRadius="md">
                <Image
                  src={item.product.image}
                  alt={isArabic ? item.product.name_ar : item.product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
              <Box textAlign={isArabic ? "right" : "left"}>
                <Text fontWeight="medium">
                  {isArabic ? item.product.name_ar : item.product.name}
                </Text>
                <Text fontSize="sm">x{item.quantity}</Text>
              </Box>
            </Flex>
            <Text>
              {(Number(item.product.price) * item.quantity).toFixed(2)}{" "}
              {isArabic ? "دينار كويتي" : "KWD"}
            </Text>
          </Flex>
        ))
      ) : (
        <Text textAlign={isArabic ? "right" : "left"}>
          {isArabic ? "لا توجد منتجات في السلة." : "No items in cart."}
        </Text>
      )}
      <Divider />
      <Flex justify="space-between">
        <Text fontWeight="bold">{isArabic ? "الإجمالي:" : "Total:"}</Text>
        <Text fontWeight="bold">
          {cart?.items
            ?.reduce(
              (sum, item) => sum + Number(item.product.price) * item.quantity,
              0
            )
            .toFixed(3)}{" "}
          {isArabic ? "دينار كويتي" : "KWD"}
        </Text>
      </Flex>
    </Stack>
  </Box>
);

export default function CheckoutPage() {
  const { data: cart, isLoading } = useCart();
  const { data: addresses, isLoading: isAddressLoading } = useAddress();
  const { createOrder } = useOrders();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isArabic = useSelector((state: any) => state.lang.isArabic);

  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (addresses?.results?.length && selectedAddressId === null) {
      const defaultAddr = addresses.results.find((addr) => addr.is_default);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses, selectedAddressId]);

  return (
    <Flex
      direction={{ base: "column", md: isArabic ? "row-reverse" : "row" }}
      px={4}
      py={6}
      gap={8}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* ORDER SUMMARY first if Arabic */}
      {isArabic && (
        <Box
          flex={1}
          display={{ base: "none", md: "block" }}
          position="sticky"
          top={4}
          alignSelf="flex-start"
        >
          <OrderSummary
            cart={cart ?? { id: -1, items: [] }}
            isLoading={isLoading}
            isArabic={isArabic}
          />
        </Box>
      )}

      {/* Checkout form */}
      <Box flex={1}>
        <Heading size="md" mb={6} textAlign={isArabic ? "right" : "left"}>
          {isArabic ? "التوصيل" : "DELIVERY"}
        </Heading>

        <Stack spacing={4}>
          <Input
            placeholder={isArabic ? "البريد الإلكتروني" : "Email address"}
            type="email"
          />
          <Checkbox>
            {isArabic
              ? "أرسل لي الأخبار والعروض"
              : "Email me with news and offers"}
          </Checkbox>
        </Stack>

        <Box mt={8}>
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="bold">
              {isArabic ? "العناوين المحفوظة" : "SAVED ADDRESSES"}
            </Text>
            <Button size="sm" onClick={onOpen} variant="link">
              {isArabic ? "إضافة عنوان" : "Add Address"}
            </Button>
          </Flex>
          <AddAddressModal isOpen={isOpen} onClose={onClose} />
          {isAddressLoading ? (
            <Spinner color="brand.pink" />
          ) : addresses?.results?.length ? (
            <VStack spacing={4} align="stretch">
              {addresses.results.map((address) => (
                <Box
                  key={address.id}
                  onClick={() => setSelectedAddressId(address.id)}
                  cursor="pointer"
                  w="100%"
                  p={4}
                  bg={
                    address.id === selectedAddressId ? "brand.blue" : "gray.100"
                  }
                  borderRadius="md"
                  textAlign={isArabic ? "right" : "left"}
                >
                  <Text fontWeight="bold">{address.full_name}</Text>
                  <Text>{address.address_line}</Text>
                  <Text>
                    {address.city}, {address.postal_code}, {address.country}
                  </Text>
                  <Text>{address.phone}</Text>
                </Box>
              ))}
            </VStack>
          ) : (
            <Text textAlign={isArabic ? "right" : "left"}>
              {isArabic ? "لا توجد عناوين." : "No addresses found."}
            </Text>
          )}
        </Box>

        <Divider my={8} />
        <Heading size="md" mb={6} textAlign={isArabic ? "right" : "left"}>
          {isArabic ? "الدفع" : "PAYMENT"}
        </Heading>

        <Stack spacing={4}>
          <Checkbox
            isChecked={useShippingAsBilling}
            onChange={(e) => setUseShippingAsBilling(e.target.checked)}
          >
            {isArabic
              ? "استخدم عنوان الشحن كعنوان الفوترة"
              : "Use shipping address as billing address"}
          </Checkbox>
          <Input placeholder={isArabic ? "رقم البطاقة" : "Card number"} />
          <Flex gap={4} direction={isArabic ? "row-reverse" : "row"}>
            <Input
              placeholder={
                isArabic ? "تاريخ الانتهاء" : "Expiration date (MM / YY)"
              }
            />
            <Input placeholder={isArabic ? "رمز الأمان" : "Security code"} />
          </Flex>
          <Input
            placeholder={isArabic ? "الاسم على البطاقة" : "Name on card"}
          />
        </Stack>

        {!useShippingAsBilling && (
          <Stack spacing={4} mt={4}>
            <Input placeholder={isArabic ? "البلد" : "Country"} />
            <Input placeholder={isArabic ? "العنوان" : "Address"} />
            <Flex gap={4} direction={isArabic ? "row-reverse" : "row"}>
              <Input placeholder={isArabic ? "الولاية" : "State"} />
              <Input placeholder={isArabic ? "المدينة" : "City"} />
              <Input placeholder={isArabic ? "الرمز البريدي" : "ZIP code"} />
            </Flex>
          </Stack>
        )}

        <Divider my={8} />
        <Heading size="md" mb={4} textAlign={isArabic ? "right" : "left"}>
          {isArabic ? "تذكرني" : "REMEMBER ME"}
        </Heading>
        <Checkbox defaultChecked>
          {isArabic
            ? "احفظ معلوماتي لسهولة التسوق لاحقًا"
            : "Save my information for faster checkout"}
        </Checkbox>
        <InputGroup>
          <InputLeftAddon bg="brand.blue">+965</InputLeftAddon>
          <Input
            type="tel"
            placeholder={isArabic ? "رقم الهاتف" : "Mobile phone number"}
          />
        </InputGroup>

        <Box display={{ base: "block", md: "none" }} mt={10}>
          <OrderSummary
            cart={cart ?? { id: -1, items: [] }}
            isLoading={isLoading}
            isArabic={isArabic}
          />
        </Box>

        <Button
          variant="solidBlue"
          mt={6}
          w="full"
          py={7}
          onClick={() => createOrder.mutate()}
        >
          {isArabic ? "ادفع الآن" : "PAY NOW"}
        </Button>
      </Box>

      {/* Order summary last if English */}
      {!isArabic && (
        <Box
          flex={1}
          display={{ base: "none", md: "block" }}
          position="sticky"
          top={4}
          alignSelf="flex-start"
        >
          <OrderSummary
            cart={cart ?? { id: -1, items: [] }}
            isLoading={isLoading}
            isArabic={isArabic}
          />
        </Box>
      )}
    </Flex>
  );
}
