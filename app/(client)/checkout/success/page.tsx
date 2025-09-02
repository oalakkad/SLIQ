// app/(client)/checkout/success/page.tsx
import { Suspense } from "react";
import SuccessPageInner from "@/components/payments/SuccessPageInner";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams; // ✅ resolve the promise
  const paymentId = (params?.paymentId as string) ?? "";
  const cpIdStr = (params?.cpId as string) ?? "";
  const cpId =
    cpIdStr && !Number.isNaN(Number(cpIdStr)) ? Number(cpIdStr) : null;

  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
      <SuccessPageInner initialPaymentId={paymentId} initialCpId={cpId} />
    </Suspense>
  );
}