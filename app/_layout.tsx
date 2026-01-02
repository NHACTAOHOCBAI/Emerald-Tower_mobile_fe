import { useFonts } from "expo-font";
import { Stack } from "expo-router"; // Sử dụng Stack để tạo context
import { ActivityIndicator, Text, View } from "react-native";
import "../global.css";

// Cấu hình font mặc định
(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.style = { fontFamily: "BeVietnamPro" };

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

  // Stack sẽ cung cấp Navigation Context cho toàn bộ app
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Nó sẽ tự động tìm đến app/(tabs)/_layout.tsx và render index bên trong đó */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
