// api.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * ----------------------------
 * Config
 * ----------------------------
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const REFRESH_PATH = "/jwt/refresh/";

const REFRESH_WAIT_TIMEOUT_MS = 5000;
const MAX_401_RETRIES = 1;

// Paths where we should NOT redirect again if already there
const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/forgot-password"];

/**
 * ----------------------------
 * Axios instance
 * ----------------------------
 */
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

/**
 * ----------------------------
 * Refresh coordination
 * ----------------------------
 */
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

type Subscriber = (ok: boolean) => void;
const subscribers: Subscriber[] = [];

function subscribe(cb: Subscriber) {
  subscribers.push(cb);
}

function notifyAll(ok: boolean) {
  subscribers.splice(0).forEach((cb) => cb(ok));
}

/**
 * ----------------------------
 * Helpers
 * ----------------------------
 */
let hasRedirectedToLogin = false;

function isOnAuthRoute(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location?.pathname || "";
  return AUTH_ROUTES.some((p) => path.startsWith(p));
}

function safeRedirectToLogin() {
  if (typeof window === "undefined") return;
  if (hasRedirectedToLogin) return;
  if (isOnAuthRoute()) return;
  hasRedirectedToLogin = true;
  window.location.replace("/auth/login");
}

function waitForRefreshWithTimeout(timeoutMs: number) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Token refresh timed out"));
    }, timeoutMs);

    subscribe((ok) => {
      clearTimeout(timer);
      if (ok) resolve();
      else reject(new Error("Token refresh failed"));
    });
  });
}

type Cfg = AxiosRequestConfig & { _retryCount?: number };

/**
 * Check if request is public (skip auth/cookies/refresh)
 * Convention: add `config.public = true` when calling api
 */
function isPublicRequest(cfg?: any): boolean {
  if (!cfg) return false;
  if (cfg.public) return true;

  const url = (cfg.url || "").toString();
  if (url.includes("/payments/verify/")) return true;

  return false;
}

function shouldBypass(error: AxiosError, req: Cfg) {
  const res = error.response;

  if (!res) return true;
  if (req.url?.includes(REFRESH_PATH)) return true;
  if (isPublicRequest(req)) return true;

  if (res.status === 403 || res.status === 419) return true;
  if (res.status !== 401) return true;

  const count = req._retryCount ?? 0;
  if (count >= MAX_401_RETRIES) return true;

  return false;
}

/**
 * ----------------------------
 * Interceptors
 * ----------------------------
 */

// Request interceptor: make public calls simple (no cookies/headers)
api.interceptors.request.use((config: any) => {
  if (isPublicRequest(config)) {
    config.withCredentials = false;
    if (config.headers) {
      delete config.headers.Authorization;
      delete config.headers["X-CSRFToken"];
      delete config.headers["x-csrftoken"];
    }
  }
  return config;
});

// Response interceptor: refresh handling
api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    const originalRequest = (error.config || {}) as Cfg;

    if (shouldBypass(error, originalRequest)) {
      return Promise.reject(error);
    }

    originalRequest._retryCount = (originalRequest._retryCount ?? 0) + 1;

    if (isRefreshing && refreshPromise) {
      try {
        await waitForRefreshWithTimeout(REFRESH_WAIT_TIMEOUT_MS);
        return api(originalRequest);
      } catch (waitErr) {
        safeRedirectToLogin();
        return Promise.reject(waitErr);
      }
    }

    // Start a refresh
    isRefreshing = true;
    refreshPromise = (async () => {
      try {
        await api.post(REFRESH_PATH, {});
        notifyAll(true);
      } catch (e) {
        notifyAll(false);
        safeRedirectToLogin();
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
