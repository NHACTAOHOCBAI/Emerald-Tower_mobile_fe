import { CustomHeader } from '@/components/ui/CustomHeader';
import { MOCK_FEEDBACKS } from '@/constants/mockFeedbackData';
import { router, useLocalSearchParams } from 'expo-router';
import { Star } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RatingScreen() {
  const { id } = useLocalSearchParams();
  const feedback = MOCK_FEEDBACKS.find((f) => f.id === Number(id));

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  if (!feedback) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text>Không tìm thấy phản ánh</Text>
      </SafeAreaView>
    );
  }

  const handleSubmitRating = () => {
    if (rating === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn số sao đánh giá');
      return;
    }

    Alert.alert('Cảm ơn!', 'Đánh giá của bạn đã được ghi nhận', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  };

  const ratingLabels = [
    '',
    'Rất không hài lòng',
    'Không hài lòng',
    'Bình thường',
    'Hài lòng',
    'Rất hài lòng',
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <CustomHeader title="Chi tiết phản ánh" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-5">
          <View className="bg-white rounded-lg p-4 mb-6">
            <Text className="text-xs text-gray-500 mb-2">{feedback.code}</Text>
            <Text className="text-base font-bold text-gray-900">
              {feedback.title}
            </Text>
          </View>

          <View className="bg-white rounded-2xl p-6 items-center mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-2">
              Mức độ hài lòng <Text className="text-red-500">*</Text>
            </Text>
            <Text className="text-sm text-gray-600 mb-6 text-center">
              Bạn đánh giá thế nào về quá trình xử lý phản ánh này?
            </Text>

            <View className="mb-6 mt-2">
              <Text className="text-8xl">
                {rating === 0
                  ? '😐'
                  : rating <= 2
                    ? '😢'
                    : rating === 3
                      ? '😐'
                      : rating === 4
                        ? '😊'
                        : '🤩'}
              </Text>
            </View>

            <View className="flex-row items-center mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  onPressIn={() => setHoveredRating(star)}
                  onPressOut={() => setHoveredRating(0)}
                  className="mx-2"
                >
                  <Star
                    size={48}
                    color="#F59E0B"
                    fill={
                      star <= (hoveredRating || rating)
                        ? '#F59E0B'
                        : 'transparent'
                    }
                  />
                </TouchableOpacity>
              ))}
            </View>

            {rating > 0 && (
              <Text className="text-base font-semibold text-gray-700 mt-2">
                {ratingLabels[rating]}
              </Text>
            )}
          </View>

          <View className="bg-white rounded-lg p-4 mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-3">
              Chi tiết xử lý
            </Text>

            <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                <Text className="text-sm text-gray-700">Tiếp nhận</Text>
              </View>
              <Text className="text-sm text-gray-500">08:15 · 14/mm/que</Text>
            </View>

            <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
                <Text className="text-sm text-gray-700">Đang xử lý</Text>
              </View>
              <Text className="text-sm text-gray-500">08:23 · 14/mm/que</Text>
            </View>

            <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                <Text className="text-sm text-gray-700">Xác nhận lại</Text>
              </View>
              <Text className="text-sm text-gray-500">-</Text>
            </View>

            <View className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-green-600 rounded-full mr-2" />
                <Text className="text-sm text-gray-700">Hoàn tất</Text>
              </View>
              <Text className="text-sm text-gray-500">-</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSubmitRating}
            className={`py-4 rounded-lg ${
              rating > 0 ? 'bg-[#244B35]' : 'bg-gray-300'
            }`}
            disabled={rating === 0}
          >
            <Text className="text-white text-center font-bold text-base">
              Gửi
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
