import { CustomHeader } from '@/components/ui/CustomHeader';
import DatePicker from '@/components/ui/DatePicker';
import {
  MOCK_SERVICES,
  getMockSlotAvailability,
} from '@/constants/mockServiceData';
import { getDisplayDate } from '@/utils/displayDate';
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
    <SafeAreaView className="flex-1 bg-gray-50">
      <CustomHeader title={service.name} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: service.url }}
          className="w-full h-64"
          resizeMode="cover"
        />

        <View className="py-4 pl-4 mb-4">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-[#E09B6B] text-sm mb-1 font-medium">
                {service.open_hour} - {service.close_hour} hàng ngày
              </Text>
              <Text className="text-gray-800 text-base pr-4">
                {service.description}
              </Text>
            </View>
            <View className="bg-[#244B35] px-4 py-2 flex-row">
              <Text className="text-[#FFA11D] text-lg font-bold text-[30px]">
                {service.unit_price / 1000}K
              </Text>
              <Text className="text-white text-lg">{'  '}/1h</Text>
            </View>
          </View>
        </View>

        <View className="mx-4 mb-4">
          <DatePicker
            value={selectedDate}
            onChange={(newDate) => {
              setSelectedDate(newDate);
              setSelectedSlots([]);
            }}
            className="bg-[#E09B6B] border-0"
          >
            <View className="flex-1 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Calendar size={20} color="white" />
                <Text className="text-white font-semibold ml-2 text-base">
                  {getDisplayDate(selectedDate)}
                </Text>
              </View>

              <Text className="text-white text-base">
                {format(selectedDate, 'dd/MM/yyyy')}
              </Text>
            </View>
          </DatePicker>
        </View>

        {/* Time slots */}
        <Text className="mb-1 text-[14px] font-semibold text-[#244B35] mb-3 mx-4">
          Chọn khung giờ
        </Text>

        <View className="flex-row flex-wrap gap-3 px-4">
          {slots.map((slot) => {
            const slotKey = `${slot.start_time}-${slot.end_time}`;
            const isSelected = selectedSlots.includes(slotKey);
            const isFull = slot.remaining_slot === 0;

            let containerStyle = '';
            let textStyle = '';

            if (isFull) {
              containerStyle = 'bg-white border border-gray-400';
              textStyle = 'text-gray-500';
            } else if (isSelected) {
              containerStyle = 'bg-[#244B35]';
              textStyle = 'text-white';
            } else {
              containerStyle = 'bg-white border border-[#3EAA6D]';
              textStyle = 'text-[#3EAA6D]';
            }

            return (
              <TouchableOpacity
                key={slot.id}
                onPress={() =>
                  !isFull && handleSelectSlot(slot.start_time, slot.end_time)
                }
                disabled={isFull}
                className={`px-4 py-3 rounded-md flex-1 basis-[30%] ${containerStyle}`}
              >
                <Text
                  className={`text-center text-sm font-medium ${textStyle}`}
                >
                  {slot.start_time} - {slot.end_time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View className="bg-white px-5 py-4 border-t border-gray-100">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm text-gray-600">Tổng cộng:</Text>
          <Text className="text-xl font-bold text-[#244B35]">
            {total.toLocaleString('vi-VN')} đ
          </Text>
        </View>
        <TouchableOpacity
          className="bg-[#E09B6B] py-4 rounded-lg"
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
