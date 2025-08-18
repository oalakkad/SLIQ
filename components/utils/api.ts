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
 * Utilities (browser-only guards)
 * ----------------------------
 */
let hasRedirectedToLogin = false;

function isOnAuthRoute(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location?.pathname || "";
  return AUTH_ROUTES.some((p) => path.startsWith(p));
}

function safeRedirectToLogin() {
  if (typeof window === "undefined") return; // SSR: let caller handle navigation
  if (hasRedirectedToLogin) return;          // Debounce multiple redirects
  if (isOnAuthRoute()) return;               // Already on login/related page
  hasRedirectedToLogin = true;
  // replace avoids stacking history entries, which can feel like a "back" loop
  window.location.replace("/auth/login");
}

/**
 * Wait for the active refresh to complete, but time out if it takes too long.
 */
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

/**
 * ----------------------------
 * Helpers
 * ----------------------------
 */
type Cfg = AxiosRequestConfig & {
  _retryCount?: number;
  // Optional per-request escape hatches:
  //   headers: { "x-public": "1" }   -> never try refresh/redirect for this call
  //   headers: { "x-skip-auth": "1" }-> alias; same effect
};

function isPublicRequest(cfg?: AxiosRequestConfig) {
  const h = (cfg?.headers || {}) as Record<string, any>;
  // Support booleans/strings
  return h["x-public"] === "1" || h["x-public"] === true || h["x-skip-auth"] === "1" || h["x-skip-auth"] === true;
}

function shouldBypass(error: AxiosError, req: Cfg) {
  const res = error.response;

  // No response -> network/timeout/etc. Let caller decide.
  if (!res) return true;

  // Do not intercept refresh endpoint itself
  if (req.url?.includes(REFRESH_PATH)) return true;

  // Do not intercept explicitly public calls
  if (isPublicRequest(req)) return true;

  // Only handle 401; also bypass for 403/419 (often CSRF/session issues)
  if (res.status === 403 || res.status === 419) return true;
  if (res.status !== 401) return true;

  // Enforce per-request retry cap
  const count = req._retryCount ?? 0;
  if (count >= MAX_401_RETRIES) return true;

  return false;
}

/**
 * ----------------------------
 * Interceptor
 * ----------------------------
 */
api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    const originalRequest = (error.config || {}) as Cfg;

    if (shouldBypass(error, originalRequest)) {
      return Promise.reject(error);
    }

    // Track retry count for this request
    originalRequest._retryCount = (originalRequest._retryCount ?? 0) + 1;

    // If a refresh is already running, wait (with timeout) then retry
    if (isRefreshing && refreshPromise) {
      try {
        await waitForRefreshWithTimeout(REFRESH_WAIT_TIMEOUT_MS);
        return api(originalRequest);
      } catch (waitErr) {
        // If we failed waiting for refresh (timeout/fail), redirect once (client-side) then reject
        safeRedirectToLogin();
        return Promise.reject(waitErr);
      }
    }

    // Start a refresh
    isRefreshing = true;
    refreshPromise = (async () => {
      try {
        // Adjust body if your backend expects specific payload for refresh
        await api.post(REFRESH_PATH, {});
        notifyAll(true);
      } catch (e) {
        notifyAll(false);
        // Only redirect on the client and only once, not if already on an auth route
        safeRedirectToLogin();
        throw e;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();

    // Wait for the refresh we just started
    await refreshPromise;

    // Retry the original request after successful refresh
    return api(originalRequest);
  }
);
