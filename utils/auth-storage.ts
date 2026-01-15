import * as SecureStore from "expo-secure-store";
import type { AuthUser } from "@/types/auth";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "auth_user";

export const getAccessToken = async () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

export const getRefreshToken = async () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

export const setTokens = async (accessToken: string, refreshToken: string) => {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = async () => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};

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
  await clearTokens();
  await clearStoredUser();
};
