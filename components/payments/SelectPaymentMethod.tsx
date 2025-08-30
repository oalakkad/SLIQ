"use client";

import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Text,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Image,
  Badge,
  Alert,
  AlertIcon,
  HStack,
  useToast,
  Skeleton,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { usePaymentMethods, useExecutePayment } from "@/hooks/use-payments";

type Props = {
  checkoutPaymentId: number; // ✅ new required prop
  isArabicOverride?: boolean; // optional
};

export default function SelectPaymentMethod({
  checkoutPaymentId,
  isArabicOverride,
}: Props) {
  const toast = useToast();

  // if you have Redux for language, you can still read it; fall back to override
  // const isArabicFromStore = useSelector((s:any)=>s?.app?.isArabic);
  const isArabic = !!isArabicOverride; // change to your store logic if needed

  const { data, isLoading, isError, refetch } =
    usePaymentMethods(checkoutPaymentId);
  const execPay = useExecutePayment();

  const methods = useMemo(() => data?.PaymentMethods ?? [], [data]);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    if (!selected && methods.length > 0)
      setSelected(String(methods[0].PaymentMethodId));
  }, [methods, selected]);

  const t = {
    title: isArabic ? "اختر طريقة الدفع" : "Select a payment method",
    payNow: isArabic ? "ادفع الآن" : "Pay Now",
    est: isArabic ? "التكلفة التقديرية" : "Estimated",
    fee: isArabic ? "رسوم الخدمة" : "Service fee",
    failed: isArabic ? "فشل تحميل طرق الدفع" : "Failed to load payment methods",
    retry: isArabic ? "إعادة المحاولة" : "Retry",
    loading: isArabic ? "جارِ التحميل..." : "Loading...",
  };

  const onPay = () => {
    if (!selected) {
      toast({
        status: "warning",
        title: isArabic
          ? "الرجاء اختيار طريقة دفع"
          : "Please select a payment method",
      });
      return;
    }
    execPay.mutate(
      { checkoutPaymentId, paymentMethodId: Number(selected) }, // ✅ use cpId
      {
        onSuccess: ({ paymentUrl }: { paymentUrl: string }) =>
          (window.location.href = paymentUrl),
        onError: (e: any) =>
          toast({
            status: "error",
            title: t.failed,
            description: e?.message ?? "",
          }),
      }
    );
  };

  if (isLoading) {
    return (
      <Card p={4}>
        <CardHeader pb={0}>
          <Heading size="md">{t.title}</Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4} mt={2}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} h="120px" borderRadius="lg" />
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card p={4}>
        <CardHeader pb={0}>
          <Heading size="md">{t.title}</Heading>
        </CardHeader>
        <CardBody>
          <Alert status="error" mb={4}>
            <AlertIcon />
            {t.failed}
          </Alert>
          <Button onClick={() => refetch()}>{t.retry}</Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card p={4} dir={isArabic ? "rtl" : "ltr"}>
      <CardHeader pb={2}>
        <Heading size="md">{t.title}</Heading>
      </CardHeader>
      <CardBody>
        <RadioGroup value={selected} onChange={setSelected}>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
            {methods.map((m: any) => {
              const id = String(m.PaymentMethodId);
              const active = selected === id;
              return (
                <Box
                  key={m.PaymentMethodId}
                  as="label"
                  htmlFor={`pm-${m.PaymentMethodId}`}
                  borderWidth="1px"
                  borderRadius="xl"
                  p={4}
                  cursor="pointer"
                  _hover={{ borderColor: "gray.300" }}
                  borderColor={active ? "blue.400" : "gray.200"}
                  boxShadow={
                    active ? "0 0 0 1px var(--chakra-colors-blue-400)" : "none"
                  }
                  transition="all 0.15s ease"
                >
                  <Stack spacing={3}>
                    <HStack justify="space-between" align="center">
                      <Radio id={`pm-${m.PaymentMethodId}`} value={id} />
                      {typeof m.TotalAmount === "number" && (
                        <Badge borderRadius="md" px={2} py={1}>
                          {t.est}: {m.TotalAmount.toFixed(3)} KWD
                        </Badge>
                      )}
                    </HStack>

                    {m.ImageUrl ? (
                      <Box
                        w="100%"
                        h="44px"
                        position="relative"
                        overflow="hidden"
                      >
                        <Image
                          src={m.ImageUrl}
                          alt={m.PaymentMethodEn || "method"}
                          objectFit="contain"
                          w="100%"
                          h="44px"
                        />
                      </Box>
                    ) : null}

                    <Text fontWeight="semibold">
                      {isArabic
                        ? m.PaymentMethodAr || m.PaymentMethodEn
                        : m.PaymentMethodEn}
                    </Text>

                    {typeof m.ServiceCharge === "number" &&
                    m.ServiceCharge > 0 ? (
                      <Text fontSize="sm" color="gray.600">
                        {t.fee}: {m.ServiceCharge.toFixed(3)} KWD
                      </Text>
                    ) : null}
                  </Stack>
                </Box>
              );
            })}
          </SimpleGrid>
        </RadioGroup>

        <Button
          mt={6}
          size="lg"
          colorScheme="blue"
          onClick={onPay}
          isLoading={execPay.isPending}
          loadingText={t.loading}
          w={{ base: "100%", sm: "auto" }}
        >
          {t.payNow}
        </Button>
      </CardBody>
    </Card>
  );
}
