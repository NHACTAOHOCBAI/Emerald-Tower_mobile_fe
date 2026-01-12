import { ApartmentTab } from "@/components/information/ApartmentTab";
import { ResidentTab } from "@/components/information/ResidentTab";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { MOCK_APARTMENT, MOCK_RESIDENT } from "@/constants/mockInformationData";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InformationScreen() {
  const [activeTab, setActiveTab] = useState<"resident" | "apartment">("resident");
  const [residentData] = useState(MOCK_RESIDENT);
  const [apartmentData] = useState(MOCK_APARTMENT);

  return (
    <SafeAreaView className="flex-1 bg-[#F3F4F6]">
      <CustomHeader title="Thông tin cá nhân" showBackButton={true} />

      <View className="flex-row justify-center my-4 px-4">
        <View className="flex-row bg-white border border-gray-200 rounded-full p-1 w-full max-w-[320px]">
          <TouchableOpacity
            onPress={() => setActiveTab("resident")}
            className={`flex-1 py-2.5 rounded-full items-center ${
              activeTab === "resident" ? "bg-[#244B35]" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-sm font-bold ${
                activeTab === "resident" ? "text-white" : "text-gray-400"
              }`}
            >
              Cư dân
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("apartment")}
            className={`flex-1 py-2.5 rounded-full items-center ${
              activeTab === "apartment" ? "bg-[#244B35]" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-sm font-bold ${
                activeTab === "apartment" ? "text-white" : "text-gray-400"
              }`}
            >
              Căn hộ
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 mb-5" showsVerticalScrollIndicator={false}>
        <View style={{ display: activeTab === "resident" ? "flex" : "none" }}>
          <ResidentTab data={residentData} />
        </View>

        <View style={{ display: activeTab === "apartment" ? "flex" : "none" }}>
          <ApartmentTab data={apartmentData} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
