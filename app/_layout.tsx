import type { ReactNode } from "react";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack, router, useSegments } from "expo-router";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import "../global.css";

(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.style = { fontFamily: 'BeVietnamPro' };

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
  const [loaded] = useFonts({
    BeVietnamPro: require("../assets/fonts/BeVietnamPro-Regular.ttf"),
    BeVietnamProMedium: require("../assets/fonts/BeVietnamPro-Medium.ttf"),
    BeVietnamProSemiBold: require("../assets/fonts/BeVietnamPro-SemiBold.ttf"),
    BeVietnamProBold: require("../assets/fonts/BeVietnamPro-Bold.ttf"),
  });

  if (!loaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <AuthGate>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </AuthGate>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
