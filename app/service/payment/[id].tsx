import MyButton from '@/components/ui/Button';
import { CustomHeader } from '@/components/ui/CustomHeader';
import { ServiceService } from '@/services/service.service';
import { PaymentMethod } from '@/types/service';
import { useMutation, useQuery } from '@tanstack/react-query';
import { differenceInSeconds, format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, Clock, CreditCard, Info, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentScreen() {
  const { id, bookingData } = useLocalSearchParams();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );

  const { data: fetchedBooking, isLoading: isFetchingBooking } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => ServiceService.getBookingById(Number(id)),
    enabled: !!id && !bookingData,
    select: (res) => res.data,
  });

  const paymentMutation = useMutation({
    mutationFn: (body: { method: string; note: string }) =>
      ServiceService.confirmPayment(Number(id), body),
    onSuccess: (response) => {
      const result = response.data;
      router.replace({
        pathname: '/service/payment/success',
        params: {
          bookingCode: result.code,
          serviceName: result.service.name,
          customerName: result.resident.fullName,
          date: result.bookingDate,
          slots: JSON.stringify(result.timestamps),
          total: result.totalPrice,
          method: selectedMethod,
        },
      } as any);
    },
    onError: (error: any) => {
      Alert.alert(
        'Lỗi thanh toán',
        error?.response?.data?.message || 'Không thể xác nhận thanh toán'
      );
    },
  });

  const data = bookingData ? JSON.parse(bookingData as string) : fetchedBooking;
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!data?.expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const expiry = parseISO(data.expiresAt);
      const diff = differenceInSeconds(expiry, now);

      if (diff <= 0) {
        clearInterval(interval);
        Alert.alert('Hết hạn', 'Phiên giữ chỗ đã kết thúc.', [
          { text: 'Quay lại', onPress: () => router.back() },
        ]);
      } else {
        const mins = Math.floor(diff / 60);
        const secs = diff % 60;
        setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data?.expiresAt]);

  const handlePayment = () => {
    if (!selectedMethod) {
      Alert.alert('Thông báo', 'Vui lòng chọn phương thức thanh toán');
      return;
    }

    paymentMutation.mutate({
      method: selectedMethod,
      note: `Thanh toán qua ${selectedMethod} cho đơn hàng ${data.code}`,
    });
  };

  if (isFetchingBooking) return <ActivityIndicator className="flex-1" />;
  if (!data) return null;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <CustomHeader title="Thanh toán" />

      <View className="bg-orange-50 px-6 py-3 flex-row items-center border-b border-orange-100">
        <Clock size={16} color="#c2410c" />
        <Text className="text-orange-700 text-sm font-medium ml-2">
          Slot được giữ trong{' '}
          <Text className="font-bold">{timeLeft || '--:--'}</Text> phút
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="p-4 gap-y-4">
          {/* Thông tin khách hàng */}
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center mb-3">
              <User size={18} color="#244B35" />
              <Text className="text-base font-bold text-gray-800 ml-2">
                Thông tin khách hàng
              </Text>
            </View>
            <View className="p-3 gap-y-3">
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Họ tên</Text>
                <Text className="text-sm font-bold text-gray-800">
                  {data.resident.fullName}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Điện thoại</Text>
                <Text className="text-sm font-bold text-gray-800">
                  {data.resident.phoneNumber}
                </Text>
              </View>
            </View>
          </View>

          {/* Thông tin booking */}
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center mb-3">
              <Info size={18} color="#244B35" />
              <Text className="text-base font-bold text-gray-800 ml-2">
                Thông tin dịch vụ
              </Text>
            </View>

            <View className="gap-y-3">
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Mã đơn hàng</Text>
                <Text className="text-sm font-bold text-blue-600">
                  {data.code}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Dịch vụ</Text>
                <Text className="text-sm font-bold text-[#244B35]">
                  {data.service.name}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Ngày sử dụng</Text>
                <Text className="text-sm font-bold text-gray-800">
                  {format(parseISO(data.bookingDate), 'dd/MM/yyyy', {
                    locale: vi,
                  })}
                </Text>
              </View>
              <View>
                <Text className="text-sm text-gray-500 mb-2">
                  Khung giờ đã chọn:
                </Text>
                <View className="flex-row flex-wrap gap-2 mt-1">
                  {data.timestamps.map((slot: any, index: number) => (
                    <View
                      key={index}
                      className="bg-[#244B35]/10 px-3 py-1 rounded-full border border-[#244B35]/20"
                    >
                      <Text className="text-xs font-bold text-[#244B35]">
                        {slot.startTime} - {slot.endTime}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Phương thức thanh toán */}
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center mb-4">
              <CreditCard size={18} color="#244B35" />
              <Text className="text-base font-bold text-gray-800 ml-2">
                Phương thức thanh toán
              </Text>
            </View>

            {/* VNPAY */}
            <TouchableOpacity
              onPress={() => setSelectedMethod(PaymentMethod.VNPAY)}
              activeOpacity={0.7}
              className={`border-2 rounded-xl p-3 mb-3 flex-row items-center transition-all ${
                selectedMethod === PaymentMethod.VNPAY
                  ? 'border-[#244B35] bg-[#244B35]/5'
                  : 'border-gray-100'
              }`}
            >
              <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center mr-3 border border-blue-100">
                <Text className="text-blue-600 font-black text-xs">VNPAY</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-gray-800">
                  Cổng thanh toán VNPay
                </Text>
                <Text className="text-[10px] text-gray-500">
                  Thẻ ATM / QR Code / Internet Banking
                </Text>
              </View>
              <View
                className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                  selectedMethod === PaymentMethod.VNPAY
                    ? 'bg-[#244B35] border-[#244B35]'
                    : 'border-gray-300'
                }`}
              >
                {selectedMethod === PaymentMethod.VNPAY && (
                  <Check size={12} color="white" strokeWidth={4} />
                )}
              </View>
            </TouchableOpacity>

            {/* Momo */}
            <TouchableOpacity
              onPress={() => setSelectedMethod(PaymentMethod.MOMO)}
              activeOpacity={0.7}
              className={`border-2 rounded-xl p-3 flex-row items-center transition-all ${
                selectedMethod === PaymentMethod.MOMO
                  ? 'border-[#244B35] bg-[#244B35]/5'
                  : 'border-gray-100'
              }`}
            >
              <View className="w-12 h-12 bg-pink-50 rounded-xl items-center justify-center mr-3 border border-pink-100">
                <Text className="text-pink-600 font-black text-xs">MOMO</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-gray-800">
                  Ví điện tử Momo
                </Text>
                <Text className="text-[10px] text-gray-500">
                  Thanh toán nhanh qua ứng dụng Momo
                </Text>
              </View>
              <View
                className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                  selectedMethod === PaymentMethod.MOMO
                    ? 'bg-[#244B35] border-[#244B35]'
                    : 'border-gray-300'
                }`}
              >
                {selectedMethod === PaymentMethod.MOMO && (
                  <Check size={12} color="white" strokeWidth={4} />
                )}
              </View>
            </TouchableOpacity>
          </View>

          <View className="bg-[#244B35] rounded-2xl p-5 shadow-md flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-white/70 text-xs font-bold uppercase tracking-wider">
                Tổng thanh toán
              </Text>
              <Text className="text-white text-2xl font-black mt-1">
                {data.totalPrice.toLocaleString('vi-VN')} đ
              </Text>
            </View>
            <View className="bg-white/20 p-2 rounded-full">
              <CreditCard size={24} color="white" />
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="bg-white px-5 py-4 border-t border-gray-100 shadow-lg">
        <MyButton
          className={`w-full py-4 rounded-xl ${selectedMethod ? 'bg-[#E09B6B]' : 'bg-gray-300'}`}
          textClassName="font-black text-base"
          onPress={handlePayment}
          disabled={!selectedMethod}
          isLoading={paymentMutation.isPending}
        >
          XÁC NHẬN THANH TOÁN
        </MyButton>
      </View>
    </SafeAreaView>
  );
}
