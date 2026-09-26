import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({ baseURL, withCredentials: true });

// no interceptors here, so a failed refresh can never trigger another refresh
const refreshClient = axios.create({ baseURL, withCredentials: true });

// a 401 on these means bad credentials, not an expired token
const AUTH_ROUTES_WITHOUT_REFRESH = ["auth/login", "auth/register", "auth/try-demo"];

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface QueuedRequest {
  retry: () => void;
  reject: () => void;
}

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

function isAuthRoute(url: string | undefined): boolean {
  const path = (url ?? "").replace(/^\/+/, "");

  return AUTH_ROUTES_WITHOUT_REFRESH.some((route) => path.startsWith(route));
}

function settleQueue(isRefreshSuccessful: boolean): void {
  failedQueue.forEach((request) => (isRefreshSuccessful ? request.retry() : request.reject()));
  failedQueue = [];
}

// full page navigation also resets react state and the query cache
function logout(): void {
  localStorage.removeItem("isAuthenticated");

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (error.response?.status !== 401 || !originalRequest || isAuthRoute(originalRequest.url)) {
      return Promise.reject(error);
    }

    // already retried once after a refresh and still unauthorized
    if (originalRequest._retry) {
      logout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          retry: () => resolve(api(originalRequest)),
          // each caller gets its own original error back
          reject: () => reject(error),
        });
      });
    }

    isRefreshing = true;

    try {
      await refreshClient.post("/auth/refresh");
    } catch {
      settleQueue(false);
      logout();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }

    settleQueue(true);

    return api(originalRequest);
  }
);

export default api;
