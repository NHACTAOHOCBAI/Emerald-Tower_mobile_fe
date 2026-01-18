import { CustomHeader } from "@/components/ui/CustomHeader";
import { GenericTable } from "@/components/ui/Table";
import { StatisticsItem } from "@/types/payment";
import { Droplets, Wallet, Zap } from "lucide-react-native";
import { useMemo } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import statisticsColumns from "./columns";

const screenWidth = Dimensions.get("window").width;

const COLORS = {
  elec: "#FACC15",
  water: "#3B82F6",
  total: "#244B35",
  service: "#F97316",
  grid: "#D1D5DB",
  text: "#6B7280",
};

const formatCurrency = (value: number) => {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1).replace(".0", "") + " tỷ";
  }
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(".0", "") + " tr";
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(0) + "k";
  }
  return value.toString();
};

// parse string tiền về number
const parseAmount = (amount: string) => {
  return Number(amount.replace(/\./g, ""));
};

const formatYLabel = (value: string) => {
  const num = Number(value);
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(".0", "") + "tỷ";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(".0", "") + "tr";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(0) + "k";
  }
  return num.toString();
};

const STATISTICS_DATA: StatisticsItem[] = [
  {
    month: "T01/2026",
    elec: "354.345",
    water: "154.345",
    service: "50.000",
    total: "558.690",
  },
  {
    month: "T12/2025",
    elec: "300.000",
    water: "120.000",
    service: "50.000",
    total: "470.000",
  },
  {
    month: "T11/2025",
    elec: "280.000",
    water: "110.000",
    service: "50.000",
    total: "440.000",
  },
  {
    month: "T10/2025",
    elec: "290.000",
    water: "115.000",
    service: "50.000",
    total: "455.000",
  },
  {
    month: "T09/2025",
    elec: "310.000",
    water: "130.000",
    service: "50.000",
    total: "490.000",
  },
  {
    month: "T08/2025",
    elec: "300.000",
    water: "125.000",
    service: "50.000",
    total: "475.000",
  },
];

export default function StatisticsScreen() {
  // tính toán trung bình tự động
  const statistics = useMemo(() => {
    if (!STATISTICS_DATA || STATISTICS_DATA.length === 0) {
      return {
        avgElec: "0",
        avgWater: "0",
        avgTotal: "0",
      };
    }

    const totalElec = STATISTICS_DATA.reduce(
      (sum, item) => sum + parseAmount(item.elec),
      0,
    );
    const totalWater = STATISTICS_DATA.reduce(
      (sum, item) => sum + parseAmount(item.water),
      0,
    );
    const totalAmount = STATISTICS_DATA.reduce(
      (sum, item) => sum + parseAmount(item.total),
      0,
    );

    const count = STATISTICS_DATA.length;

    return {
      avgElec: formatCurrency(Math.round(totalElec / count)),
      avgWater: formatCurrency(Math.round(totalWater / count)),
      avgTotal: formatCurrency(Math.round(totalAmount / count)),
    };
  }, []);

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(36, 75, 53, ${opacity})`,

    decimalPlaces: 0,

    // format Y label với suffix
    formatYLabel: formatYLabel,

    propsForDots: {
      r: "5",
      strokeWidth: "2.5",
      stroke: "#fff",
    },

    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: COLORS.grid,
      strokeWidth: 0.8,
      opacity: 0.3,
    },

    propsForLabels: {
      fontSize: 12,
      fontWeight: "500",
    },

    labelColor: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,

    fillShadowGradientFrom: "#ffffff",
    fillShadowGradientTo: "#ffffff",
    fillShadowGradientFromOpacity: 0,
    fillShadowGradientToOpacity: 0,
  };

  const chartData = {
    labels: ["T8", "T9", "T10", "T11", "T12", "T1"],
    datasets: [
      {
        data: [475000, 490000, 455000, 440000, 470000, 558690],
        color: () => `rgba(36, 75, 53, 1)`,
        strokeWidth: 2.8,
      },
      {
        data: [300000, 310000, 290000, 280000, 300000, 354345],
        color: () => `rgba(250, 204, 21, 1)`,
        strokeWidth: 2.5,
      },
      {
        data: [125000, 130000, 115000, 110000, 120000, 154345],
        color: () => `rgba(59, 130, 246, 1)`,
        strokeWidth: 2.5,
      },
      {
        data: [50000, 50000, 50000, 50000, 50000, 50000],
        color: () => `rgba(249, 115, 22, 1)`,
        strokeWidth: 2.2,
      },
    ],
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F3F4F6]">
      <CustomHeader title="Thống kê" showBorder={false} backgroundColor="#F3F4F6" />
      <ScrollView className="flex-1 px-4 pt-1" showsVerticalScrollIndicator={false}>
        <Text className="text-center text-gray-500 text-sm mb-5 font-medium">
          So sánh chi phí 6 tháng gần nhất
        </Text>

        <View className="flex-row justify-between gap-3 mb-6">
          <SummaryCard
            icon={Zap}
            color="#FACC15"
            label="Điện TB"
            value={statistics.avgElec}
          />
          <SummaryCard
            icon={Droplets}
            color="#3B82F6"
            label="Nước TB"
            value={statistics.avgWater}
          />
          <SummaryCard
            icon={Wallet}
            color="#244B35"
            label="Tổng TB"
            value={statistics.avgTotal}
          />
        </View>

        <Text className="font-bold text-lg text-main mb-3">Biểu đồ biến động</Text>
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <View className="flex-row flex-wrap justify-center gap-x-4 gap-y-2 mb-4 px-2 mt-3">
            <LegendItem color={COLORS.total} label="Tổng tiền" />
            <LegendItem color={COLORS.elec} label="Điện" />
            <LegendItem color={COLORS.water} label="Nước" />
            <LegendItem color={COLORS.service} label="Phí QL" />
          </View>
          <View className="items-center overflow-hidden">
            <LineChart
              data={chartData}
              width={screenWidth - 20}
              height={220}
              chartConfig={chartConfig}
              bezier
              withDots={true}
              withInnerLines={true}
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLabels={true}
              withShadow={false}
              fromZero
              segments={5}
              formatYLabel={formatYLabel}
              yAxisInterval={1}
            />
          </View>
        </View>

        <View className="mb-10">
          <GenericTable
            title="Bảng chi tiết"
            data={STATISTICS_DATA}
            columns={statisticsColumns}
          />
          <View className="mt-2.5">
            <Text className="text-[11px] text-gray-500 text-center">
              Đơn vị tính: VNĐ
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const SummaryCard = ({ icon: Icon, color, label, value }: any) => (
  <View className="bg-white flex-1 p-3 rounded-2xl shadow-sm items-center justify-center border border-gray-100">
    <View className="p-2 rounded-full mb-2" style={{ backgroundColor: `${color}15` }}>
      <Icon size={18} color={color} />
    </View>
    <Text className="text-[11px] text-gray-500 text-center mb-1 font-medium">
      {label}
    </Text>
    <Text className="text-sm font-bold text-gray-800 text-center">{value}</Text>
  </View>
);

const LegendItem = ({ color, label }: any) => (
  <View className="flex-row items-center">
    <View className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: color }} />
    <Text className="text-xs text-gray-500 font-medium">{label}</Text>
  </View>
);
