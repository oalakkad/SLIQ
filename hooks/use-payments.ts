"use client";

import { api } from "@/components/utils/api";
import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

/** ─── Types from MyFatoorah & your backend ───────────────────────────────── */

export type PaymentMethod = {
  PaymentMethodId: number;
  PaymentMethodAr?: string;
  PaymentMethodEn?: string;
  ImageUrl?: string;
  ServiceCharge?: number;
  TotalAmount?: number;
  // MyFatoorah may include more fields; keep index signature for forward-compat.
  [k: string]: unknown;
};

export type InitiateResponse = {
  PaymentMethods: PaymentMethod[];
  // Other MyFatoorah "Data" fields can show up; allow them:
  [k: string]: unknown;
};

export type ExecutePaymentResponse = {
  paymentUrl: string;
  invoiceId?: string | number;
};

export type VerifyResponse =
  | { orderId: number; paymentStatus: "paid" }
  | { orderId: null | undefined; paymentStatus: "failed" };

export type StartCheckoutPayload = {
  // Whatever you send from the client; backend recomputes totals anyway.
  address_id?: number;
  cart?: unknown;
};

export type StartCheckoutResponse = {
  checkoutPaymentId: number;
  amount: string;   // e.g. "11.000"
  currency: string; // e.g. "KWD"
};

/** Optional legacy one-step (not used in your new flow, kept for compatibility) */
export type SendPaymentResponse = {
  invoiceUrl: string;
  invoiceId: string | number;
};

/** ─── Error helper ───────────────────────────────────────────────────────── */

function toError(e: unknown): Error {
  const ax = e as AxiosError<any>;
  const msg =
    ax?.response?.data?.detail ??
    ax?.response?.data?.message ??
    ax?.response?.data?.error ??
    ax?.message ??
    "Request failed";
  return new Error(msg);
}

/** A) One-step (legacy): create hosted invoice link (SendPayment) */
export function useSendPayment() {
  return useMutation({
    mutationKey: ["payments", "send"],
    mutationFn: async (payload: { orderId: number }) => {
      try {
        const { data } = await api.post<SendPaymentResponse>("payments/send/", payload);
        return data;
      } catch (e) {
        throw toError(e);
      }
    },
  });
}

/** B0) Start checkout (creates CheckoutPayment + returns cpId/amount/currency) */
export function useStartCheckout() {
  return useMutation({
    mutationKey: ["payments", "start"],
    mutationFn: async (payload: StartCheckoutPayload) => {
      try {
        const { data } = await api.post<StartCheckoutResponse>(
          "payments/checkout/start/",
          payload
        );
        return data;
      } catch (e) {
        throw toError(e);
      }
    },
  });
}

/** B1) List payment methods for a checkout payment intent (InitiatePayment) */
export function usePaymentMethods<
  TData = InitiateResponse,
  TError = Error
>(
  checkoutPaymentId: number | null,
  options?: Omit<UseQueryOptions<InitiateResponse, TError, TData>, "queryKey" | "queryFn">
) {
  return useQuery<InitiateResponse, TError, TData>({
    queryKey: ["payments", "initiate", checkoutPaymentId],
    enabled: !!checkoutPaymentId,
    queryFn: async () => {
      const { data } = await api.post<InitiateResponse>("payments/initiate/", {
        checkoutPaymentId, // ✅ send cpId
      });
      return data;
    },
    ...(options as any),
  });
}

/** B2) Execute the chosen method (returns redirect PaymentURL) */
export function useExecutePayment() {
  return useMutation({
    mutationKey: ["payments", "execute"],
    mutationFn: async (payload: { checkoutPaymentId: number; paymentMethodId: number }) => {
      try {
        const { data } = await api.post<ExecutePaymentResponse>("payments/execute/", payload);
        return data;
      } catch (e) {
        throw toError(e);
      }
    },
  });
}

/**
 * C) Verify after redirect:
 *   GET /payments/verify/?paymentId=...&cpId=...
 *   - 200 → { orderId, paymentStatus: "paid" }
 *   - 400 → axios throws; surface error (treat as failed in UI)
 *
 * Note: The "x-public" header avoids auth refresh on a fresh tab.
 */
export function useVerifyPayment() {
  return useMutation({
    mutationKey: ["payments", "verify"],
    mutationFn: async (p: { paymentId: string; cpId: number }) => {
      // mark it "public" via query param (not a header)
      const params = new URLSearchParams({
        paymentId: p.paymentId,
        cpId: String(p.cpId),
        public: "1",
      }).toString();

      // IMPORTANT: no headers, no cookies here
      const { data } = await api.get(`/payments/verify/?${params}`, {
        withCredentials: false,
        // do not set any headers here
      });

      return data as { paymentStatus: string; orderId?: number | null };
    },
  });
}