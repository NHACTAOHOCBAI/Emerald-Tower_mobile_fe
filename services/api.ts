import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { router } from "expo-router";
import {
  clearAuthStorage,
  getAccessToken,
  setAccessToken,
} from "@/utils/auth-storage";

const baseURL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000/api";

export const api = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
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

const forceLogout = async () => {
  await clearAuthStorage();
  router.replace("/(auth)/login");
};

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (!error.response) return Promise.reject(error);

    const status = error.response.status;
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    const url = String(original?.url ?? "");

    // Không refresh cho chính auth endpoints
    if (url.includes("/auth/")) return Promise.reject(error);

    // Chỉ xử lý 401 và chỉ retry 1 lần
    if (status !== 401 || original._retry) return Promise.reject(error);

    // Nếu đang refresh -> đợi
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((token) => {
          if (!token) return reject(error);
          original.headers = original.headers ?? {};
          (original.headers as any).Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      // Refresh token nằm trong cookie httpOnly -> chỉ cần gọi refresh
      const rr = await refreshClient.post("/auth/refresh");

      // Backend có thể trả accessToken theo nhiều shape
      const accessToken: string | undefined =
        (rr.data as any)?.accessToken ?? (rr.data as any)?.data?.accessToken;

      if (!accessToken) throw new Error("No accessToken in refresh response");

      await setAccessToken(accessToken);

      // set default header cho các request sau
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      // giải phóng queue
      resolveRefreshQueue(accessToken);

      // retry request cũ với token mới
      original.headers = original.headers ?? {};
      (original.headers as any).Authorization = `Bearer ${accessToken}`;
      return api(original);
    } catch (e) {
      resolveRefreshQueue(null);
      await forceLogout();
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  },
);
