import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.style = { fontFamily: 'BeVietnamPro' };

export default function RootLayout() {
  const [loaded] = useFonts({
    BeVietnamPro: require('../assets/fonts/BeVietnamPro-Regular.ttf'),
    BeVietnamProMedium: require('../assets/fonts/BeVietnamPro-Medium.ttf'),
    BeVietnamProSemiBold: require('../assets/fonts/BeVietnamPro-SemiBold.ttf'),
    BeVietnamProBold: require('../assets/fonts/BeVietnamPro-Bold.ttf'),
  });

  if (!loaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}
