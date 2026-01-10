import { CustomHeader } from '@/components/ui/CustomHeader';
import { MOCK_FEEDBACKS } from '@/constants/mockFeedbackData';
import {
  FeedbackStatus,
  getFeedbackStatusColor,
  getFeedbackStatusLabel,
  getIssueTypeLabel,
} from '@/types/feedback';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { router, useLocalSearchParams } from 'expo-router';
import { CheckCircle, MapPin, Star } from 'lucide-react-native';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FeedbackDetailScreen() {
  const { id } = useLocalSearchParams();
  const feedback = MOCK_FEEDBACKS.find((f) => f.id === Number(id));

  if (!feedback) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text>Không tìm thấy phản ánh</Text>
      </SafeAreaView>
    );
  }

  const statusLabel = getFeedbackStatusLabel(feedback.status);
  const statusColor = getFeedbackStatusColor(feedback.status);
  const typeLabel = getIssueTypeLabel(feedback.type);

  const formattedDate = format(
    new Date(feedback.created_at),
    'HH:mm, dd/MM/yyyy',
    { locale: vi }
  );

  const handleRate = () => {
    if (feedback.status === FeedbackStatus.RESOLVED && !feedback.rating) {
      router.push({
        pathname: '/feedback/rate/[id]',
        params: { id: feedback.id },
      } as any);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <CustomHeader title="Chi tiết phản ánh" />

      <View
        className="px-3 py-1.5 px-5 py-4 m-4 rounded-full"
        style={{ backgroundColor: statusColor + '20' }}
      >
        <Text className="text-xs font-semibold" style={{ color: statusColor }}>
          {statusLabel}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-5">
          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-xs text-gray-500 mb-2">
              {feedback.code} · {formattedDate}
            </Text>
            <Text className="text-lg font-bold text-gray-900 mb-2">
              {feedback.title}
            </Text>

            <View className="bg-blue-50 px-3 py-1.5 rounded-full self-start">
              <Text className="text-blue-700 text-xs font-semibold">
                {typeLabel}
              </Text>
            </View>
          </View>

          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Mô tả chi tiết
            </Text>
            <Text className="text-sm text-gray-600 leading-6">
              {feedback.description}
            </Text>
          </View>

          <View className="bg-white rounded-lg p-4 mb-4">
            <View className="flex-row items-center mb-3">
              <MapPin size={16} color="#6B7280" />
              <Text className="text-sm font-semibold text-gray-700 ml-2">
                Vị trí sự cố
              </Text>
            </View>
            <Text className="text-sm text-gray-600">
              {feedback.location.building} · Tầng {feedback.location.floor}
              {feedback.location.room && ` · ${feedback.location.room}`}
            </Text>
          </View>

          {feedback.images.length > 0 && (
            <View className="bg-white rounded-lg p-4 mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                Minh chứng
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {feedback.images.map((img) => (
                    <Image
                      key={img.id}
                      source={{ uri: img.url }}
                      className="w-32 h-32 rounded-lg"
                      resizeMode="cover"
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-3">
              Tiến trình xử lý
            </Text>

            <View className="flex-row mb-4">
              <View className="w-8 items-center mr-3">
                <View className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
                <View className="w-0.5 h-full bg-gray-200 mt-1" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-800 mb-1">
                  Tạo phản ánh
                </Text>
                <Text className="text-xs text-gray-500">
                  {format(new Date(feedback.created_at), 'HH:mm, dd/MM/yyyy')}
                </Text>
              </View>
            </View>

            {(feedback.status === FeedbackStatus.IN_PROGRESS ||
              feedback.status === FeedbackStatus.RESOLVED) && (
              <View className="flex-row mb-4">
                <View className="w-8 items-center mr-3">
                  <View className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                  {feedback.status === FeedbackStatus.RESOLVED && (
                    <View className="w-0.5 h-full bg-gray-200 mt-1" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-800 mb-1">
                    Đang xử lý
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {format(new Date(feedback.updated_at), 'HH:mm, dd/MM/yyyy')}
                  </Text>
                  {feedback.response && (
                    <View className="bg-blue-50 p-3 rounded-lg mt-2">
                      <Text className="text-sm text-blue-800">
                        {feedback.response}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {feedback.status === FeedbackStatus.RESOLVED && (
              <View className="flex-row">
                <View className="w-8 items-center mr-3">
                  <CheckCircle size={16} color="#10B981" className="mt-1" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-green-700 mb-1">
                    Đã hoàn tất
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {feedback.resolved_at &&
                      format(
                        new Date(feedback.resolved_at),
                        'HH:mm, dd/MM/yyyy'
                      )}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {feedback.rating && (
            <View className="bg-white rounded-lg p-4 mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                Đánh giá của bạn
              </Text>
              <View className="flex-row items-center">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={24}
                    color="#F59E0B"
                    fill={index < feedback.rating! ? '#F59E0B' : 'transparent'}
                  />
                ))}
                <Text className="text-sm text-gray-600 ml-2">
                  ({feedback.rating}/5)
                </Text>
              </View>
            </View>
          )}

          {feedback.status === FeedbackStatus.RESOLVED && !feedback.rating && (
            <TouchableOpacity
              onPress={handleRate}
              className="bg-[#244B35] py-4 rounded-lg flex-row items-center justify-center"
            >
              <Star size={20} color="white" />
              <Text className="text-white font-bold text-base ml-2">
                Đánh giá
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
