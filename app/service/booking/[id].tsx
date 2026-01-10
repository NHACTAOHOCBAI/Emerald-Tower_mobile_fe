import { CustomHeader } from '@/components/ui/CustomHeader';
import { MOCK_BOOKINGS, MOCK_PAYMENTS } from '@/constants/mockServiceData';
import {
  BookingStatus,
  getBookingStatusColor,
  getBookingStatusLabel,
  getPaymentMethodLabel,
} from '@/types/service';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { router, useLocalSearchParams } from 'expo-router';
import { Calendar, Clock, CreditCard, MapPin, User } from 'lucide-react-native';
import {
  Alert,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams();
  const booking = MOCK_BOOKINGS.find((b) => b.id === Number(id));

  if (!booking) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text>Không tìm thấy booking</Text>
      </SafeAreaView>
    );
  }

  const payment = MOCK_PAYMENTS.find((p) => p.booking_id === booking.id);
  const statusLabel = getBookingStatusLabel(booking.status);
  const statusColor = getBookingStatusColor(booking.status);

  const formattedDate = format(new Date(booking.date), 'dd/MM/yyyy', {
    locale: vi,
  });

  const handleDownloadPDF = () => {
    Alert.alert('Thông báo', 'Tính năng tải PDF đang được phát triển');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Booking #${booking.code}\nDịch vụ: ${booking.service_name}\nNgày: ${formattedDate}\nGiờ: ${booking.timestamps.start} - ${booking.timestamps.end}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Hủy booking',
      'Bạn có chắc muốn hủy booking này? Hành động này không thể hoàn tác.',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Hủy booking',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Thành công', 'Đã hủy booking');
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <CustomHeader title="Chi tiết dịch vụ" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-5">
          <View className="bg-white rounded-lg p-4 mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <View
                className="px-3 py-1.5 rounded-full"
                style={{ backgroundColor: statusColor + '20' }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: statusColor }}
                >
                  {statusLabel}
                </Text>
              </View>
              <Text className="text-xs text-gray-500">
                {format(new Date(booking.created_at), 'HH:mm, dd/MM/yyyy')}
              </Text>
            </View>

            <Text className="text-lg font-bold text-gray-900 mb-2">
              {booking.code}
            </Text>
            <Text className="text-sm text-gray-600">
              Booking ID: #{booking.id}
            </Text>
          </View>

          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-base font-bold text-gray-800 mb-3">
              Thông tin khách hàng
            </Text>
            <View className="space-y-3">
              <View className="flex-row items-center">
                <User size={16} color="#6B7280" />
                <Text className="text-sm text-gray-600 ml-2 mr-auto">
                  Họ tên:
                </Text>
                <Text className="text-sm font-semibold text-gray-800">
                  {booking.customer_name}
                </Text>
              </View>
              <View className="flex-row items-center">
                <CreditCard size={16} color="#6B7280" />
                <Text className="text-sm text-gray-600 ml-2 mr-auto">
                  Điện thoại:
                </Text>
                <Text className="text-sm font-semibold text-gray-800">
                  {booking.customer_phone}
                </Text>
              </View>
              <View className="flex-row items-center">
                <MapPin size={16} color="#6B7280" />
                <Text className="text-sm text-gray-600 ml-2 mr-auto">
                  Căn hộ:
                </Text>
                <Text className="text-sm font-semibold text-gray-800">
                  {booking.apartment}
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-base font-bold text-gray-800 mb-3">
              Chi tiết dịch vụ
            </Text>
            <View className="space-y-3">
              <View className="flex-row items-center">
                <Text className="text-sm text-gray-600 mr-auto">Dịch vụ:</Text>
                <Text className="text-sm font-semibold text-gray-800">
                  {booking.service_name}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Calendar size={16} color="#6B7280" />
                <Text className="text-sm text-gray-600 ml-2 mr-auto">
                  Ngày:
                </Text>
                <Text className="text-sm font-semibold text-gray-800">
                  {formattedDate}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Clock size={16} color="#6B7280" />
                <Text className="text-sm text-gray-600 ml-2 mr-auto">
                  Thời gian:
                </Text>
                <Text className="text-sm font-semibold text-gray-800">
                  {booking.timestamps.start} - {booking.timestamps.end}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-sm text-gray-600 mr-auto">Đơn giá:</Text>
                <Text className="text-sm font-semibold text-gray-800">
                  {booking.unit_price.toLocaleString('vi-VN')} đ/1h
                </Text>
              </View>
            </View>
          </View>

          {payment && (
            <View className="bg-white rounded-lg p-4 mb-4">
              <Text className="text-base font-bold text-gray-800 mb-3">
                Thông tin thanh toán
              </Text>
              <View className="space-y-3">
                <View className="flex-row items-center">
                  <Text className="text-sm text-gray-600 mr-auto">
                    Phương thức:
                  </Text>
                  <Text className="text-sm font-semibold text-gray-800">
                    {getPaymentMethodLabel(payment.method)}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-sm text-gray-600 mr-auto">
                    Thời gian thanh toán:
                  </Text>
                  <Text className="text-sm font-semibold text-gray-800">
                    {payment.paid_at &&
                      format(new Date(payment.paid_at), 'HH:mm, dd/MM/yyyy')}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View className="bg-white rounded-lg p-4 mb-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-bold text-gray-800">
                Tổng cộng
              </Text>
              <Text className="text-2xl font-bold text-[#244B35]">
                {booking.total.toLocaleString('vi-VN')} đ
              </Text>
            </View>
          </View>

          {booking.status === BookingStatus.PAID && (
            <View className="flex-row gap-3 mb-4">
              <TouchableOpacity
                onPress={handleShare}
                className="flex-1 bg-[#C89F6C] py-4 rounded-lg"
              >
                <Text className="text-white text-center font-semibold">
                  Chia sẻ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDownloadPDF}
                className="flex-1 bg-white border-2 border-[#244B35] py-4 rounded-lg"
              >
                <Text className="text-[#244B35] text-center font-semibold">
                  Tải PDF
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {booking.status === BookingStatus.PENDING && (
            <TouchableOpacity
              onPress={handleCancel}
              className="bg-red-50 border border-red-200 py-4 rounded-lg"
            >
              <Text className="text-red-600 text-center font-semibold">
                Hủy booking
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
