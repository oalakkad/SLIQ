// guestApi.ts
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const guestApi = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ send/receive Django session cookie
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

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

guestApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // never attach auth headers for guest flows
  if (config.headers) {
    delete (config.headers as any).Authorization;
    delete (config.headers as any)["X-CSRFToken"];
    delete (config.headers as any)["x-csrftoken"];
  }
  // leave cookies ON for sessions; callers can override per-request if needed
  if (typeof config.withCredentials === "undefined") {
    config.withCredentials = true;
  }
  return config;
});

guestApi.interceptors.response.use(
  (res: AxiosResponse) => res,
  (error: AxiosError) => Promise.reject(toError(error))
);