import { ApartmentTab } from "@/components/information/ApartmentTab";
import { ResidentTab } from "@/components/information/ResidentTab";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { useResidentProfile } from "@/hooks/useResident";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InformationScreen() {
  const [activeTab, setActiveTab] = useState<"resident" | "apartment">("resident");

  const { data: residentData, isLoading, isError } = useResidentProfile();

  return (
    <SafeAreaView className="flex-1 bg-[#F3F4F6]">
      <CustomHeader title="Thông tin cá nhân" showBackButton={true} />

      <View className="flex-row justify-center my-4 px-4">
        <View className="flex-row bg-white border border-gray-200 rounded-full p-1 w-full">
          <TouchableOpacity
            onPress={() => setActiveTab("resident")}
            className={`flex-1 py-2.5 rounded-full items-center ${activeTab === "resident" ? "bg-main" : "bg-transparent"
              }`}
          >
            <Text
              className={`text-base font-bold ${activeTab === "resident" ? "text-white" : "text-gray-400"
                }`}
            >
              Cư dân
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("apartment")}
            className={`flex-1 py-2.5 rounded-full items-center ${activeTab === "apartment" ? "bg-main" : "bg-transparent"
              }`}
          >
            <Text
              className={`text-base font-bold ${activeTab === "apartment" ? "text-white" : "text-gray-400"
                }`}
            >
              Căn hộ
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View className="py-20 items-center">
            <ActivityIndicator size="large" color="#244B35" />
            <Text className="text-gray-500 mt-2">Đang tải thông tin...</Text>
          </View>
        ) : isError || !residentData ? (
          <View className="py-20 items-center">
            <Text className="text-red-500 font-medium">Không thể tải dữ liệu</Text>
          </View>
        ) : (
          <>
            <View style={{ display: activeTab === "resident" ? "flex" : "none" }}>
              <ResidentTab data={residentData} />
            </View>

            <View style={{ display: activeTab === "apartment" ? "flex" : "none" }}>
              <ApartmentTab data={residentData.apartments || []} />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
