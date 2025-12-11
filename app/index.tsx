import { useFonts } from "expo-font";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import "../global.css";
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
        <ActivityIndicator />
      </View>
    );
  }

  return <Redirect href="/(tabs)/home" />;
}
