import { CustomHeader } from '@/components/ui/CustomHeader';
import {
  MOCK_SERVICES,
  getMockSlotAvailability,
} from '@/constants/mockServiceData';
import { format } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams();
  const service = MOCK_SERVICES.find((s) => s.id === Number(id));

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  if (!service) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text>Không tìm thấy dịch vụ</Text>
      </SafeAreaView>
    );
  }

  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const slots = getMockSlotAvailability(service.id, dateString);

  const handleSelectSlot = (startTime: string, endTime: string) => {
    const slotKey = `${startTime}-${endTime}`;
    if (selectedSlots.includes(slotKey)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slotKey));
    } else {
      setSelectedSlots([...selectedSlots, slotKey]);
    }
  };

  const handleBooking = () => {
    if (selectedSlots.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một khung giờ');
      return;
    }

    const total = service.unit_price * selectedSlots.length;

    router.push({
      pathname: '/service/payment/[id]',
      params: {
        id: service.id,
        date: dateString,
        slots: JSON.stringify(selectedSlots),
        total,
      },
    } as any);
  };

  const total = service.unit_price * selectedSlots.length;

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <CustomHeader title={service.name} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: service.url }}
          className="w-full h-64"
          resizeMode="cover"
        />

        <View className="bg-[#244B35] rounded-lg p-4 mb-4">
          <Text className="text-white/80 text-sm mb-1">
            {service.open_hour} - {service.close_hour} hàng ngày
          </Text>
          <Text className="text-white text-lg mb-2">{service.description}</Text>
          <View className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex-row items-center justify-between">
            <Text className="text-white text-sm">
              Giá mỗi {service.unit} phút:
            </Text>
            <Text className="text-white text-2xl font-bold">
              {service.unit_price / 1000}K<Text className="text-base">/1h</Text>
            </Text>
          </View>
        </View>

        {/* Date selector - Hôm nay button */}
        <TouchableOpacity
          className="bg-[#C89F6C] py-3 px-4 rounded-lg mb-4 flex-row items-center justify-between"
          onPress={() => setSelectedDate(new Date())}
        >
          <View className="flex-row items-center">
            <Calendar size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Hôm nay</Text>
          </View>
          <Text className="text-white">
            {format(selectedDate, 'dd/MM/yyyy')}
          </Text>
        </TouchableOpacity>

        {/* Time slots */}
        <Text className="text-base font-bold text-gray-800 mb-3">
          Chọn khung giờ
        </Text>

        <View className="flex-row flex-wrap gap-2">
          {slots.map((slot) => {
            const slotKey = `${slot.start_time}-${slot.end_time}`;
            const isSelected = selectedSlots.includes(slotKey);
            const isFull = slot.remaining_slot === 0;

            return (
              <TouchableOpacity
                key={slot.id}
                onPress={() =>
                  !isFull && handleSelectSlot(slot.start_time, slot.end_time)
                }
                disabled={isFull}
                className={`px-4 py-3 rounded-lg ${
                  isFull
                    ? 'bg-gray-100'
                    : isSelected
                      ? 'bg-[#244B35]'
                      : 'bg-white border border-gray-300'
                }`}
                style={{ minWidth: '30%' }}
              >
                <Text
                  className={`text-center font-semibold ${
                    isFull
                      ? 'text-gray-400'
                      : isSelected
                        ? 'text-white'
                        : 'text-gray-700'
                  }`}
                >
                  {slot.start_time} -
                </Text>
                <Text
                  className={`text-center font-semibold ${
                    isFull
                      ? 'text-gray-400'
                      : isSelected
                        ? 'text-white'
                        : 'text-gray-700'
                  }`}
                >
                  {slot.end_time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Fixed bottom button */}
      <View className="bg-white px-5 py-4 border-t border-gray-100">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm text-gray-600">Tổng cộng:</Text>
          <Text className="text-xl font-bold text-[#244B35]">
            {total.toLocaleString('vi-VN')} đ
          </Text>
        </View>
        <TouchableOpacity
          className="bg-[#C89F6C] py-4 rounded-lg"
          onPress={handleBooking}
        >
          <Text className="text-white text-center font-bold text-base">
            ĐẶT NGAY
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
