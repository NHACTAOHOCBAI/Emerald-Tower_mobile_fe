import { useRouter } from "expo-router";
import { BarChart3, Plus } from "lucide-react-native";
import React, { useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { InvoiceHistoryItem } from "@/components/payment/InvoiceHistoryItem";
import MyButton from "@/components/ui/Button";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { MOCK_HISTORY } from "@/constants/mockPaymentData";

const parseDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
};

export default function PaymentScreen() {
  const router = useRouter();

  const { totalDebt, invoiceCount, nearestDueDate } = useMemo(() => {
    const activeInvoices = MOCK_HISTORY.filter(
      (item) => item.status === "unpaid" || item.status === "overdue"
    );

    const total = activeInvoices.reduce((sum, item) => sum + item.amount, 0);

    // hạn thanh toán gần nhất
    let nearest = null;
    if (activeInvoices.length > 0) {
      const sortedByDate = [...activeInvoices].sort(
        (a, b) => parseDate(a.dueDate).getTime() - parseDate(b.dueDate).getTime()
      );
      nearest = sortedByDate[0].dueDate;
    }

    return {
      totalDebt: total,
      invoiceCount: activeInvoices.length,
      nearestDueDate: nearest,
    };
  }, []); // call api -> truyền data

  return (
    <SafeAreaView className="flex-1 bg-[#F3F4F6]">
      <CustomHeader title="Thanh toán" backgroundColor="#F3F4F6" />

      <ScrollView className="flex-1 px-4 pt-2" showsVerticalScrollIndicator={false}>
        <View className="bg-main rounded-2xl p-5 mb-5 shadow-sm">
          <Text className="text-gray-300 text-xs mb-1">Tổng nợ hiện tại</Text>
          <Text className="text-white text-3xl font-bold mb-1">
            {totalDebt.toLocaleString("vi-VN")} đ
          </Text>

          <Text className="text-gray-300 text-xs mb-4">
            {nearestDueDate
              ? `Hạn thanh toán gần nhất: ${nearestDueDate}`
              : "Bạn không có khoản nợ nào"}
          </Text>

          <MyButton
            variant="secondary"
            className="w-full h-12"
            textClassName="font-bold text-base"
            onPress={() => router.push("/payment")}
            disabled={invoiceCount === 0}
          >
            {invoiceCount > 0
              ? `Thanh toán ngay (${invoiceCount} hóa đơn)`
              : "Không có hóa đơn cần thanh toán"}
          </MyButton>
        </View>

        <View className="flex-row gap-4 mb-6">
          <TouchableOpacity className="flex-1 bg-transparent p-3 rounded-xl border border-gray-400 flex-row items-center justify-center">
            <Plus size={20} color="#244B35" />
            <Text className="ml-2 font-semibold text-gray-800">Nhập chỉ số</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 bg-transparent p-3 rounded-xl border border-gray-400 flex-row items-center justify-center">
            <BarChart3 size={20} color="#E09B6B" />
            <Text className="ml-2 font-semibold text-gray-800">Thống kê</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-lg font-bold text-main mb-3">Lịch sử hóa đơn</Text>
        <View className="pb-10">
          {MOCK_HISTORY.map((item) => (
            <InvoiceHistoryItem key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
