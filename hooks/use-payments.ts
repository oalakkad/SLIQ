"use client";

import { api } from "@/components/utils/api";
import { guestApi } from "@/components/utils/guestApi";
import { useAppSelector } from "@/redux/hooks";
import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

/* ────────────────────────────────────────────────────────────────
 * 🧾 MyFatoorah / Payment Gateway Types
 * ────────────────────────────────────────────────────────────────*/

export type PaymentMethod = {
  PaymentMethodId: number;
  PaymentMethodAr?: string;
  PaymentMethodEn?: string;
  ImageUrl?: string;
  ServiceCharge?: number;
  TotalAmount?: number;
  [k: string]: unknown;
};

export type InitiateResponse = {
  PaymentMethods: PaymentMethod[];
  [k: string]: unknown;
};

export type ExecutePaymentResponse = {
  paymentUrl: string;
  invoiceId?: string | number;
};

/* ────────────────────────────────────────────────────────────────
 * 🧍 Checkout / Start Payment Intent
 * ────────────────────────────────────────────────────────────────*/

/** Guest address structure used on frontend (shipping/billing) */
export type GuestAddress = {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
};

/**
 * ✅ Flattened StartCheckoutPayload
 * Matches backend that expects:
 * - guest {name,email,phone}
 * - cart contains address details
 */
export type StartCheckoutPayload = {
  /** Authenticated users: shipping address */
  address_id?: number;

  /** Authenticated users: optional billing address */
  billing_address_id?: number;

  /**
   * Guest flow: shipping and billing info
   */
  guest?: {
    name: string;
    email: string;
    phone?: string;
    shipping?: GuestAddress;
    billing?: GuestAddress;
  };

  /**
   * ✅ Cart can be anything (Cart, object, snapshot)
   * Use `unknown` here to avoid TS complaints when passing full Cart.
   */
  cart?: unknown;

  /** Optional discount code */
  discount_code?: string;
};

/** Response after start checkout */
export type StartCheckoutResponse = {
  checkoutPaymentId: number;
  amount: string;
  currency: string;
};

/* ────────────────────────────────────────────────────────────────
 * 🧾 Payment & Invoice Types
 * ────────────────────────────────────────────────────────────────*/

export type SendPaymentResponse = {
  invoiceUrl: string;
  invoiceId: string | number;
};

/* ────────────────────────────────────────────────────────────────
 * 📦 Order Types (matches backend OrderSerializer)
 * ────────────────────────────────────────────────────────────────*/

export type OrderItem = {
  id: number;
  product: any;
  quantity: number;
  price_at_purchase: string;
  addons?: any[];
};

export type Order = {
  id: number;
  status: string;
  total_price: string;
  discount_amount?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
};

export type VerifyResponse =
  | { paymentStatus: "paid"; order: Order }
  | { paymentStatus: "failed"; order: null };

/* ────────────────────────────────────────────────────────────────
 * 🧩 Error helper
 * ────────────────────────────────────────────────────────────────*/

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

/* ────────────────────────────────────────────────────────────────
 * 💳 React Query Hooks
 * ────────────────────────────────────────────────────────────────*/

/** A) Legacy send-payment (manual flow) */
export function useSendPayment() {
  return useMutation({
    mutationKey: ["payments", "send"],
    mutationFn: async (payload: { orderId: number }) => {
      try {
        const { data } = await api.post<SendPaymentResponse>(
          "payments/send/",
          payload
        );
        return data;
      } catch (e) {
        throw toError(e);
      }
    },
  });
}

/** B0) Start checkout intent (guest flattened or user ids) */
export function useStartCheckout() {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const client = isAuthenticated ? api : guestApi;

  return useMutation({
    mutationKey: ["payments", "start"],
    mutationFn: async (payload: StartCheckoutPayload) => {
      try {
        const { data } = await client.post<StartCheckoutResponse>(
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

/** B1) List available payment methods */
export function usePaymentMethods<TData = InitiateResponse, TError = Error>(
  checkoutPaymentId: number | null,
  options?: Omit<
    UseQueryOptions<InitiateResponse, TError, TData>,
    "queryKey" | "queryFn"
  >
) {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const client = isAuthenticated ? api : guestApi;

  return useQuery<InitiateResponse, TError, TData>({
    queryKey: ["payments", "initiate", checkoutPaymentId],
    enabled: !!checkoutPaymentId,
    queryFn: async () => {
      const { data } = await client.post<InitiateResponse>(
        "payments/initiate/",
        { checkoutPaymentId }
      );
      return data;
    },
    ...(options as any),
  });
}

/** B2) Execute selected payment method */
export function useExecutePayment() {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const client = isAuthenticated ? api : guestApi;

  return useMutation({
    mutationKey: ["payments", "execute"],
    mutationFn: async (payload: {
      checkoutPaymentId: number;
      paymentMethodId: number;
    }) => {
      try {
        const { data } = await client.post<ExecutePaymentResponse>(
          "payments/execute/",
          payload
        );
        return data;
      } catch (e) {
        throw toError(e);
      }
    },
  });
}

/** C) Verify payment after redirect — finalizes the Order */
export function useVerifyPayment() {
  return useMutation({
    mutationKey: ["payments", "verify"],
    mutationFn: async (p: { paymentId: string; cpId: number }) => {
      const params = new URLSearchParams({
        paymentId: p.paymentId,
        cpId: String(p.cpId),
      }).toString();

      const { data } = await guestApi.get(`/payments/verify/?${params}`, {
        withCredentials: false,
      });

      return data as VerifyResponse;
    },
  });
}
