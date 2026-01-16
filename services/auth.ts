import type { AuthResponse, AuthUser } from "@/types/auth";
import { api } from "@/services/api";

export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data.data as AuthResponse;
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data.data as AuthUser;
};
