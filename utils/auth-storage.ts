import * as SecureStore from "expo-secure-store";
import type { AuthUser } from "@/types/auth";

const ACCESS_TOKEN_KEY = "access_token";
const USER_KEY = "auth_user";

/** ===== Access token ===== */
export const getAccessToken = async () => {
  return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
};

export const setAccessToken = async (accessToken: string) => {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
};

export const clearTokens = async () => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
};

/** ===== User ===== */
export const getStoredUser = async () => {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const setStoredUser = async (user: AuthUser) => {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
};

export const clearStoredUser = async () => {
  await SecureStore.deleteItemAsync(USER_KEY);
};

export const clearAuthStorage = async () => {
  await Promise.all([clearTokens(), clearStoredUser()]);
};

/** ===== JWT expire check (RN-safe) ===== */
const base64UrlDecode = (input: string) => {
  // base64url -> base64
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  // padding
  while (base64.length % 4) base64 += "=";

  // RN: use global Buffer if available (expo thường có)
  // Nếu TS báo lỗi Buffer, cài: npm i buffer và thêm polyfill ở entry.
  const json = Buffer.from(base64, "base64").toString("utf8");
  return json;
};

export const isJwtExpired = (token: string) => {
  try {
    const payloadStr = base64UrlDecode(token.split(".")[1]);
    const payload = JSON.parse(payloadStr);
    const expMs = payload.exp * 1000;
    return Date.now() >= expMs - 5000; // 5s buffer
  } catch {
    return true;
  }
};
