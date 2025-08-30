"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Button,
  Alert,
  AlertIcon,
  Flex,
  VStack,
} from "@chakra-ui/react";
import { useVerifyPayment } from "@/hooks/use-payments";
import { useSelector } from "react-redux";

export default function SuccessPageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const isArabic = useSelector((s: any) => s.lang.isArabic);
  const verify = useVerifyPayment();

  const paymentId = params.get("paymentId") || "";
  const cpId = params.get("cpId");

  // Trigger verification once on mount
  useEffect(() => {
    if (paymentId && cpId && verify.isIdle) {
      verify.mutate({ paymentId, cpId: Number(cpId) });
    }
  }, [paymentId, cpId, verify.isIdle]); // eslint-disable-line react-hooks/exhaustive-deps

  // Missing params
  if (!paymentId || !cpId) {
    return (
      <Box p={8} minH={"50vh"}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Text>
            {isArabic
              ? "معرّفات الدفع غير مكتملة في الرابط."
              : "Missing required payment identifiers in the URL."}
          </Text>
        </Alert>
      </Box>
    );
  }

  // Idle or pending → show spinner
  if (verify.isIdle || verify.isPending) {
    return (
      <VStack p={8} minH={"50vh"} textAlign="center" justifyContent={"center"}>
        <Spinner size="lg" />
        <Heading mt={4} size="md">
          {isArabic ? "جاري التحقق من الدفع..." : "Verifying your payment..."}
        </Heading>
      </VStack>
    );
  }

  // Error → failed
  if (verify.isError) {
    return (
      <VStack p={8} textAlign="center" minH={"50vh"} justifyContent={"center"}>
        <Alert status="error" borderRadius="md" mb={4}>
          <AlertIcon />
          <Text>
            {isArabic
              ? "فشل الدفع أو تم إلغاؤه."
              : "Payment failed or was cancelled."}
          </Text>
        </Alert>
        <Button onClick={() => router.push("/cart")}>
          {isArabic ? "العودة إلى السلة" : "Back to cart"}
        </Button>
      </VStack>
    );
  }

  // Success: API returned data
  const data = verify.data as {
    paymentStatus: "paid" | "failed";
    orderId?: number | null;
  };

  return (
    <Flex
      p={8}
      textAlign="center"
      minH={"50vh"}
      flexDir={"column"}
      justifyContent={"center"}
    >
      {data?.paymentStatus === "paid" ? (
        <VStack justifyContent={"center"}>
          <Heading size="lg">
            {isArabic ? "تم الدفع بنجاح" : "Payment Successful"}
          </Heading>
          <Text mt={3}>
            {isArabic
              ? `رقم الطلب: ${data.orderId}`
              : `Your order number is ${data.orderId}.`}
          </Text>
          <Button mt={6} onClick={() => router.push("/orders")} w={"lg"}>
            {isArabic ? "عرض الطلب" : "View Order"}
          </Button>
        </VStack>
      ) : (
        <>
          <Heading size="lg">
            {isArabic ? "فشل الدفع" : "Payment Failed"}
          </Heading>
          <Button mt={6} onClick={() => router.push("/cart")} w={"lg"}>
            {isArabic ? "العودة إلى السلة" : "Back to cart"}
          </Button>
        </>
      )}
    </Flex>
  );
}
