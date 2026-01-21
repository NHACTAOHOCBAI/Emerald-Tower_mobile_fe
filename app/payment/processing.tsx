import { useLocalSearchParams, useRouter } from "expo-router";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Linking, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MomoIcon from "@/assets/images/momo-icon";
import VNPayIcon from "@/assets/images/vnpay-icon";
import MyButton from "@/components/ui/Button";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { PaymentStatusResponse, pollPaymentStatus } from "@/services/payment.service";

type PaymentProcessingStatus =
  | "initializing" // Chuẩn bị redirect
  | "waiting" // Đợi callback từ payment gateway
  | "success" // Thanh toán thành công
  | "failed" // Thanh toán thất bại
  | "expired"; // Giao dịch hết hạn

export default function PaymentProcessingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const txnRef = (params.txnRef as string) || "";
  const paymentUrl = (params.paymentUrl as string) || "";
  const amount = params.amount ? Number(params.amount as string) : 0;
  const paymentMethod = ((params.paymentMethod as string) || "vnpay") as "momo" | "vnpay";

  const [status, setStatus] = useState<PaymentProcessingStatus>("initializing");
  const [paymentData, setPaymentData] = useState<PaymentStatusResponse | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 phút
  const [isPolling, setIsPolling] = useState(false);

  // Auto redirect sau 1 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      if (paymentUrl) {
        console.log("🔗 [Processing] Opening payment URL:", {
          paymentUrl,
          paymentMethod,
          txnRef,
        });

        Linking.openURL(paymentUrl).catch((err) => {
          console.error("❌ Failed to open payment URL:", {
            error: err,
            paymentUrl,
            errorMessage: err?.message,
          });

          // If it's a 403 or similar error, show helpful message
          if (err?.message?.includes("403")) {
            Alert.alert(
              "Lỗi 403",
              "Server từ chối kết nối. Vui lòng kiểm tra lại hoặc thử lại sau.",
            );
          } else {
            Alert.alert("Lỗi", "Không thể mở trang thanh toán. Vui lòng thử lại.");
          }
          setStatus("failed");
        });
        setStatus("waiting");
        startPolling();
      } else {
        console.error("❌ Payment URL is empty!");
        Alert.alert("Lỗi", "Link thanh toán không hợp lệ");
        setStatus("failed");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [paymentUrl]);

  // Polling để kiểm tra trạng thái
  const startPolling = async () => {
    setIsPolling(true);

    try {
      const result = await pollPaymentStatus(txnRef, 60, 2000); // Poll 60 lần, mỗi 2 giây

      setPaymentData(result);

      if (result.status === "SUCCESS") {
        setStatus("success");
        // Delay 2 giây trước khi redirect
        setTimeout(() => {
          router.push({
            pathname: "/payment/result",
            params: {
              status: "success",
              txnRef: result.txnRef,
              amount: result.amount,
              paymentMethod: result.paymentMethod,
            },
          });
        }, 2000);
      } else if (result.status === "FAILED") {
        setStatus("failed");
      } else if (result.status === "PENDING") {
        // Nếu vẫn PENDING sau khi polling xong, coi như hết hạn
        setStatus("expired");
      }
    } catch (error) {
      console.error("Lỗi khi polling trạng thái thanh toán:", error);
      setStatus("failed");
    } finally {
      setIsPolling(false);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (status !== "waiting" || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setStatus("expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, timeRemaining]);

  const getPaymentIcon = () => {
    if (paymentMethod === "momo") {
      return <MomoIcon width={40} height={40} />;
    }
    return <VNPayIcon width={40} height={40} />;
  };

  const getPaymentMethodName = () => {
    return paymentMethod === "momo" ? "Momo" : "VNPay";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRetry = () => {
    setStatus("initializing");
    setTimeRemaining(300);
    setPaymentData(null);
    Linking.openURL(paymentUrl).catch(() => {
      Alert.alert("Lỗi", "Không thể mở trang thanh toán");
    });
    setStatus("waiting");
    startPolling();
  };

  const handleBackToHome = () => {
    router.replace("/(tabs)/payment");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F3F4F6]">
      <CustomHeader
        title="Xử lý thanh toán"
        showBackButton={false}
        backgroundColor="#F3F4F6"
      />

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        {/* Status Display */}
        {status === "initializing" && (
          <View className="items-center py-12">
            <View className="bg-white rounded-full p-6 mb-4 shadow-sm">
              <ActivityIndicator color="#E09B6B" size="large" />
            </View>
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Chuẩn bị thanh toán
            </Text>
            <Text className="text-sm text-gray-500 text-center">
              Đang chuyển bạn đến {getPaymentMethodName()}...
            </Text>
          </View>
        )}

        {status === "waiting" && (
          <View className="items-center py-12">
            <View className="bg-white rounded-full p-6 mb-4 shadow-sm">
              <ActivityIndicator color="#E09B6B" size="large" />
            </View>
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Đang đợi xác nhận thanh toán
            </Text>
            <Text className="text-sm text-gray-500 text-center mb-6">
              Vui lòng hoàn thành giao dịch trên {getPaymentMethodName()}
            </Text>

            {/* Time Remaining */}
            <View className="bg-blue-50 rounded-lg p-4 mb-4 w-full">
              <Text className="text-xs font-semibold text-blue-900 mb-2">
                Thời gian còn lại
              </Text>
              <Text className="text-2xl font-bold text-blue-600">
                {formatTime(timeRemaining)}
              </Text>
            </View>

            {/* Info Card */}
            <View className="bg-gray-50 rounded-lg p-4 w-full">
              <View className="flex-row items-center mb-3">
                <View className="w-12 h-12 rounded-lg bg-white items-center justify-center mr-3">
                  {getPaymentIcon()}
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-gray-800">
                    {getPaymentMethodName()}
                  </Text>
                  <Text className="text-sm text-gray-500">Mã giao dịch: {txnRef}</Text>
                </View>
              </View>

              <View className="border-t border-gray-200 pt-3">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm text-gray-600">Số tiền:</Text>
                  <Text className="font-bold text-gray-800">
                    {amount.toLocaleString("vi-VN")} đ
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {status === "success" && (
          <View className="items-center py-12">
            <View className="bg-green-100 rounded-full p-6 mb-4">
              <CheckCircle size={60} color="#10B981" />
            </View>
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Thanh toán thành công!
            </Text>
            <Text className="text-sm text-gray-500 text-center mb-4">
              Giao dịch của bạn đã được xác nhận
            </Text>

            {paymentData && (
              <View className="bg-white rounded-lg p-4 w-full mb-4 shadow-sm">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm text-gray-600">Mã giao dịch:</Text>
                  <Text className="font-mono text-sm text-gray-800">
                    {paymentData.txnRef}
                  </Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm text-gray-600">Số tiền:</Text>
                  <Text className="font-bold text-gray-800">
                    {Number(paymentData.amount).toLocaleString("vi-VN")} đ
                  </Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm text-gray-600">Phương thức:</Text>
                  <Text className="font-semibold text-gray-800">
                    {paymentData.paymentMethod}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">Ngày thanh toán:</Text>
                  <Text className="text-sm text-gray-800">
                    {paymentData.payDate
                      ? new Date(paymentData.payDate).toLocaleString("vi-VN")
                      : "N/A"}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {status === "failed" && (
          <View className="items-center py-12">
            <View className="bg-red-100 rounded-full p-6 mb-4">
              <XCircle size={60} color="#EF4444" />
            </View>
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Thanh toán thất bại
            </Text>
            <Text className="text-sm text-gray-500 text-center mb-4">
              Giao dịch không thể hoàn thành. Vui lòng thử lại.
            </Text>

            {paymentData && (
              <View className="bg-red-50 rounded-lg p-3 w-full mb-4">
                <Text className="text-xs text-red-700 mb-2">
                  Mã giao dịch: {paymentData.txnRef}
                </Text>
              </View>
            )}
          </View>
        )}

        {status === "expired" && (
          <View className="items-center py-12">
            <View className="bg-yellow-100 rounded-full p-6 mb-4">
              <AlertCircle size={60} color="#F59E0B" />
            </View>
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Giao dịch hết hạn
            </Text>
            <Text className="text-sm text-gray-500 text-center mb-4">
              Thời gian thanh toán đã vượt quá giới hạn. Vui lòng tạo giao dịch mới.
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View className="flex-row gap-3 mt-8">
          {status === "failed" && (
            <>
              <MyButton variant="secondary" className="flex-1 h-12" onPress={handleRetry}>
                <Text className="text-white font-bold">Thử lại</Text>
              </MyButton>
              <MyButton
                className="flex-1 h-12 border border-main"
                onPress={handleBackToHome}
              >
                <Text className="text-main font-bold">Quay lại</Text>
              </MyButton>
            </>
          )}

          {status === "expired" && (
            <MyButton
              variant="secondary"
              className="w-full h-12"
              onPress={handleBackToHome}
            >
              <Text className="text-white font-bold">Quay lại thanh toán</Text>
            </MyButton>
          )}

          {status === "success" && (
            <MyButton
              variant="secondary"
              className="w-full h-12"
              onPress={handleBackToHome}
            >
              <Text className="text-white font-bold">Xong</Text>
            </MyButton>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
