import BaseInput from "@/components/ui/BaseInput";
import { View } from "react-native";

export default function HomeScreen() {
  return (
    <View className=" p-20">
      <BaseInput placeholder="Mật khẩu" isPassword />
      <BaseInput placeholder="Số điện thoại" keyboardType="phone-pad" />

      <BaseInput placeholder="Họ và tên" />
      <BaseInput placeholder="Ghi chú" multiline numberOfLines={4} />
    </View>
  );
}
