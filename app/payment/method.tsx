import { useLocalSearchParams } from "expo-router";
import { CreditCard } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MomoIcon from "@/assets/images/momo-icon";
import VNPayIcon from "@/assets/images/vnpay-icon";
import MyButton from "@/components/ui/Button";
import { CustomHeader } from "@/components/ui/CustomHeader";

export default function PaymentMethodScreen() {
  // const router = useRouter();

  const { amount } = useLocalSearchParams();
  const totalAmount = amount ? Number(amount) : 0;

  const [selectedMethod, setSelectedMethod] = useState<"vnpay" | "momo">("vnpay");

  return (
    <SafeAreaView className="flex-1 bg-[#F3F4F6]">
      <CustomHeader title="Thanh toán" showBackButton backgroundColor="#F3F4F6" />

      <ScrollView className="flex-1 px-4 pt-2" showsVerticalScrollIndicator={false}>
        <View className="bg-main p-6 rounded-2xl items-center shadow-sm mb-6">
          <Text className="text-gray-300 text-xs mb-2">Số tiền cần thanh toán</Text>
          <Text className="text-white text-3xl font-bold">
            {totalAmount.toLocaleString("vi-VN")} đ
          </Text>
        </View>

        <Text className="text-lg font-bold text-main mb-3">
          Chọn phương thức thanh toán
        </Text>

        <TouchableOpacity
          onPress={() => setSelectedMethod("vnpay")}
          className="bg-white p-4 rounded-xl mb-4 flex-row items-center border shadow-sm"
          style={{ borderColor: selectedMethod === "vnpay" ? "#E09B6B" : "#F3F4F6" }}
        >
          <View className="w-10 h-10 mr-3 items-center justify-center">
            <VNPayIcon width={30} height={30} />
          </View>

          <View>
            <Text className="font-bold text-base text-gray-800">VNPay</Text>
            <Text className="text-sm text-gray-400">Thanh toán qua QR</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedMethod("momo")}
          className="bg-white p-4 rounded-xl mb-6 flex-row items-center border shadow-sm"
          style={{ borderColor: selectedMethod === "momo" ? "#E09B6B" : "#F3F4F6" }}
        >
          <View className="w-10 h-10 mr-3 items-center justify-center">
            <MomoIcon width={30} height={30} />
          </View>

          <View>
            <Text className="font-bold text-base text-gray-800">Momo</Text>
            <Text className="text-sm text-gray-400">Ví điện tử Momo</Text>
          </View>
        </TouchableOpacity>

        <MyButton
          variant="secondary"
          className="w-full h-12 shadow-md"
          onPress={() => console.log("Xác nhận thanh toán:", selectedMethod)}
        >
          <CreditCard size={20} color="white" style={{ marginRight: 5 }} />
          <Text className="text-white font-bold text-base">Xác nhận thanh toán</Text>
        </MyButton>
      </ScrollView>
    </SafeAreaView>
  );
}
