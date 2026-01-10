import {
  Booking,
  getBookingStatusColor,
  getBookingStatusLabel,
} from '@/types/service';
import { format } from 'date-fns';
import { Text, TouchableOpacity, View } from 'react-native';

interface BookingCardProps {
  booking: Booking;
  onPress?: () => void;
}

export default function BookingCard({ booking, onPress }: BookingCardProps) {
  const statusLabel = getBookingStatusLabel(booking.status);
  const statusColor = getBookingStatusColor(booking.status);

  const formattedDate = format(new Date(booking.date), 'dd/MM/yyyy');
  const formattedCreatedAt = format(
    new Date(booking.created_at),
    'HH:mm, dd/MM/yyyy'
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white rounded-lg p-4 mb-3 border border-gray-200"
    >
      {/* Header */}
      <View className="flex-row justify-between items-start mb-3">
        <View
          className="px-2 py-1 rounded"
          style={{ backgroundColor: statusColor + '20' }}
        >
          <Text
            className="text-xs font-semibold"
            style={{ color: statusColor }}
          >
            {statusLabel}
          </Text>
        </View>
        <Text className="text-xs text-gray-500">{formattedCreatedAt}</Text>
      </View>

      {/* Booking info */}
      <Text className="text-sm font-bold text-gray-800 mb-1">
        {booking.code}
      </Text>
      <Text className="text-sm text-gray-700 mb-1">
        Khách hàng: {booking.customer_name}
      </Text>
      <Text className="text-sm text-gray-700 mb-1">
        Dịch vụ: {booking.service_name}
      </Text>
      <Text className="text-sm text-gray-700 mb-1">
        Thời gian: {booking.timestamps.start} - {booking.timestamps.end},{' '}
        {formattedDate}
      </Text>

      {/* Total */}
      <View className="border-t border-gray-100 mt-3 pt-3 flex-row justify-between items-center">
        <Text className="text-sm text-gray-600">Thành tiền:</Text>
        <Text className="text-base font-bold text-gray-900">
          {booking.total.toLocaleString('vi-VN')} đ
        </Text>
      </View>
    </TouchableOpacity>
  );
}
