import { CustomHeader } from '@/components/ui/CustomHeader';
import { MOCK_SERVICES } from '@/constants/mockServiceData';
import { PaymentMethod } from '@/types/service';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, Clock, CreditCard, Info, User } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentScreen() {
  const { id, date, slots, total } = useLocalSearchParams();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );

  const service = MOCK_SERVICES.find((s) => s.id === Number(id));
  const parsedSlots = slots ? JSON.parse(slots as string) : [];
  const totalAmount = Number(total);

  if (!service) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text>Không tìm thấy dịch vụ</Text>
      </SafeAreaView>
    );
  }

  const timeSlots = parsedSlots.map((slot: string) => {
    const [start, end] = slot.split('-');
    return { start, end };
  });

  const formattedDate = format(new Date(date as string), 'dd/MM/yyyy', {
    locale: vi,
  });

  const handlePayment = () => {
    if (!selectedMethod) {
      Alert.alert('Thông báo', 'Vui lòng chọn phương thức thanh toán');
      return;
    }

    Alert.alert(
      'Xác nhận thanh toán',
      `Bạn có chắc muốn thanh toán ${totalAmount.toLocaleString(
        'vi-VN'
      )} đ qua ${selectedMethod}?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: () => {
            router.replace({
              pathname: '/service/payment/success',
              params: {
                bookingCode: 'DV-TN-001-023',
                serviceName: service.name,
                date: date,
                slots: slots,
                total: total,
                method: selectedMethod,
              },
            } as any);
          },
        },
      ]
    );
  };

  const remainingTime = '4:59';

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <CustomHeader title="Thanh toán" />

      <View className="bg-orange-50 px-6 py-3 flex-row items-center border-b border-orange-100">
        <Clock size={16} color="#c2410c" />
        <Text className="text-orange-700 text-sm font-medium ml-2">
          Slot được giữ trong <Text className="font-bold">{remainingTime}</Text>{' '}
          phút
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
            <View className="bg-gray-50 rounded-xl p-3 gap-y-3">
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Họ tên</Text>
                <Text className="text-sm font-bold text-gray-800">
                  Nguyễn Lưu Ly
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Điện thoại</Text>
                <Text className="text-sm font-bold text-gray-800">
                  0912345678
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Căn hộ</Text>
                <Text className="text-sm font-bold text-gray-800">A12.05</Text>
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
                <Text className="text-sm text-gray-500">Dịch vụ</Text>
                <Text className="text-sm font-bold text-[#244B35]">
                  {service.name}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Ngày sử dụng</Text>
                <Text className="text-sm font-bold text-gray-800">
                  {formattedDate}
                </Text>
              </View>
              <View>
                <Text className="text-sm text-gray-500 mb-2">
                  Khung giờ đã chọn:
                </Text>
                <View className="flex-row flex-wrap gap-2 mt-1">
                  {timeSlots.map((slot: any, index: number) => (
                    <View
                      key={index}
                      className="bg-[#244B35]/10 px-3 py-1 rounded-full border border-[#244B35]/20"
                    >
                      <Text className="text-xs font-bold text-[#244B35]">
                        {slot.start} - {slot.end}
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

          {/* Tổng cộng */}
          <View className="bg-[#244B35] rounded-2xl p-5 shadow-md flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-white/70 text-xs font-bold uppercase tracking-wider">
                Tổng thanh toán
              </Text>
              <Text className="text-white text-2xl font-black mt-1">
                {totalAmount.toLocaleString('vi-VN')} đ
              </Text>
            </View>
            <View className="bg-white/20 p-2 rounded-full">
              <CreditCard size={24} color="white" />
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="bg-white px-5 py-4 border-t border-gray-100 shadow-lg">
        <TouchableOpacity
          className={`py-4 rounded-xl shadow-sm ${
            selectedMethod ? 'bg-[#E09B6B]' : 'bg-gray-300'
          }`}
          onPress={handlePayment}
          disabled={!selectedMethod}
        >
          <Text className="text-white text-center font-black text-base">
            Xác nhận thanh toán
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
