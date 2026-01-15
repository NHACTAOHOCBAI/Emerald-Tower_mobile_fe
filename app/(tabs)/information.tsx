import { ApartmentTab } from "@/components/information/ApartmentTab";
import { ResidentTab } from "@/components/information/ResidentTab";
import MyButton from "@/components/ui/Button";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { MOCK_APARTMENT, MOCK_RESIDENT } from "@/constants/mockInformationData";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";

export default function InformationScreen() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"resident" | "apartment">("resident");
  const [residentData] = useState(MOCK_RESIDENT);
  const [apartmentData] = useState(MOCK_APARTMENT);

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => void logout(),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F3F4F6]">
      <CustomHeader title="Thông tin cá nhân" showBackButton={true} />

      <View className="flex-row justify-center my-4 px-4">
        <View className="flex-row bg-white border border-gray-200 rounded-full p-1 w-full">
          <TouchableOpacity
            onPress={() => setActiveTab("resident")}
            className={`flex-1 py-2.5 rounded-full items-center ${
              activeTab === "resident" ? "bg-main" : "bg-transparent"
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
              activeTab === "apartment" ? "bg-main" : "bg-transparent"
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

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View style={{ display: activeTab === "resident" ? "flex" : "none" }}>
          <ResidentTab data={residentData} />
        </View>

        <View style={{ display: activeTab === "apartment" ? "flex" : "none" }}>
          <ApartmentTab data={apartmentData} />
        </View>

        <View className="mt-6 pb-6">
          <MyButton
            onPress={handleLogout}
            className="w-full py-3"
            textClassName="text-white font-semibold"
          >
            Đăng xuất
          </MyButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
