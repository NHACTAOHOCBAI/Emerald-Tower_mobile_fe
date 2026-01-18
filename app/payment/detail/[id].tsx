import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertCircle,
  Building,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Download,
  Droplets,
  FileText,
  Wallet,
  Zap,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TariffModal } from "@/components/payment/TariffModal";
import MyButton from "@/components/ui/Button";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { GenericTable } from "@/components/ui/Table";
import tierColumns from "./columns";

const COLORS = {
  main: "#244B35",
  secondary: "#E09B6B",
  third: "#EFEAE1",
  border: "#D9D9D9",
};

const ICONS = {
  management: { icon: Building, bg: "bg-green-50", color: "#244B35" },
  electricity: { icon: Zap, bg: "bg-yellow-50", color: "#EAB308" },
  water: { icon: Droplets, bg: "bg-blue-50", color: "#3B82F6" },
};

// mock data
const MOCK_BILL_DETAIL = {
  id: "HD2509-001",
  month: "01/2026",
  status: "unpaid",
  amount: 1250000,
  dueDate: "25/11/2025",
  customer: {
    name: "Nguyễn Lưu Ly",
    phone: "0912 345 678",
    unit: "A12.05",
  },
  fees: [
    { type: "management", name: "Phí quản lý", period: "11/2025", amount: 500000 },
    {
      type: "electricity",
      name: "Điện",
      period: "25/10 - 25/11",
      amount: 450000,
      details: {
        old: 2984,
        new: 3384,
        usage: 400,
        tiers: [
          { name: "Bậc 1 (0-50)", usage: 50, price: "1.806", total: "90.300" },
          { name: "Bậc 2 (51-100)", usage: 50, price: "1.866", total: "93.300" },
          { name: "Bậc 3 (101-200)", usage: 100, price: "2.167", total: "216.700" },
        ],
      },
    },
    {
      type: "water",
      name: "Nước",
      period: "25/10 - 25/11",
      amount: 150000,
      details: {
        old: 284,
        new: 307,
        usage: 23,
        tiers: [
          { name: "Bậc 1 (0-10)", usage: 10, price: "6.000", total: "60.000" },
          { name: "Bậc 2 (10-20)", usage: 10, price: "7.000", total: "70.000" },
          { name: "Bậc 3 (20-30)", usage: 3, price: "8.000", total: "24.000" },
        ],
      },
    },
  ],
};

