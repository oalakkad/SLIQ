// app/payments/success/page.tsx
import { Suspense } from "react";
import SuccessPageInner from "@/components/payments/SuccessPageInner";

export default function Page({
  searchParams,
}: {
  searchParams: { paymentId?: string; cpId?: string };
}) {
  const paymentId = (searchParams?.paymentId ?? "").toString();
  const cpIdStr = (searchParams?.cpId ?? "").toString();
  const cpId = cpIdStr && !Number.isNaN(Number(cpIdStr)) ? Number(cpIdStr) : null;

  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
      <SuccessPageInner initialPaymentId={paymentId} initialCpId={cpId} />
    </Suspense>
  );
}