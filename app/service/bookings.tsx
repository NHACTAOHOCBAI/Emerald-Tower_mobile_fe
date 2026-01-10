import BookingCard from '@/components/service/BookingCard';
import { CustomHeader } from '@/components/ui/CustomHeader';
import { MOCK_BOOKINGS } from '@/constants/mockServiceData';
import { BookingStatus } from '@/types/service';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabKey = 'mine' | 'pending' | 'history';

interface Tab {
  key: TabKey;
  label: string;
  filter: (booking: any) => boolean;
}

const TABS: Tab[] = [
  {
    key: 'pending',
    label: 'Thanh toán',
    filter: (b) => b.status === BookingStatus.PENDING,
  },
  {
    key: 'mine',
    label: 'Của tôi',
    filter: (b) => b.status === BookingStatus.PAID,
  },
  {
    key: 'history',
    label: 'Lịch sử',
    filter: (b) =>
      b.status === BookingStatus.EXPIRED ||
      b.status === BookingStatus.CANCELLED,
  },
];

export default function MyBookingsScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('pending');

  const currentTab = TABS.find((t) => t.key === activeTab);
  const filteredBookings = MOCK_BOOKINGS.filter(
    currentTab?.filter || (() => true)
  );

  const getPendingTimeRemaining = (booking: any) => {
    if (booking.status !== BookingStatus.PENDING) return null;
    const now = new Date();
    const bookingDate = new Date(booking.date);
    const diff = bookingDate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  const handlePressBooking = (bookingId: number) => {
    router.push({
      pathname: '/service/booking/[id]',
      params: { id: bookingId },
    } as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <CustomHeader title="Ví dịch vụ" />
      <View className="px-5 py-4">
        <View className="flex-row gap-2 mb-4">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const count = MOCK_BOOKINGS.filter(tab.filter).length;

            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                className={`flex-1 py-2.5 px-2 rounded-full ${
                  isActive ? 'bg-[#244B35]' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`text-center text-sm font-medium ${
                    isActive ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {tab.label} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="p-5"
      >
        {activeTab === 'pending' && filteredBookings.length > 0 && (
          <View className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <Text className="text-sm font-semibold text-orange-800 mb-1">
              ⏰ Hết hạn trong{' '}
              <Text className="font-bold">
                {getPendingTimeRemaining(filteredBookings[0])}
              </Text>
            </Text>
            <Text className="text-xs text-orange-700">
              Vui lòng thanh toán trước khi hết thời gian giữ chỗ
            </Text>
          </View>
        )}

        {filteredBookings.length === 0 ? (
          <View className="py-20 items-center">
            <Text className="text-gray-500 text-center">
              Không có booking nào trong mục này
            </Text>
          </View>
        ) : (
          filteredBookings.map((booking) => (
            <View key={booking.id}>
              <BookingCard
                booking={booking}
                onPress={() => handlePressBooking(booking.id)}
              />

              {booking.status === BookingStatus.PENDING && (
                <TouchableOpacity
                  className="bg-[#C89F6C] py-3 rounded-lg -mt-2 mb-3"
                  onPress={() =>
                    router.push({
                      pathname: '/service/payment/[id]',
                      params: {
                        id: booking.service_id,
                        date: booking.date,
                        slots: JSON.stringify([
                          `${booking.timestamps.start}-${booking.timestamps.end}`,
                        ]),
                        total: booking.total,
                      },
                    } as any)
                  }
                >
                  <Text className="text-white text-center font-semibold">
                    Thanh toán
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
