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
  useToast,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useAddress } from "@/hooks/use-address";
import AddAddressModal from "@/components/common/AddressModal";
import { Cart, CartItem, useCart } from "@/hooks/use-cart";
import { useAppSelector } from "@/redux/hooks";
import SelectPaymentMethod from "@/components/payments/SelectPaymentMethod";
import { useStartCheckout } from "@/hooks/use-payments";
import axios from "axios";

/** Order Summary card with addons */
const OrderSummary = ({
  cart,
  isLoading,
  isArabic,
  discountResponse,
}: {
  cart: Cart;
  isLoading: any;
  isArabic: boolean;
  discountResponse: { code: string; amount: string } | null;
}) => {
  const parseMoney = (v: unknown) => Number.parseFloat(String(v ?? "0")) || 0;
  const kwd = (n: number) =>
    `${n.toFixed(3)} ${isArabic ? "دينار كويتي" : "KWD"}`;

  const subtotal =
    cart?.items?.reduce((sum, item: any) => {
      const unit =
        parseMoney(item?.product?.price) + parseMoney(item?.unit_extra_price);
      return sum + unit * (item?.quantity ?? 0);
    }, 0) ?? 0;

  const discountAmount = discountResponse ? Number(discountResponse.amount) : 0;
  const total = subtotal - discountAmount;

  return (
    <Box bg="brand.yellow" borderRadius="md" p={6} minW="300px">
      <Heading size="md" mb={4} textAlign={isArabic ? "right" : "left"}>
        {isArabic ? "ملخص الطلب" : "ORDER SUMMARY"}
      </Heading>

      <Stack spacing={4}>
        {!isLoading && cart && cart?.items?.length > 0 ? (
          cart.items.map((item: any) => {
            const unit =
              parseMoney(item?.product?.price) +
              parseMoney(item?.unit_extra_price);
            const lineTotal = unit * (item?.quantity ?? 0);
            const addons: any[] = Array.isArray(item?.addons) ? item.addons : [];

            return (
              <Box
                key={item.id}
                borderBottom="1px solid"
                borderColor="gray.300"
                pb={3}
              >
                {/* Main row */}
                <Flex align="center" justify="space-between" mb={2}>
                  <Flex gap={3} align="center">
                    <Box
                      boxSize="50px"
                      bg="gray.200"
                      borderRadius="md"
                      overflow="hidden"
                    >
                      <Image
                        src={item.product.image}
                        alt={
                          isArabic ? item.product.name_ar : item.product.name
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    <Box textAlign={isArabic ? "right" : "left"}>
                      <Text fontWeight="medium">
                        {isArabic ? item.product.name_ar : item.product.name}
                      </Text>
                      <Text fontSize="sm">
                        x{item.quantity} · {kwd(unit)}
                      </Text>
                    </Box>
                  </Flex>
                  <Text fontWeight="semibold">{kwd(lineTotal)}</Text>
                </Flex>

                {/* Addons */}
                {addons.length > 0 && (
                  <Stack spacing={2} pl={isArabic ? 0 : 12} pr={isArabic ? 12 : 0}>
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
                          borderColor="gray.400"
                          borderRadius="md"
                          p={2}
                          bg="white"
                        >
                          <Text fontSize="sm" fontWeight="semibold">
                            {catName}: {addonName}
                          </Text>
                          {sel.addon?.custom_name && (
                            <Text fontSize="xs" color="gray.600">
                              {isArabic
                                ? `اسم مخصص: ${sel.addon.custom_name}`
                                : `Custom: ${sel.addon.custom_name}`}
                            </Text>
                          )}

                          {Array.isArray(sel.options) &&
                            sel.options.map((op: any) => (
                              <Flex
                                key={op.id}
                                justify="space-between"
                                fontSize="sm"
                              >
                                <Text>
                                  {isArabic ? op.name_ar || op.name : op.name}
                                </Text>
                                <Text color="gray.600">
                                  +{kwd(parseMoney(op.extra_price))}
                                </Text>
                              </Flex>
                            ))}

                          <Text fontSize="sm" fontWeight="medium" mt={1}>
                            {isArabic
                              ? `إجمالي الإضافة: ${kwd(selectionSubtotal)}`
                              : `Subtotal: ${kwd(selectionSubtotal)}`}
                          </Text>
                        </Box>
                      );
                    })}

                    <Flex justify="space-between" fontSize="sm">
                      <Text color="gray.600">
                        {isArabic
                          ? "إجمالي الزيادة لكل وحدة"
                          : "Unit extra total"}
                      </Text>
                      <Text fontWeight="semibold">
                        {kwd(parseMoney(item.unit_extra_price))}
                      </Text>
                    </Flex>
                  </Stack>
                )}
              </Box>
            );
          })
        ) : (
          <Text textAlign={isArabic ? "right" : "left"}>
            {isArabic ? "لا توجد منتجات في السلة." : "No items in cart."}
          </Text>
        )}

        <Divider />

        <Flex justify="space-between">
          <Text>{isArabic ? "الإجمالي:" : "Subtotal:"}</Text>
          <Text>
            {subtotal.toFixed(3)} {isArabic ? "دينار كويتي" : "KWD"}
          </Text>
        </Flex>

        {discountResponse && (
          <Flex justify="space-between" color="green.600">
            <Text>
              {isArabic ? "الخصم:" : "Discount:"} ({discountResponse.code})
            </Text>
            <Text>
              -{discountAmount.toFixed(3)} {isArabic ? "دينار كويتي" : "KWD"}
            </Text>
          </Flex>
        )}

        <Divider />

        <Flex justify="space-between">
          <Text fontWeight="bold">
            {isArabic ? "الإجمالي المستحق:" : "Total:"}
          </Text>
          <Text fontWeight="bold">
            {total.toFixed(3)} {isArabic ? "دينار كويتي" : "KWD"}
          </Text>
        </Flex>
      </Stack>
    </Box>
  );
};

