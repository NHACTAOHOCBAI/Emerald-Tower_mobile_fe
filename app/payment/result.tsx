import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle, Copy, Share2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Clipboard,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MyButton from "@/components/ui/Button";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { getPaymentByTxnRef, PaymentStatusResponse } from "@/services/payment.service";

export default function PaymentResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const status = ((params.status as string) || "success") as "success" | "failed";
  const txnRef = (params.txnRef as string) || "";
  const amount = params.amount ? Number(params.amount as string) : 0;
  const paymentMethod = (params.paymentMethod as string) || "VNPay";

  const [paymentDetails, setPaymentDetails] = useState<PaymentStatusResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        if (txnRef) {
          const details = await getPaymentByTxnRef(txnRef);
          setPaymentDetails(details);
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết giao dịch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [txnRef]);

  const handleCopyTxnRef = async () => {
    await Clipboard.setString(txnRef);
    Alert.alert("Thông báo", "Đã sao chép mã giao dịch");
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Giao dịch thanh toán\nMã: ${txnRef}\nSố tiền: ${amount.toLocaleString("vi-VN")} đ\nPhương thức: ${paymentMethod}`,
      });
    } catch (error) {
      console.error("Lỗi khi chia sẻ:", error);
    }
  };

  const handleDownloadReceipt = () => {
    Alert.alert("Thông báo", "Chức năng tải hóa đơn sẽ sớm được cập nhật");
  };

  const handleBackToPayment = () => {
    router.replace("/(tabs)/payment");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F3F4F6]">
      <CustomHeader
        title="Kết quả thanh toán"
        showBackButton={false}
        backgroundColor="#F3F4F6"
      />

      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        {/* Status Badge */}
        <View className="items-center mb-6">
          <View className="bg-green-100 rounded-full p-6 mb-4">
            <CheckCircle size={60} color="#10B981" />
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            {status === "success" ? "Thanh toán thành công" : "Thanh toán thất bại"}
          </Text>
          <Text className="text-sm text-gray-500">
            {status === "success"
              ? "Giao dịch của bạn đã được xác nhận"
              : "Giao dịch không thể hoàn thành"}
          </Text>
        </View>

        {/* Amount Display */}
        <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <Text className="text-gray-500 text-sm mb-2">Số tiền thanh toán</Text>
          <Text className="text-4xl font-bold text-main mb-4">
            {amount.toLocaleString("vi-VN")} đ
          </Text>
          <View className="border-t border-gray-200 pt-4">
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-600">Phương thức</Text>
              <Text className="font-semibold text-gray-800">{paymentMethod}</Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-600">Trạng thái</Text>
              <Text
                className={`font-semibold ${
                  status === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {status === "success" ? "Thành công" : "Thất bại"}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Thời gian</Text>
              <Text className="text-gray-800">
                {paymentDetails?.payDate
                  ? new Date(paymentDetails.payDate).toLocaleString("vi-VN")
                  : "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Transaction Details */}
        <View className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <Text className="font-bold text-gray-800 mb-4">Chi tiết giao dịch</Text>

          {/* TxnRef */}
          <View className="bg-gray-50 rounded-lg p-3 mb-3">
            <Text className="text-xs text-gray-500 mb-1">Mã giao dịch</Text>
            <View className="flex-row items-center justify-between">
              <Text className="font-mono text-sm text-gray-800 flex-1">{txnRef}</Text>
              <TouchableOpacity onPress={handleCopyTxnRef} className="ml-2 p-2">
                <Copy size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {paymentDetails && (
            <>
              {/* Created At */}
              <View className="bg-gray-50 rounded-lg p-3 mb-3">
                <Text className="text-xs text-gray-500 mb-1">Ngày tạo giao dịch</Text>
                <Text className="text-sm text-gray-800">
                  {new Date(paymentDetails.createdAt).toLocaleString("vi-VN")}
                </Text>
              </View>

              {/* Target Info */}
              {paymentDetails.targetType && (
                <View className="bg-gray-50 rounded-lg p-3">
                  <Text className="text-xs text-gray-500 mb-1">Loại thanh toán</Text>
                  <Text className="text-sm text-gray-800">
                    {paymentDetails.targetType === "INVOICE" ? "Hóa đơn" : "Booking"}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-2 mb-4">
          <TouchableOpacity
            onPress={handleShare}
            className="flex-1 bg-white rounded-lg p-3 shadow-sm items-center"
          >
            <Share2 size={24} color="#E09B6B" />
            <Text className="text-xs text-gray-600 mt-1">Chia sẻ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDownloadReceipt}
            className="flex-1 bg-white rounded-lg p-3 shadow-sm items-center"
          >
            <Copy size={24} color="#E09B6B" />
            <Text className="text-xs text-gray-600 mt-1">Xuất hóa đơn</Text>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View className="bg-blue-50 rounded-lg p-4 mb-6">
          <Text className="text-xs font-semibold text-blue-900 mb-2">
            GHI CHÚ QUAN TRỌNG
          </Text>
          <Text className="text-xs text-blue-800 leading-5">
            • Kiểm tra email để nhận biên lai thanh toán{"\n"}• Giao dịch có thể mất vài
            phút để được cập nhật{"\n"}• Giữ lại mã giao dịch cho hỗ trợ trong tương lai
          </Text>
        </View>

        {/* Primary Button */}
        <MyButton
          variant="secondary"
          className="w-full h-12 mb-4"
          onPress={handleBackToPayment}
        >
          <Text className="text-white font-bold">Quay lại trang thanh toán</Text>
        </MyButton>

        {status === "failed" && (
          <MyButton
            className="w-full h-12 border border-main"
            onPress={() => router.back()}
          >
            <Text className="text-main font-bold">Thử thanh toán khác</Text>
          </MyButton>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
