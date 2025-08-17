import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const REFRESH_PATH = "/jwt/refresh/";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

// 🔹 Refresh coordination
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;
type Subscriber = (ok: boolean) => void;
const subscribers: Subscriber[] = [];
function subscribe(cb: Subscriber) { subscribers.push(cb); }
function notify(ok: boolean) { subscribers.splice(0).forEach(cb => cb(ok)); }

// --- Interceptor ---
api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    const { response, config } = error;
    const originalRequest = config as AxiosRequestConfig & { _retry?: boolean };

    if (!response) return Promise.reject(error);
    if (originalRequest.url?.includes(REFRESH_PATH)) return Promise.reject(error);
    if (response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribe((ok) => ok ? resolve(api(originalRequest)) : reject(error));
      });
    }

    isRefreshing = true;
    refreshPromise = (async () => {
      try {
        await api.post(REFRESH_PATH, {});
        notify(true);
      } catch (e) {
        notify(false);
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        throw e;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();

    await refreshPromise;
    return api(originalRequest);
  }
);
