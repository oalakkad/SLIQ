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
} from "@chakra-ui/react";
import { useVerifyPayment } from "@/hooks/use-payments";
import { useSelector } from "react-redux";

export default function SuccessPage(props: any) {
  const { searchParams } = props;
  const router = useRouter();
  const isArabic = useSelector((s: any) => s.lang.isArabic);
  const verify = useVerifyPayment();

  const paymentId = (searchParams?.paymentId as string) || "";
  const cpId = searchParams?.cpId as string | undefined;

  useEffect(() => {
    if (paymentId && cpId && verify.isIdle) {
      verify.mutate({ paymentId, cpId: Number(cpId) });
    }
  }, [paymentId, cpId, verify.isIdle]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!paymentId || !cpId) {
    return (
      <Box p={8}>
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

  if (verify.isIdle || verify.isPending) {
    return (
      <Box p={8} textAlign="center">
        <Spinner size="lg" color="brand.pink" />
        <Heading mt={4} size="md">
          {isArabic ? "جاري التحقق من الدفع..." : "Verifying your payment..."}
        </Heading>
      </Box>
    );
  }

  if (verify.isError) {
    return (
      <Box p={8} textAlign="center">
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
      </Box>
    );
  }

  const data = verify.data as {
    paymentStatus: "paid" | "failed";
    orderId?: number | null;
  };

  return (
    <Box p={8} textAlign="center">
      {data?.paymentStatus === "paid" ? (
        <>
          <Heading size="lg">
            {isArabic ? "تم الدفع بنجاح" : "Payment Successful"}
          </Heading>
          <Text mt={3}>
            {isArabic
              ? `رقم الطلب: ${data.orderId}`
              : `Your order number is ${data.orderId}.`}
          </Text>
          <Button mt={6} onClick={() => router.push("/orders")}>
            {isArabic ? "عرض الطلب" : "View Order"}
          </Button>
        </>
      ) : (
        <>
          <Heading size="lg">
            {isArabic ? "فشل الدفع" : "Payment Failed"}
          </Heading>
          <Button mt={6} onClick={() => router.push("/cart")}>
            {isArabic ? "العودة إلى السلة" : "Back to cart"}
          </Button>
        </>
      )}
    </Box>
  );
}
