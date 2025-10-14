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
            const addons: any[] = Array.isArray(item?.addons)
              ? item.addons
              : [];

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
                  <Stack
                    spacing={2}
                    pl={isArabic ? 0 : 12}
                    pr={isArabic ? 12 : 0}
                  >
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

  const { data: addresses, isLoading: isAddressLoading } = useAddress();
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [billingAddressId, setBillingAddressId] = useState<number | null>(null);

  const [useSameAddress, setUseSameAddress] = useState(true);

  const [guestForm, setGuestForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
  });

  const [guestBilling, setGuestBilling] = useState({
    address: "",
    city: "",
    postal_code: "",
    country: "",
    phone: "",
  });

  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuestForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuestBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuestBilling((prev) => ({ ...prev, [name]: value }));
  };

  const startCheckout = useStartCheckout();
  const [cpId, setCpId] = useState<number | null>(null);
  const [cpAmount, setCpAmount] = useState<string | null>(null);
  const [cpCurrency, setCpCurrency] = useState<string | null>(null);

  const [discountCode, setDiscountCode] = useState("");
  const [discountResponse, setDiscountResponse] = useState<null | {
    code: string;
    amount: string;
  }>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const hasItems = useMemo(() => (cart?.items?.length ?? 0) > 0, [cart]);

  useEffect(() => {
    if (
      isAuthenticated &&
      addresses?.results?.length &&
      selectedAddressId === null
    ) {
      const defaultAddr = addresses.results.find(
        (addr: any) => addr.is_default
      );
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    }
  }, [isAuthenticated, addresses, selectedAddressId]);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/api/discounts/apply/`, {
        code: discountCode,
        cart_id: cart?.id,
      });

      setDiscountResponse(res.data);
      toast({
        status: "success",
        title: isArabic ? "تم تطبيق الخصم" : "Discount applied",
      });
    } catch (err: any) {
      toast({
        status: "error",
        title: isArabic ? "فشل تطبيق الخصم" : "Failed to apply discount",
        description: err?.response?.data?.error || err?.message || "",
      });
    }
  };

  // ✅ Keep sending real cart for backend item snapshot
  const handleContinueToPayment = () => {
    if (!hasItems) {
      toast({
        status: "warning",
        title: isArabic ? "السلة فارغة" : "Cart is empty",
      });
      return;
    }

    const billingId =
      useSameAddress || !billingAddressId
        ? selectedAddressId
        : billingAddressId;

    if (isAuthenticated) {
      if (!selectedAddressId) {
        toast({
          status: "warning",
          title: isArabic
            ? "اختر عنوان التوصيل"
            : "Please select a delivery address",
        });
        return;
      }

      startCheckout.mutate(
        {
          address_id: selectedAddressId,
          billing_address_id: billingId ?? selectedAddressId,
          cart,
          discount_code: discountResponse?.code,
        },
        {
          onSuccess: ({ checkoutPaymentId, amount, currency }) => {
            setCpId(checkoutPaymentId);
            setCpAmount(amount);
            setCpCurrency(currency);
          },
        }
      );
    } else {
      // ------------------ GUEST FLOW ------------------
      if (!guestForm.name || !guestForm.email || !guestForm.phone) {
        toast({
          status: "warning",
          title: isArabic
            ? "يرجى ملء بيانات التوصيل"
            : "Please fill in delivery details",
        });
        return;
      }

      // ✅ Flatten shipping & billing into cart_snapshot for backend
      const billingData = useSameAddress ? guestForm : guestBilling;

      const cartSnapshot = {
        address_line: guestForm.address,
        city: guestForm.city,
        postal_code: guestForm.postal_code,
        country: guestForm.country,
        phone: guestForm.phone,
        billing_address_line: billingData.address,
        billing_city: billingData.city,
        billing_postal_code: billingData.postal_code,
        billing_country: billingData.country,
        billing_phone: billingData.phone,
      };

      startCheckout.mutate(
        {
          guest: {
            name: guestForm.name,
            email: guestForm.email,
            phone: guestForm.phone,
          },
          cart: cartSnapshot, // 👈 this is what verify_payment reads from
          discount_code: discountResponse?.code,
        },
        {
          onSuccess: ({ checkoutPaymentId, amount, currency }) => {
            setCpId(checkoutPaymentId);
            setCpAmount(amount);
            setCpCurrency(currency);
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
      {isArabic && (
        <Box
          flex={1}
          display={{ base: "none", md: "block" }}
          position="sticky"
          top={4}
        >
          <OrderSummary
            cart={cart ?? { id: -1, items: [] }}
            isLoading={isLoading}
            isArabic={isArabic}
            discountResponse={discountResponse}
          />
        </Box>
      )}

      <Box flex={1}>
        <Heading size="md" mb={6}>
          {isArabic ? "عنوان التوصيل" : "SHIPPING ADDRESS"}
        </Heading>

        {isAuthenticated ? (
          <>
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontWeight="bold">
                {isArabic ? "العناوين المحفوظة" : "Saved Addresses"}
              </Text>
              <Button size="sm" onClick={onOpen} variant="link">
                {isArabic ? "إضافة عنوان" : "Add Address"}
              </Button>
            </Flex>
            <AddAddressModal isOpen={isOpen} onClose={onClose} />

            {isAddressLoading ? (
              <Spinner />
            ) : (
              <VStack align="stretch">
                {addresses?.results?.map((addr: any) => (
                  <Box
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    cursor="pointer"
                    p={4}
                    bg={
                      addr.id === selectedAddressId ? "brand.blue" : "gray.100"
                    }
                    borderRadius="md"
                  >
                    <Text fontWeight="bold">{addr.full_name}</Text>
                    <Text>{addr.address_line}</Text>
                    <Text>
                      {addr.city}, {addr.postal_code}, {addr.country}
                    </Text>
                    <Text>{addr.phone}</Text>
                  </Box>
                ))}
              </VStack>
            )}

            <Divider my={6} />

            <Checkbox
              isChecked={useSameAddress}
              onChange={(e) => setUseSameAddress(e.target.checked)}
            >
              {isArabic
                ? "استخدم نفس العنوان للفواتير"
                : "Use same address for billing"}
            </Checkbox>

            {!useSameAddress && (
              <VStack align="stretch" mt={4}>
                {addresses?.results?.map((addr: any) => (
                  <Box
                    key={addr.id}
                    onClick={() => setBillingAddressId(addr.id)}
                    cursor="pointer"
                    p={4}
                    bg={
                      addr.id === billingAddressId ? "brand.blue" : "gray.100"
                    }
                    borderRadius="md"
                  >
                    <Text fontWeight="bold">{addr.full_name}</Text>
                    <Text>{addr.address_line}</Text>
                    <Text>
                      {addr.city}, {addr.postal_code}, {addr.country}
                    </Text>
                    <Text>{addr.phone}</Text>
                  </Box>
                ))}
              </VStack>
            )}
          </>
        ) : (
          <>
            {/* Guest shipping inputs */}
            <Stack spacing={3}>
              <Input
                name="name"
                placeholder={isArabic ? "الاسم الكامل" : "Full Name"}
                value={guestForm.name}
                onChange={handleGuestChange}
              />
              <Input
                name="email"
                placeholder={isArabic ? "البريد الإلكتروني" : "Email"}
                value={guestForm.email}
                onChange={handleGuestChange}
              />
              <Input
                name="phone"
                placeholder={isArabic ? "رقم الهاتف" : "Phone"}
                value={guestForm.phone}
                onChange={handleGuestChange}
              />
              <Input
                name="address"
                placeholder={isArabic ? "العنوان" : "Address"}
                value={guestForm.address}
                onChange={handleGuestChange}
              />
              <Input
                name="city"
                placeholder={isArabic ? "المدينة" : "City"}
                value={guestForm.city}
                onChange={handleGuestChange}
              />
              <Input
                name="postal_code"
                placeholder={isArabic ? "الرمز البريدي" : "Postal Code"}
                value={guestForm.postal_code}
                onChange={handleGuestChange}
              />
              <Input
                name="country"
                placeholder={isArabic ? "الدولة" : "Country"}
                value={guestForm.country}
                onChange={handleGuestChange}
              />
            </Stack>

            <Divider my={6} />

            <Checkbox
              isChecked={useSameAddress}
              onChange={(e) => setUseSameAddress(e.target.checked)}
            >
              {isArabic
                ? "استخدم نفس عنوان التوصيل للفواتير"
                : "Use same address for billing"}
            </Checkbox>

            {!useSameAddress && (
              <Stack spacing={3} mt={3}>
                <Input
                  name="address"
                  placeholder={isArabic ? "عنوان الفواتير" : "Billing Address"}
                  value={guestBilling.address}
                  onChange={handleGuestBillingChange}
                />
                <Input
                  name="city"
                  placeholder={isArabic ? "مدينة الفواتير" : "Billing City"}
                  value={guestBilling.city}
                  onChange={handleGuestBillingChange}
                />
                <Input
                  name="postal_code"
                  placeholder={
                    isArabic ? "الرمز البريدي للفواتير" : "Billing Postal Code"
                  }
                  value={guestBilling.postal_code}
                  onChange={handleGuestBillingChange}
                />
                <Input
                  name="country"
                  placeholder={isArabic ? "دولة الفواتير" : "Billing Country"}
                  value={guestBilling.country}
                  onChange={handleGuestBillingChange}
                />
              </Stack>
            )}
          </>
        )}

        <Divider my={8} />

        {/* Discount */}
        <Heading size="md" mb={4}>
          {isArabic ? "كود الخصم" : "DISCOUNT CODE"}
        </Heading>
        <Flex gap={2}>
          <Input
            placeholder={isArabic ? "أدخل كود الخصم" : "Enter discount code"}
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <Button onClick={handleApplyDiscount}>
            {isArabic ? "تطبيق" : "Apply"}
          </Button>
        </Flex>

        <Divider my={8} />

        {/* Payment */}
        <Heading size="md" mb={6}>
          {isArabic ? "الدفع" : "PAYMENT"}
        </Heading>
        {!cpId && (
          <Button
            variant="solidBlue"
            w="full"
            py={7}
            onClick={handleContinueToPayment}
            isLoading={startCheckout.isPending}
          >
            {isArabic ? "المتابعة إلى الدفع" : "Continue to Payment"}
          </Button>
        )}
        {cpId && (
          <Box mt={4}>
            {(cpAmount || cpCurrency) && (
              <Alert status="info" mb={4}>
                <AlertIcon />
                <Text>
                  {isArabic
                    ? `المبلغ المستحق: ${cpAmount} ${cpCurrency}`
                    : `Amount due: ${cpAmount} ${cpCurrency}`}
                </Text>
              </Alert>
            )}
            <SelectPaymentMethod checkoutPaymentId={cpId} />
          </Box>
        )}

        <Box display={{ base: "block", md: "none" }} mt={10}>
          <OrderSummary
            cart={cart ?? { id: -1, items: [] }}
            isLoading={isLoading}
            isArabic={isArabic}
            discountResponse={discountResponse}
          />
        </Box>
      </Box>

      {!isArabic && (
        <Box
          flex={1}
          display={{ base: "none", md: "block" }}
          position="sticky"
          top={4}
        >
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
