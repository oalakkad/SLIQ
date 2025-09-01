"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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

// Props passed from server page
type SuccessPageInnerProps = {
  initialPaymentId: string;
  initialCpId: number | null;
};

export default function SuccessPageInner({
  initialPaymentId,
  initialCpId,
}: SuccessPageInnerProps) {
  const router = useRouter();
  const isArabic = useSelector((s: any) => s.lang.isArabic);
  const verify = useVerifyPayment();

  // Debug logging
  useEffect(() => {
    console.log("[SuccessPageInner] mounted with", {
      initialPaymentId,
      initialCpId,
      verify,
    });
  }, [initialPaymentId, initialCpId, verify]);

  // Trigger verification once on mount
  useEffect(() => {
    if (initialPaymentId && initialCpId && verify.isIdle) {
      verify.mutate({ paymentId: initialPaymentId, cpId: initialCpId });
    }
  }, [initialPaymentId, initialCpId, verify.isIdle]); // eslint-disable-line react-hooks/exhaustive-deps

  // Missing params
  if (!initialPaymentId || !initialCpId) {
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
    console.error("[SuccessPageInner] verify error:", verify.error);
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

  // Success
  const data = verify.data as {
    paymentStatus: "paid" | "failed";
    order: {
      id: number;
      user: number | null;
      status: string;
      total_price: string;
      created_at: string;
      updated_at: string;
      items: any[];
      guest_email?: string | null;
    } | null;
  };

  const isGuestOrder = !data?.order?.user;

  return (
    <Flex
      p={8}
      textAlign="center"
      minH={"50vh"}
      flexDir={"column"}
      justifyContent={"center"}
    >
      {data?.paymentStatus === "paid" && data.order ? (
        <VStack justifyContent={"center"}>
          <Heading size="lg">
            {isArabic ? "تم الدفع بنجاح" : "Payment Successful"}
          </Heading>

          <Text mt={3}>
            {isArabic
              ? `رقم الطلب: ${data.order.id}`
              : `Your order number is ${data.order.id}.`}
          </Text>

          {isGuestOrder ? (
            <Text mt={4} maxW="lg">
              {isArabic
                ? "لقد تم تسجيل طلبك بنجاح. ستصلك التحديثات عبر البريد الإلكتروني الذي أدخلته."
                : "Your order has been placed successfully. You will receive updates via the email you provided."}
            </Text>
          ) : (
            <Button mt={6} onClick={() => router.push("/orders")} w={"lg"}>
              {isArabic ? "عرض الطلب" : "View Order"}
            </Button>
          )}
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