export default function CheckoutPage() {
  const toast = useToast();
  const { data: cart, isLoading } = useCart();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isArabic = useAppSelector((state) => state.lang.isArabic);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Authenticated users: fetch saved addresses
  const { data: addresses, isLoading: isAddressLoading } = useAddress();

  // Selected address id for authenticated users
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  // Guest delivery form
  const [guestForm, setGuestForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
  });

  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuestForm((prev) => ({ ...prev, [name]: value }));
  };

  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);

  // Payment-intent hook
  const startCheckout = useStartCheckout();

  // Track checkoutPaymentId + server-confirmed amount/currency
  const [cpId, setCpId] = useState<number | null>(null);
  const [cpAmount, setCpAmount] = useState<string | null>(null);
  const [cpCurrency, setCpCurrency] = useState<string | null>(null);

  const hasItems = useMemo(() => (cart?.items?.length ?? 0) > 0, [cart]);

  // Auto-select default address for authenticated users
  useEffect(() => {
    if (isAuthenticated && addresses?.results?.length && selectedAddressId === null) {
      const defaultAddr = addresses.results.find((addr: any) => addr.is_default);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    }
  }, [isAuthenticated, addresses, selectedAddressId]);

  // --- Discount handling ---
  const [discountCode, setDiscountCode] = useState("");
  const [discountResponse, setDiscountResponse] = useState<null | { code: string; amount: string }>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const handleApplyDiscount = async () => {
  if (!discountCode.trim()) return;
  try {
    const res = await axios.post(`${API_URL}/api/discounts/apply/`, {
      code: discountCode,
      cart_id: cart?.id,
    });

    const data = res.data;
    setDiscountResponse(data);

    toast({
      status: "success",
      title: isArabic ? "تم تطبيق الخصم" : "Discount applied",
      description: isArabic ? `كود ${data.code}` : `Code ${data.code}`,
    });
  } catch (err: any) {
    toast({
      status: "error",
      title: isArabic ? "فشل تطبيق الخصم" : "Failed to apply discount",
      description: err?.response?.data?.error || err?.message || "",
    });
  }
};

  // --- Checkout handler ---
  const handleContinueToPayment = () => {
    if (!hasItems) {
      toast({
        status: "warning",
        title: isArabic ? "السلة فارغة" : "Cart is empty",
      });
      return;
    }

    if (isAuthenticated) {
      if (!selectedAddressId) {
        toast({
          status: "warning",
          title: isArabic ? "اختر عنوانًا للتوصيل" : "Please select a delivery address",
        });
        return;
      }
      startCheckout.mutate(
        { address_id: selectedAddressId, cart, discount_code: discountResponse?.code },
        {
          onSuccess: ({ checkoutPaymentId, amount, currency }) => {
            setCpId(checkoutPaymentId);
            setCpAmount(amount);
            setCpCurrency(currency);
            toast({
              status: "success",
              title: isArabic ? "جاهز للدفع" : "Ready for payment",
              description: isArabic ? "اختر طريقة الدفع" : "Select a payment method",
            });
          },
          onError: (e: any) => {
            toast({
              status: "error",
              title: isArabic ? "تعذّر التحضير للدفع" : "Failed to start payment",
              description: e?.message ?? "",
            });
          },
        }
      );
    } else {
      if (!guestForm.name || !guestForm.email || !guestForm.phone || !guestForm.address) {
        toast({
          status: "warning",
          title: isArabic
            ? "يرجى ملء بيانات التوصيل"
            : "Please fill in delivery details",
        });
        return;
      }
      startCheckout.mutate(
        {
          guest: {
            name: guestForm.name,
            email: guestForm.email,
            phone: guestForm.phone,
          },
          cart,
          discount_code: discountResponse?.code,
        },
        {
          onSuccess: ({ checkoutPaymentId, amount, currency }) => {
            setCpId(checkoutPaymentId);
            setCpAmount(amount);
            setCpCurrency(currency);
            toast({
              status: "success",
              title: isArabic ? "جاهز للدفع" : "Ready for payment",
              description: isArabic ? "اختر طريقة الدفع" : "Select a payment method",
            });
          },
          onError: (e: any) => {
            toast({
              status: "error",
              title: isArabic ? "تعذّر التحضير للدفع" : "Failed to start payment",
              description: e?.message ?? "",
            });
          },
        }
      );
    }
  };

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
        <Box flex={1} display={{ base: "none", md: "block" }} position="sticky" top={4}>
          <OrderSummary
            cart={cart ?? { id: -1, items: [] }}
            isLoading={isLoading}
            isArabic={isArabic}
            discountResponse={discountResponse}
          />
        </Box>
      )}

      {/* Checkout form */}
      <Box flex={1}>
        {/* DELIVERY SECTION */}
        <Heading size="md" mb={6} textAlign={isArabic ? "right" : "left"}>
          {isArabic ? "التوصيل" : "DELIVERY"}
        </Heading>

        {isAuthenticated ? (
          <>
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
                {addresses.results.map((address: any) => (
                  <Box
                    key={address.id}
                    onClick={() => setSelectedAddressId(address.id)}
                    cursor="pointer"
                    p={4}
                    bg={address.id === selectedAddressId ? "brand.blue" : "gray.100"}
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
              <Text>{isArabic ? "لا توجد عناوين." : "No addresses found."}</Text>
            )}
          </>
        ) : (
          <Stack spacing={3}>
            <Input
              placeholder={isArabic ? "الاسم الكامل" : "Full Name"}
              name="name"
              value={guestForm.name}
              onChange={handleGuestChange}
            />
            <Input
              placeholder={isArabic ? "البريد الإلكتروني" : "Email address"}
              type="email"
              name="email"
              value={guestForm.email}
              onChange={handleGuestChange}
            />
            <InputGroup>
              <InputLeftAddon bg="brand.blue">+965</InputLeftAddon>
              <Input
                placeholder={isArabic ? "رقم الهاتف" : "Phone number"}
                type="tel"
                name="phone"
                value={guestForm.phone}
                onChange={handleGuestChange}
              />
            </InputGroup>
            <Input
              placeholder={isArabic ? "العنوان" : "Address Line"}
              name="address"
              value={guestForm.address}
              onChange={handleGuestChange}
            />
            <Input placeholder={isArabic ? "المدينة" : "City"} name="city" value={guestForm.city} onChange={handleGuestChange} />
            <Input
              placeholder={isArabic ? "الرمز البريدي" : "Postal Code"}
              name="postal_code"
              value={guestForm.postal_code}
              onChange={handleGuestChange}
            />
            <Input placeholder={isArabic ? "الدولة" : "Country"} name="country" value={guestForm.country} onChange={handleGuestChange} />
          </Stack>
        )}

        <Divider my={8} />

        {/* DISCOUNT SECTION */}
        <Heading size="md" mb={4} textAlign={isArabic ? "right" : "left"}>
          {isArabic ? "كود الخصم" : "DISCOUNT CODE"}
        </Heading>
        <Flex gap={2}>
          <Input
            placeholder={isArabic ? "أدخل كود الخصم" : "Enter discount code"}
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <Button colorScheme="brandBlue" color={"gray.700"} onClick={handleApplyDiscount}>
            {isArabic ? "تطبيق" : "Apply"}
          </Button>
        </Flex>

        <Divider my={8} />

        {/* PAYMENT SECTION */}
        <Heading size="md" mb={6} textAlign={isArabic ? "right" : "left"}>
          {isArabic ? "الدفع" : "PAYMENT"}
        </Heading>

        {!cpId && (
          <Button
            variant="solidBlue"
            w="full"
            py={7}
            onClick={handleContinueToPayment}
            isLoading={startCheckout.isPending}
            loadingText={isArabic ? "جارِ التحضير للدفع..." : "Preparing payment..."}
            isDisabled={!hasItems || (isAuthenticated && isAddressLoading)}
          >
            {isArabic ? "المتابعة إلى الدفع" : "Continue to Payment"}
          </Button>
        )}

        {cpId && (
          <Box mt={4}>
            {(cpAmount || cpCurrency) && (
              <Alert status="info" mb={4} borderRadius="md">
                <AlertIcon />
                <Text>
                  {isArabic
                    ? `المبلغ المستحق: ${cpAmount ?? "-"} ${cpCurrency ?? "KWD"} (مؤكّد من الخادم)`
                    : `Amount due: ${cpAmount ?? "-"} ${cpCurrency ?? "KWD"} (server-confirmed)`}
                </Text>
              </Alert>
            )}
            <SelectPaymentMethod checkoutPaymentId={cpId} />
          </Box>
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

        {/* Mobile order summary */}
        <Box display={{ base: "block", md: "none" }} mt={10}>
          <OrderSummary
            cart={cart ?? { id: -1, items: [] }}
            isLoading={isLoading}
            isArabic={isArabic}
            discountResponse={discountResponse}
          />
        </Box>
      </Box>

      {/* Order summary last if English */}
      {!isArabic && (
        <Box flex={1} display={{ base: "none", md: "block" }} position="sticky" top={4}>
          <OrderSummary
            cart={cart ?? { id: -1, items: [] }}
            isLoading={isLoading}
            isArabic={isArabic}
            discountResponse={discountResponse}
          />
        </Box>
      )}
    </Flex>
  );
}