import { ApartmentTab } from "@/components/information/ApartmentTab";
import { ResidentTab } from "@/components/information/ResidentTab";
import MyButton from "@/components/ui/Button";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useResidentProfile } from "@/hooks/useResident";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChangePasswordModal } from "@/components/information/ChangePasswordModal";
import { changePassword } from "@/services/auth";
import { LogOut } from "lucide-react-native";

export default function InformationScreen() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"resident" | "apartment">("resident");

  const { data: residentData, isLoading, isError } = useResidentProfile();
  const [pwdOpen, setPwdOpen] = useState(false);

  const submitChangePassword = async (payload: { oldPassword: string; newPassword: string }) => {
    try {
      await changePassword(payload);
      Alert.alert("Thành công", "Đổi mật khẩu thành công.");
      // logout();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Đổi mật khẩu thất bại. Vui lòng thử lại.";
      Alert.alert("Lỗi", msg);
      throw err;
    }
  };

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
            <View className="mt-6 pb-6 flex-row gap-4 justify-center">
              <MyButton
                onPress={() => setPwdOpen(true)}
                className="py-3"
                textClassName="text-white font-semibold"
              >
                Đổi mật khẩu
              </MyButton>
              <MyButton
                onPress={handleLogout}
                className="py-3"
              >
                <View className="flex-row items-center gap-2">
                  <Text className="text-white font-semibold">
                    Đăng xuất
                  </Text>
                  <LogOut size={18} color="white" />
                </View>
              </MyButton>
            </View>
          </>
        )}
      </ScrollView>
      <ChangePasswordModal
        open={pwdOpen}
        onClose={() => setPwdOpen(false)}
        onSubmit={submitChangePassword}
      />
    </SafeAreaView>
  );
}
