import { useRouter } from "expo-router";
import { CreditCard } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AccordionItem } from "@/components/payment/MonthInvoiceAccordion";
import MyButton from "@/components/ui/Button";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { MOCK_DETAIL_INVOICES } from "@/constants/mockPaymentData";

export default function PaymentDetailScreen() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleGoToDetail = (invoiceId: string) => {
    router.push({
      pathname: "/payment/detail/[id]",
      params: { id: invoiceId },
    });
  };

  // tính tổng tiền
  const totalPay = useMemo(() => {
    return MOCK_DETAIL_INVOICES.filter((bill) => selectedIds.includes(bill.id)).reduce(
      (sum, bill) => sum + bill.totalAmount,
      0,
    );
  }, [selectedIds]);

  return (
    <SafeAreaView className="flex-1 bg-[#F3F4F6]">
      <CustomHeader
        title="Chi tiết thanh toán"
        showBackButton
        backgroundColor="#F3F4F6"
      />

      <View className="px-4">
        <View className="bg-main p-6 rounded-2xl items-center shadow-sm">
          <Text className="text-gray-300 text-xs mb-2">Số tiền cần thanh toán</Text>
          <Text className="text-white text-3xl font-bold">
            {totalPay.toLocaleString("vi-VN")} đ
          </Text>
        </View>

        <View className="mt-4 mb-2">
          <MyButton
            variant="secondary"
            className="w-full h-12 shadow-md"
            disabled={selectedIds.length === 0}
            onPress={() => {
              router.push({
                pathname: "/payment/method",
                params: { amount: totalPay },
              });
            }}
          >
            <CreditCard size={20} color="white" style={{ marginRight: 5 }} />
            <Text className="text-white font-bold text-base">
              Thanh toán ({selectedIds.length} hóa đơn)
            </Text>
          </MyButton>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 mt-2" showsVerticalScrollIndicator={false}>
        <Text className="text-lg font-bold text-main mb-4">Chọn hóa đơn</Text>

        {MOCK_DETAIL_INVOICES.map((bill) => (
          <AccordionItem
            key={bill.id}
            data={bill}
            isSelected={selectedIds.includes(bill.id)}
            onToggleSelect={() => handleToggle(bill.id)}
            onPressDetail={() => handleGoToDetail(bill.id)}
          />
        ))}

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
