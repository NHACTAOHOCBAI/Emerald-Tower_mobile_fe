import { MonthlyInvoice } from "@/types/payment";
import {
  Building,
  Check,
  ChevronDown,
  ChevronUp,
  Droplets,
  Square,
  Zap,
} from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface AccordionItemProps {
  data: MonthlyInvoice;
  isSelected: boolean;
  onToggleSelect: () => void;
  onPressDetail?: () => void;
}

const ICONS = {
  management: { icon: Building, bg: "rgba(36, 75, 53, 0.12)", color: "#244B35" },
  electricity: { icon: Zap, bg: "rgba(234, 179, 8, 0.15)", color: "#EAB308" },
  water: { icon: Droplets, bg: "rgba(59, 130, 246, 0.15)", color: "#3B82F6" },
};

export const AccordionItem = ({
  data,
  isSelected,
  onToggleSelect,
  onPressDetail,
}: AccordionItemProps) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <View
      className={`bg-white rounded-xl mb-4 border ${
        isSelected ? "border-secondary" : "border-0"
      } shadow-sm overflow-hidden`}
    >
      <View className="p-4 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={onToggleSelect} className="mr-3">
            {isSelected ? (
              <View className="w-6 h-6 bg-main rounded items-center justify-center">
                <Check size={16} color="white" />
              </View>
            ) : (
              <Square size={24} color="#D1D5DB" />
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onPressDetail} className="flex-1 mr-2">
            <View>
              <Text className="text-xs text-gray-400 mb-0.5">{data.invoiceCode}</Text>
              <Text className="font-bold text-base text-gray-800">{data.monthTitle}</Text>
              <Text className="text-xs text-gray-400 mt-1">{data.period}</Text>
              <Text className="text-xs text-blue-500 font-semibold mt-1">
                Xem chi tiết &gt;
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="items-end">
          <Text className="font-bold text-base text-gray-800 mr-2">
            {data.totalAmount.toLocaleString("vi-VN")} đ
          </Text>
          <TouchableOpacity onPress={() => setExpanded(!expanded)} className="p-1">
            {expanded ? (
              <ChevronUp size={20} color="#6B7280" />
            ) : (
              <ChevronDown size={20} color="#6B7280" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View className="h-[1px] bg-gray-300 w-full" />

      {expanded && (
        <View className="px-4 pb-4">
          {data.items.map((item) => {
            const IconData = ICONS[item.type];
            return (
              <View
                key={item.id}
                className="flex-row justify-between items-center py-4 last:pb-1"
              >
                <View className="flex-row items-center">
                  <View
                    style={{ backgroundColor: IconData.bg }}
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  >
                    <IconData.icon size={20} color={IconData.color} />
                  </View>
                  <View>
                    <Text className="text-sm text-gray-700 font-semibold">
                      {item.name}
                    </Text>
                    <Text className="text-xs mt-0.5 text-gray-400">{item.period}</Text>
                  </View>
                </View>

                <Text className="font-bold text-sm text-gray-700">
                  {item.amount.toLocaleString("vi-VN")} đ
                </Text>
              </View>
            );
          })}

          <View className="h-[1px] bg-gray-200 w-full my-4" />

          <View className="flex-row justify-between items-center">
            <Text className="font-bold text-main text-base">Tổng cộng</Text>
            <Text className="font-bold text-lg text-main">
              {data.totalAmount.toLocaleString("vi-VN")} đ
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};
