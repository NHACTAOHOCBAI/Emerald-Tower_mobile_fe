import { MapPin } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { ApartmentInfo } from "@/types/information";

interface ApartmentTabProps {
  data: ApartmentInfo;
}

export const ApartmentTab = ({ data }: ApartmentTabProps) => {
  return (
    <View className="mt-2">
      <Text className="text-secondary font-BeVietnamProSemi text-lg mb-4">
        Thông tin căn hộ
      </Text>

      <View className="bg-white rounded-2xl p-5 shadow-sm mb-6 border border-third">
        <Text className="text-xl font-BeVietnamProBold text-main mb-6">
          Phòng {data.code}
        </Text>

        <View className="flex-row flex-wrap justify-between">
          <StatBox label="Diện tích" value={data.area} color="bg-third" />
          <StatBox label="Tòa" value={data.block} color="bg-[#E0E7E4]" />
          <StatBox label="Tầng" value={data.floor} color="bg-third" />
          <StatBox label="Loại" value={data.type} color="bg-[#E0E7E4]" />
        </View>

        <View className="flex-row items-start mt-2 pt-4 border-t border-gray-100">
          <MapPin size={20} color="#244B35" style={{ marginTop: 2 }} />
          <View className="ml-3">
            <Text className="text-gray-400 font-BeVietnamPro text-sm">
              Địa chỉ đầy đủ
            </Text>
            <Text className="text-foreground font-BeVietnamProMedium text-md mt-1">
              {data.fullAddress}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const StatBox = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <View className={`w-[48%] ${color} rounded-xl p-4 mb-4 items-center justify-center`}>
    <Text className="text-gray-500 font-BeVietnamPro text-xs mb-1">{label}</Text>
    <Text className="text-main font-BeVietnamProBold text-lg">{value}</Text>
  </View>
);
