import { MOCK_NOTIFICATIONS } from '@/constants/mockNotificationData';
import { getNotiTypeColor, getNotiTypeLabel } from '@/types/notification';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { router, useLocalSearchParams } from 'expo-router';
import {
  AlertCircle,
  ChevronLeft,
  Clock,
  Download,
  MapPin,
} from 'lucide-react-native';
import {
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function NotificationDetailScreen() {
  const { id } = useLocalSearchParams();

  const notification = MOCK_NOTIFICATIONS.find((n) => n.id === Number(id));

  if (!notification) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text>Không tìm thấy thông báo</Text>
        </View>
      </SafeAreaView>
    );
  }

  const typeColor = getNotiTypeColor(notification.type);
  const typeLabel = getNotiTypeLabel(notification.type);

  const formattedDate = format(
    new Date(notification.created_at),
    "HH:mm, 'ngày' dd/MM/yyyy",
    { locale: vi }
  );

  const handleDownload = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white px-5 py-4 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">Chi tiết</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 py-4">
          <View className="flex-row items-center mb-4">
            <View
              className="px-3 py-1.5 rounded-full"
              style={{ backgroundColor: typeColor + '20' }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: typeColor }}
              >
                {typeLabel}
              </Text>
            </View>
            {notification.is_urgent && (
              <View className="flex-row items-center ml-3">
                <AlertCircle size={16} color="#EF4444" />
                <Text className="text-sm font-semibold text-red-500 ml-1">
                  Khẩn cấp
                </Text>
              </View>
            )}
          </View>

          <Text className="text-xl font-bold text-gray-900 mb-4">
            {notification.title}
          </Text>

          <View className="bg-white rounded-lg p-4 mb-4">
            <View className="flex-row items-center mb-3">
              <Clock size={16} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-2">
                {formattedDate}
              </Text>
            </View>

            {notification.target_blocks.length > 0 && (
              <View className="flex-row items-start">
                <MapPin size={16} color="#6B7280" className="mt-0.5" />
                <View className="flex-1 ml-2">
                  <Text className="text-sm text-gray-600">
                    Áp dụng cho:{' '}
                    {notification.target_blocks.map((b) => b.name).join(', ')}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-base text-gray-800 leading-7 whitespace-pre-line">
              {notification.content}
            </Text>
          </View>

          {/* Files */}
          {notification.file_urls.length > 0 && (
            <View className="bg-white rounded-lg p-4 mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                Tài liệu đính kèm
              </Text>
              {notification.file_urls.map((url, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleDownload(url)}
                  className="flex-row items-center border border-gray-300 rounded-lg py-3 px-4 mb-2"
                >
                  <Download size={20} color="#374151" />
                  <Text className="text-sm text-gray-700 ml-3 flex-1 font-medium">
                    Quyết định s613.pdf
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Text className="text-xs text-blue-700">
              Thông báo đã được gửi qua: {notification.channels.join(', ')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
