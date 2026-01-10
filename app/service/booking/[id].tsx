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
import {
  Calendar,
  Clock,
  CreditCard,
  Download,
  Info,
  Share2,
  Trash2,
  User,
} from 'lucide-react-native';
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
      <CustomHeader title="Chi tiết lịch đặt" />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="p-4 gap-y-4">
          <View
            className="bg-white rounded-2xl p-5 shadow-sm items-center border-b-4"
            style={{ borderBottomColor: statusColor }}
          >
            <View
              className="px-4 py-1.5 rounded-full mb-3"
              style={{ backgroundColor: statusColor + '15' }}
            >
              <Text
                className="text-xs font-black uppercase tracking-widest"
                style={{ color: statusColor }}
              >
                {statusLabel}
              </Text>
            </View>
            <Text className="text-2xl font-black text-gray-900">
              {booking.code}
            </Text>
            <Text className="text-xs text-gray-400 mt-1 font-medium italic">
              Đặt lúc:{' '}
              {format(new Date(booking.created_at), 'HH:mm - dd/MM/yyyy')}
            </Text>
          </View>

          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center mb-4">
              <View className="bg-[#244B35]/10 p-2 rounded-lg mr-3">
                <User size={18} color="#244B35" />
              </View>
              <Text className="text-base font-bold text-gray-800">
                Thông tin khách hàng
              </Text>
            </View>

            <View className="bg-gray-50 rounded-xl p-3 gap-y-3">
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Họ tên</Text>
                <Text className="text-sm font-bold text-gray-800">
                  {booking.customer_name}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Điện thoại</Text>
                <Text className="text-sm font-bold text-gray-800">
                  {booking.customer_phone}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Căn hộ</Text>
                <Text className="text-sm font-bold text-gray-800">
                  {booking.apartment}
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center mb-4">
              <View className="bg-[#244B35]/10 p-2 rounded-lg mr-3">
                <Info size={18} color="#244B35" />
              </View>
              <Text className="text-base font-bold text-gray-800">
                Chi tiết dịch vụ
              </Text>
            </View>

            <View className="gap-y-4">
              <View className="flex-row justify-between items-start">
                <Text className="text-sm text-gray-500">Dịch vụ</Text>
                <Text className="text-sm font-bold text-[#244B35] text-right flex-1 ml-4">
                  {booking.service_name}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Ngày sử dụng</Text>
                <View className="flex-row items-center">
                  <Calendar size={14} color="#6B7280" />
                  <Text className="text-sm font-bold text-gray-800 ml-1">
                    {formattedDate}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Thời gian</Text>
                <View className="bg-[#244B35] px-2 py-1 rounded-md flex-row items-center">
                  <Clock size={12} color="white" />
                  <Text className="text-xs font-bold text-white ml-1">
                    {booking.timestamps.start} - {booking.timestamps.end}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {payment && (
            <View className="bg-white rounded-2xl p-4 shadow-sm">
              <View className="flex-row items-center mb-4">
                <View className="bg-[#244B35]/10 p-2 rounded-lg mr-3">
                  <CreditCard size={18} color="#244B35" />
                </View>
                <Text className="text-base font-bold text-gray-800">
                  Thanh toán
                </Text>
              </View>

              <View className="gap-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-500">Phương thức</Text>
                  <Text className="text-sm font-bold text-gray-800">
                    {getPaymentMethodLabel(payment.method)}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-500">Lúc</Text>
                  <Text className="text-sm font-medium text-gray-600">
                    {payment.paid_at &&
                      format(new Date(payment.paid_at), 'HH:mm, dd/MM/yyyy')}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View className="bg-[#244B35] rounded-2xl p-5 shadow-md flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-white/70 text-xs font-bold uppercase tracking-wider">
                Tổng thanh toán
              </Text>
              <Text className="text-white text-2xl font-black mt-1">
                {booking.total.toLocaleString('vi-VN')} đ
              </Text>
            </View>
            <View className="bg-white/20 p-2 rounded-full">
              <CreditCard size={24} color="white" />
            </View>
          </View>

          <View className="gap-y-3 mb-10">
            {booking.status === BookingStatus.PAID && (
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={handleShare}
                  className="flex-1 bg-[#E09B6B] py-4 rounded-xl flex-row items-center justify-center shadow-sm"
                >
                  <Share2 size={18} color="white" className="mr-2" />
                  <Text className="text-white font-bold ml-2">Chia sẻ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDownloadPDF}
                  className="flex-1 bg-white border-2 border-[#244B35] py-4 rounded-xl flex-row items-center justify-center"
                >
                  <Download size={18} color="#244B35" className="mr-2" />
                  <Text className="text-[#244B35] font-bold ml-2">Tải PDF</Text>
                </TouchableOpacity>
              </View>
            )}

            {booking.status === BookingStatus.PENDING && (
              <View className="gap-y-3">
                <TouchableOpacity
                  className="bg-[#E09B6B] py-4 rounded-xl shadow-sm flex-row items-center justify-center"
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
                  <CreditCard size={20} color="white" />
                  <Text className="text-white font-black text-base ml-2">
                    Thanh toán ngay
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCancel}
                  className="bg-red-50 border border-red-100 py-4 rounded-xl flex-row items-center justify-center"
                >
                  <Trash2 size={18} color="#dc2626" />
                  <Text className="text-red-600 font-bold ml-2">
                    Hủy booking này
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
