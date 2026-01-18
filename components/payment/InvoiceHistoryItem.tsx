import { ChevronRight } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

const STATUS_CONFIG = {
  paid: { text: "Đã thanh toán", bg: "bg-green-100", color: "text-green-600" },
  unpaid: { text: "Chưa thanh toán", bg: "bg-orange-100", color: "text-orange-500" },
  overdue: { text: "Quá hạn", bg: "bg-red-100", color: "text-red-500" },
};

interface InvoiceHistoryItemProps {
  item: any;
  onPress?: () => void;
}

export const InvoiceHistoryItem = ({ item, onPress }: InvoiceHistoryItemProps) => {
  const config =
    STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.unpaid;

  return (
    <TouchableOpacity
      className="bg-white p-4 rounded-xl mb-3 flex-row justify-between shadow-sm border border-gray-100"
      onPress={onPress}
    >
      <View className="flex-1 mr-2 justify-center">
        <Text className="text-xs text-gray-400 mb-1">{item.invoiceCode || item.id}</Text>
        <Text className="font-bold text-base text-gray-800 mb-1">{item.title}</Text>
        <Text className="text-sm text-gray-400">Hạn: {item.dueDate}</Text>
      </View>

      <View className="items-end justify-between">
        <Text className="font-bold text-lg text-main mb-2">
          {item.amount.toLocaleString("vi-VN")} đ
        </Text>

        <View className="items-end">
          <View className={`${config.bg} px-2 py-1 rounded-md mb-1`}>
            <Text className={`${config.color} text-[10px] font-bold`}>{config.text}</Text>
          </View>

          <ChevronRight size={15} color="#9CA3AF" />
        </View>
      </View>
    </TouchableOpacity>
  );
};
