import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { router } from "expo-router";
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/utils/auth-storage";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

const resolveRefreshQueue = (token: string | null) => {
  refreshQueue.forEach((callback) => callback(token));
  refreshQueue = [];
};

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    const requestUrl = originalRequest?.url || "";
    const isAuthRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/refresh");

    if (status === 401 && !originalRequest?._retry && !isAuthRequest) {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        await clearAuthStorage();
        router.replace("/(auth)/login");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((token) => {
            if (!token) {
              reject(error);
              return;
            }
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await refreshClient.post(
          "/auth/refresh",
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );

        const { accessToken, refreshToken: newRefreshToken } = refreshResponse
          .data.data as {
          accessToken: string;
          refreshToken: string;
        };

        await setTokens(accessToken, newRefreshToken);
        api.defaults.headers.Authorization = `Bearer ${accessToken}`;
        resolveRefreshQueue(accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        resolveRefreshQueue(null);
        await clearAuthStorage();
        router.replace("/(auth)/login");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
