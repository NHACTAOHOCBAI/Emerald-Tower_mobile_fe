import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { Stack, router, useSegments } from "expo-router";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

const queryClient = new QueryClient();

// Deep linking configuration
const linking = {
  prefixes: ["emerald://", "https://emerald.app", "https://localhost"],
  config: {
    screens: {
      "payment/result": "payments/result",
      "(tabs)/payment": "payments",
      "payment/processing": "payments/processing",
      "(auth)/login": "auth/login",
    },
  },
};

const AuthGate = ({ children }: { children: ReactNode }) => {
  const { user, isLoading, logout } = useAuth();
  const segments = useSegments();
  const inAuthGroup = segments[0] === "(auth)";

  useEffect(() => {
    if (isLoading) return;

    if (user?.role && user.role !== "RESIDENT") {
      Alert.alert("Đăng nhập thất bại", "Sai tài khoản hoặc mật khẩu.");
      void logout();
      router.replace("/(auth)/login");
      return;
    }
    if (user && inAuthGroup) {
      router.replace("/(tabs)/home");
    }
    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
      return;
    }
  }, [user, inAuthGroup, isLoading, logout]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
};

export default function RootLayout() {
  // Handle deep linking on app startup
  useEffect(() => {
    const handleDeepLink = async () => {
      const url = await Linking.getInitialURL();
      if (url != null) {
        console.log("[DeepLink] Initial URL:", url);
        // Parse and log the URL
        const parsed = Linking.parse(url);
        console.log("[DeepLink] Parsed initial URL:", {
          path: parsed.path,
          queryParams: parsed.queryParams,
        });
      }

      // Listen for URL updates during app lifecycle
      const subscription = Linking.addEventListener("url", ({ url }) => {
        console.log("[DeepLink] Received URL during runtime:", url);
        const parsed = Linking.parse(url);
        console.log("[DeepLink] Parsed URL:", {
          path: parsed.path,
          queryParams: parsed.queryParams,
        });
        // Expo Router will automatically route based on linking config
      });

      return () => subscription.remove();
    };

    handleDeepLink().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SafeAreaProvider>
          <AuthGate>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
              linking={linking}
            >
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </AuthGate>
        </SafeAreaProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
