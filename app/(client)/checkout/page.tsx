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
  useToast,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useAddress } from "@/hooks/use-address";
import AddAddressModal from "@/components/common/AddressModal";
import { Cart, useCart } from "@/hooks/use-cart";
import { useAppSelector } from "@/redux/hooks";
import SelectPaymentMethod from "@/components/payments/SelectPaymentMethod";
import { useStartCheckout } from "@/hooks/use-payments";
import axios from "axios";

/* ----------------------------- Order Summary ----------------------------- */
const OrderSummary = ({
  cart,
  isLoading,
  isArabic,
  discountResponse,
}: {
  cart: Cart;
  isLoading: boolean;
  isArabic: boolean;
  discountResponse: { code: string; amount: string } | null;
}) => {
  const parseMoney = (v: any) => Number.parseFloat(String(v ?? "0")) || 0;
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
            return (
              <Flex
                key={item.id}
                justify="space-between"
                borderBottom="1px solid"
                borderColor="gray.200"
                pb={2}
              >
                <Flex gap={3}>
                  <Box
                    boxSize="50px"
                    borderRadius="md"
                    overflow="hidden"
                    bg="gray.100"
                  >
                    <Image
                      src={item.product.image}
                      alt={isArabic ? item.product.name_ar : item.product.name}
                      objectFit="cover"
                      w="100%"
                      h="100%"
                    />
                  </Box>
                  <Box>
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
          <Text>{kwd(subtotal)}</Text>
        </Flex>

        {discountResponse && (
          <Flex justify="space-between" color="green.600">
            <Text>
              {isArabic ? "الخصم:" : "Discount:"} ({discountResponse.code})
            </Text>
            <Text>-{kwd(discountAmount)}</Text>
          </Flex>
        )}

        <Divider />

        <Flex justify="space-between" fontWeight="bold">
          <Text>{isArabic ? "الإجمالي المستحق:" : "Total:"}</Text>
          <Text>{kwd(total)}</Text>
        </Flex>
      </Stack>
    </Box>
  );
};

/* ----------------------------- Main Page ----------------------------- */
export default function CheckoutPage() {
  const toast = useToast();
  const { data: cart, isLoading } = useCart();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isArabic = useAppSelector((s) => s.lang.isArabic);
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  const { data: addresses, isLoading: isAddressLoading } = useAddress();
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );

  const [guestShipping, setGuestShipping] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
  });

  const [guestBilling, setGuestBilling] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
  });

  const [useSameAddress, setUseSameAddress] = useState(true);
  const handleGuestChange =
    (form: "shipping" | "billing") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (form === "shipping")
        setGuestShipping((prev) => ({ ...prev, [name]: value }));
      else setGuestBilling((prev) => ({ ...prev, [name]: value }));
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
      const defaultAddr = addresses.results.find((a: any) => a.is_default);
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

  /* ✅ FIX: Flatten guest data for backend */
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
          title: isArabic
            ? "اختر عنوان التوصيل"
            : "Please select a delivery address",
        });
        return;
      }
      startCheckout.mutate(
        {
          address_id: selectedAddressId,
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
      const missing = Object.entries(guestShipping).some(([_, v]) => !v);
      if (missing) {
        toast({
          status: "warning",
          title: isArabic
            ? "يرجى ملء بيانات التوصيل"
            : "Please fill in delivery details",
        });
        return;
      }

      const billingData = useSameAddress ? guestShipping : guestBilling;

      // 👇 flatten guest structure for backend
      const guestPayload = {
        name: guestShipping.name,
        email: guestShipping.email,
        phone: guestShipping.phone,
      };

      const addressPayload = {
        address_line: guestShipping.address,
        city: guestShipping.city,
        postal_code: guestShipping.postal_code,
        country: guestShipping.country,
        phone: guestShipping.phone,
        billing_address_line: billingData.address,
        billing_city: billingData.city,
        billing_postal_code: billingData.postal_code,
        billing_country: billingData.country,
        billing_phone: billingData.phone,
      };

      startCheckout.mutate(
        {
          guest: guestPayload,
          cart: addressPayload, // 🧩 flatten address inside cart_snapshot
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

  /* ----------------------------- UI ----------------------------- */
  return (
    <Flex
      direction={{ base: "column", md: isArabic ? "row-reverse" : "row" }}
      px={4}
      py={6}
      gap={8}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* ... keep your same UI below unchanged */}
    </Flex>
  );
}