export default function BillDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [data, setData] = useState(MOCK_BILL_DETAIL);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    electricity: true,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [tariffType, setTariffType] = useState<"ELEC" | "WATER" | null>(null);

  const toggleExpand = (type: string) => {
    setExpanded((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleShowTariff = (type: string) => {
    if (type === "electricity") {
      setTariffType("ELEC");
      setModalVisible(true);
    } else if (type === "water") {
      setTariffType("WATER");
      setModalVisible(true);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "paid":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          icon: CheckCircle,
          label: "Đã thanh toán",
        };
      case "overdue":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          icon: AlertCircle,
          label: "Quá hạn",
        };
      default:
        return {
          bg: "bg-orange-100",
          text: "text-orange-700",
          icon: Clock,
          label: "Chưa thanh toán",
        };
    }
  };

  const statusInfo = getStatusStyle(data.status);
  const StatusIcon = statusInfo.icon;

  return (
    <SafeAreaView className="flex-1 bg-[#F3F4F6]" edges={["top", "left", "right"]}>
      <CustomHeader title="Chi tiết hóa đơn" backgroundColor="#F3F4F6" showBorder={false}>
        <View className="flex-row items-center justify-between px-3 pb-4 mt-2">
          <TouchableOpacity className="flex-row items-center opacity-60">
            <ChevronLeft size={18} color="black" />
            <Text className="text-xs ml-1 font-medium">Tháng trước</Text>
          </TouchableOpacity>

          <Text className="font-bold text-lg text-gray-800">Tháng {data.month}</Text>

          <TouchableOpacity className="flex-row items-center opacity-60 p-2">
            <Text className="text-xs mr-1 font-medium">Tháng sau</Text>
            <ChevronRight size={18} color="black" />
          </TouchableOpacity>
        </View>
      </CustomHeader>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        <View
          className={`rounded-2xl p-4 flex-row items-center justify-between mb-4 ${statusInfo.bg}`}
        >
          <View>
            <View className="flex-row items-center gap-2 mb-2">
              <StatusIcon size={20} className={statusInfo.text} color="currentColor" />
              <Text className={`font-bold text-base ${statusInfo.text}`}>
                {statusInfo.label}
              </Text>
            </View>
            <Text className={`text-[12px] ${statusInfo.text} opacity-80`}>
              Hạn: {data.dueDate}
            </Text>
          </View>
          <Text className={`text-xl font-bold ${statusInfo.text}`}>
            {data.amount.toLocaleString("vi-VN")} đ
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-[#D9D9D9]">
          <View className="flex-row justify-between items-center mb-4 border-b border-[#D9D9D9] pb-3">
            <Text className="font-bold text-lg" style={{ color: COLORS.main }}>
              Thông tin khách hàng
            </Text>
          </View>
          <InfoRow label="Họ tên" value={data.customer.name} />
          <InfoRow label="Điện thoại" value={data.customer.phone} />
          <InfoRow label="Căn hộ" value={data.customer.unit} />
        </View>

        <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-[#D9D9D9]">
          <View className="flex-row justify-between items-center mb-4 border-b border-[#D9D9D9] pb-3">
            <Text className="font-bold text-lg" style={{ color: COLORS.main }}>
              Tóm tắt chi phí
            </Text>
          </View>
          {data.fees.map((item, idx) => {
            const IconData = ICONS[item.type as keyof typeof ICONS];
            return (
              <View key={idx} className="flex-row items-center py-3">
                <View
                  className={`w-10 h-10 ${IconData.bg} rounded-full items-center justify-center mr-3`}
                >
                  <IconData.icon size={20} color={IconData.color} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-gray-800">{item.name}</Text>
                  <Text className="text-[11px] text-gray-500">{item.period}</Text>
                  {item.details && (
                    <TouchableOpacity onPress={() => toggleExpand(item.type)}>
                      <Text className="text-[10.2px] text-blue-500 mt-0.5">
                        {expanded[item.type] ? "Thu gọn" : "Xem chi tiết"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Text className="font-bold text-gray-700">
                  {item.amount.toLocaleString("vi-VN")} đ
                </Text>
              </View>
            );
          })}
          <View className="flex-row justify-between items-center pt-4 mt-2 border-t border-[#D9D9D9]">
            <Text className="font-bold text-base" style={{ color: COLORS.main }}>
              Tổng cộng
            </Text>
            <Text className="font-extrabold text-xl" style={{ color: COLORS.main }}>
              {data.amount.toLocaleString("vi-VN")} đ
            </Text>
          </View>
        </View>

        {data.fees.map((fee) => {
          if (!fee.details || !expanded[fee.type]) return null;

          const isElectricity = fee.type === "electricity";
          const preTaxAmount = isElectricity ? Math.round(fee.amount / 1.08) : fee.amount;
          const vatAmount = fee.amount - preTaxAmount;

          return (
            <View
              key={fee.type}
              className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-[#D9D9D9]"
            >
              <View className="flex-row justify-between items-center mb-4 border-b border-[#D9D9D9] pb-3">
                <View className="flex-row items-center gap-2">
                  <Text className="font-bold text-lg text-main">
                    Tiêu thụ {fee.name.toLowerCase()}
                  </Text>

                  <TouchableOpacity
                    onPress={() => handleShowTariff(fee.type)}
                    className="flex-row items-center bg-[#EFEAE1]/50 px-3 py-1.5 rounded-full border border-[#EFEAE1]/70"
                  >
                    <FileText size={12} color="#E09B6B" />
                    <Text className="text-[10.5px] font-bold text-[#E09B6B] ml-1">
                      Xem biểu giá
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => toggleExpand(fee.type)}>
                  <ChevronUp size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <View className="flex-row gap-3 mt-2 mb-5">
                <MetricBox label="Chỉ số cũ" value={fee.details.old} />
                <MetricBox label="Chỉ số mới" value={fee.details.new} />
                <MetricBox
                  label="Tiêu thụ"
                  value={`${fee.details.usage} ${fee.type === "electricity" ? "kWh" : "m³"}`}
                  isHighlight
                />
              </View>

              <GenericTable
                data={fee.details.tiers}
                columns={tierColumns}
                footerComponent={
                  <View className="gap-2">
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-black">
                        {isElectricity ? "Tiền điện (chưa VAT):" : "Tiền nước:"}
                      </Text>
                      <Text className="text-sm font-bold">
                        {preTaxAmount.toLocaleString("vi-VN", {
                          maximumFractionDigits: 0,
                        })}{" "}
                        đ
                      </Text>
                    </View>

                    {isElectricity && (
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-black">Thuế VAT (8%):</Text>
                        <Text className="text-sm font-bold">
                          {vatAmount.toLocaleString("vi-VN", {
                            maximumFractionDigits: 0,
                          })}{" "}
                          đ
                        </Text>
                      </View>
                    )}

                    <View className="h-[1px] bg-[#D9D9D9] my-1" />
                    <View className="flex-row justify-between">
                      <Text className="font-bold text-main">Tổng cộng:</Text>
                      <Text className="font-bold text-base text-main">
                        {fee.amount.toLocaleString("vi-VN")} đ
                      </Text>
                    </View>
                  </View>
                }
              />
            </View>
          );
        })}
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-[#D9D9D9] px-5 pt-4 pb-8"
        style={{
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -5 },
        }}
      >
        <View className="flex-row gap-3">
          {data.status === "unpaid" ? (
            <>
              <View className="flex-1">
                <MyButton variant="secondary" className="h-12 w-full" onPress={() => {}}>
                  <Wallet size={18} color="white" style={{ marginRight: 8 }} />
                  <Text className="text-white font-bold text-base">Thanh toán</Text>
                </MyButton>
              </View>
              <View className="flex-1">
                <MyButton
                  variant="outline"
                  className="h-12 w-full border-[#D9D9D9]"
                  onPress={() => {}}
                >
                  <Download size={18} color="#374151" style={{ marginRight: 8 }} />
                  <Text className="text-gray-700 font-bold text-base">Tải PDF</Text>
                </MyButton>
              </View>
            </>
          ) : (
            <View className="flex-1">
              <MyButton
                variant="outline"
                className="h-12 w-full bg-gray-50 border-[#D9D9D9]"
                onPress={() => {}}
              >
                <Download size={18} color="#374151" style={{ marginRight: 8 }} />
                <Text className="text-gray-700 font-bold text-base">Tải biên lai</Text>
              </MyButton>
            </View>
          )}
        </View>
      </View>

      <TariffModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type={tariffType}
      />
    </SafeAreaView>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row justify-between py-2.5">
    <Text className="text-black text-sm">{label}</Text>
    <Text className="font-semibold text-black text-sm">{value}</Text>
  </View>
);

const MetricBox = ({ label, value }: any) => (
  <View className="flex-1 rounded-xl p-3 items-center justify-center bg-white border border-[#D9D9D9]">
    <Text className="text-xs text-black mb-1 font-semibold">{label}</Text>
    <Text className="font-bold text-sm text-main">{value}</Text>
  </View>
);
