import { useLocalSearchParams, useRouter } from "expo-router";
import { CreditCard } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AccordionItem } from "@/components/payment/MonthInvoiceAccordion";
import MyButton from "@/components/ui/Button";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { useResidentInvoices } from "@/hooks/useInvoice";

export default function PaymentDetailScreen() {
  const router = useRouter();
  const { filterIds } = useLocalSearchParams(); // nhận Ids từ trang trước

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { data: invoices, isLoading } = useResidentInvoices();

  // lọc hóa đơn cần thanh toán trong filterIds
  const unpaidInvoices = useMemo(() => {
    let list =
      invoices?.filter((i) => i.status === "UNPAID" || i.status === "OVERDUE") || [];

    if (filterIds) {
      try {
        const ids = JSON.parse(filterIds as string);
        if (Array.isArray(ids) && ids.length > 0) {
          list = list.filter((inv) => ids.includes(inv.id));
        }
      } catch (e) {
        console.error("Lỗi parse filterIds", e);
      }
    }
    return list;
  }, [invoices, filterIds]);

  const handleToggle = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleGoToDetail = (invoiceId: number) => {
    router.push({
      pathname: "/payment/detail/[id]",
      params: { id: invoiceId },
    });
  };

  // tính tổng tiền hóa đơn được chọn
  const totalPay = useMemo(() => {
    return unpaidInvoices
      .filter((bill) => selectedIds.includes(bill.id))
      .reduce((sum, bill) => sum + Number(bill.totalAmount), 0);
  }, [selectedIds, unpaidInvoices]);

  // auto select all (chọn tất cả khi vào trang)
  useMemo(() => {
    if (unpaidInvoices.length > 0 && selectedIds.length === 0) {
      setSelectedIds(unpaidInvoices.map((i) => i.id));
    }
  }, [unpaidInvoices]);

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
            {Math.round(totalPay).toLocaleString("vi-VN")} đ
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
                params: { amount: Math.round(totalPay) },
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
        <Text className="text-lg font-bold text-main mb-4">
          Chọn hóa đơn ({unpaidInvoices.length})
        </Text>

        {isLoading ? (
          <ActivityIndicator color="#244B35" />
        ) : (
          unpaidInvoices.map((bill) => (
            <AccordionItem
              key={bill.id}
              data={bill}
              isSelected={selectedIds.includes(bill.id)}
              onToggleSelect={() => handleToggle(bill.id)}
              onPressDetail={() => handleGoToDetail(bill.id)}
            />
          ))
        )}

        {unpaidInvoices.length === 0 && !isLoading && (
          <Text className="text-center text-gray-400 mt-10">
            Không có hóa đơn nào cần thanh toán
          </Text>
        )}

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
