import { CustomHeader } from '@/components/ui/CustomHeader';
import { MOCK_SERVICES } from '@/constants/mockServiceData';
import { PaymentMethod } from '@/types/service';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { router, useLocalSearchParams } from 'expo-router';
import { Check } from 'lucide-react-native';
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
      <View className="bg-orange-100 px-3 py-1.5 rounded-full mx-6">
        <Text className="text-orange-700 text-sm font-semibold">
          Slot được giữ trong <Text className="font-bold">{remainingTime}</Text>{' '}
          phút
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-5">
          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-base font-bold text-gray-800 mb-3">
              Thông tin khách hàng
            </Text>
            <View className="space-y-2">
              <View className="flex-row justify-between py-2">
                <Text className="text-sm text-gray-600">Họ tên:</Text>
                <Text className="text-sm font-semibold text-gray-800">
                  Nguyễn Lưu Ly
                </Text>
              </View>
              <View className="flex-row justify-between py-2">
                <Text className="text-sm text-gray-600">Điện thoại:</Text>
                <Text className="text-sm font-semibold text-gray-800">
                  0912345678
                </Text>
              </View>
              <View className="flex-row justify-between py-2">
                <Text className="text-sm text-gray-600">Căn hộ:</Text>
                <Text className="text-sm font-semibold text-gray-800">
                  A12.05
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-base font-bold text-gray-800 mb-3">
              Thông tin booking
            </Text>
            <View className="space-y-2">
              <View className="flex-row justify-between py-2">
                <Text className="text-sm text-gray-600">Loại dịch vụ:</Text>
                <Text className="text-sm font-semibold text-gray-800">
                  {service.name}
                </Text>
              </View>
              <View className="flex-row justify-between py-2">
                <Text className="text-sm text-gray-600">Ngày:</Text>
                <Text className="text-sm font-semibold text-gray-800">
                  {formattedDate}
                </Text>
              </View>
              <View className="py-2">
                <Text className="text-sm text-gray-600 mb-2">Thời gian:</Text>
                {timeSlots.map((slot: any, index: number) => (
                  <Text
                    key={index}
                    className="text-sm font-semibold text-gray-800 ml-2"
                  >
                    {slot.start} - {slot.end}
                    {index < timeSlots.length - 1 && ','}
                  </Text>
                ))}
              </View>
              <View className="flex-row justify-between py-2">
                <Text className="text-sm text-gray-600">Đơn giá:</Text>
                <Text className="text-sm font-semibold text-gray-800">
                  {service.unit_price.toLocaleString('vi-VN')} đ/1h
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-base font-bold text-gray-800 mb-3">
              Chọn phương thức thanh toán
            </Text>

            <TouchableOpacity
              onPress={() => setSelectedMethod(PaymentMethod.VNPAY)}
              className={`border-2 rounded-lg p-4 mb-3 flex-row items-center ${
                selectedMethod === PaymentMethod.VNPAY
                  ? 'border-[#244B35] bg-[#244B35]/5'
                  : 'border-gray-200'
              }`}
            >
              <View className="w-12 h-12 bg-blue-100 rounded-lg items-center justify-center mr-3">
                <Text className="text-blue-600 font-bold text-lg">VP</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800">
                  VNPay
                </Text>
                <Text className="text-xs text-gray-600">Thanh toán qua QR</Text>
              </View>
              {selectedMethod === PaymentMethod.VNPAY && (
                <View className="w-6 h-6 bg-[#244B35] rounded-full items-center justify-center">
                  <Check size={16} color="white" />
                </View>
              )}
            </TouchableOpacity>

            {/* Momo */}
            <TouchableOpacity
              onPress={() => setSelectedMethod(PaymentMethod.MOMO)}
              className={`border-2 rounded-lg p-4 flex-row items-center ${
                selectedMethod === PaymentMethod.MOMO
                  ? 'border-[#244B35] bg-[#244B35]/5'
                  : 'border-gray-200'
              }`}
            >
              <View className="w-12 h-12 bg-pink-100 rounded-lg items-center justify-center mr-3">
                <Text className="text-pink-600 font-bold text-lg">M</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800">
                  Momo
                </Text>
                <Text className="text-xs text-gray-600">Ví điện tử Momo</Text>
              </View>
              {selectedMethod === PaymentMethod.MOMO && (
                <View className="w-6 h-6 bg-[#244B35] rounded-full items-center justify-center">
                  <Check size={16} color="white" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-lg p-4 mb-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-bold text-gray-800">
                Tổng cộng
              </Text>
              <Text className="text-2xl font-bold text-[#244B35]">
                {totalAmount.toLocaleString('vi-VN')} đ
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="bg-white px-5 py-4 border-t border-gray-100">
        <TouchableOpacity
          className={`py-4 rounded-lg ${
            selectedMethod ? 'bg-[#244B35]' : 'bg-gray-300'
          }`}
          onPress={handlePayment}
          disabled={!selectedMethod}
        >
          <Text className="text-white text-center font-bold text-base">
            Thanh toán
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
