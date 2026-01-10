import {
  Feedback,
  FEEDBACK_CATEGORIES,
  getFeedbackStatusColor,
  getFeedbackStatusLabel,
} from '@/types/feedback';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { router } from 'expo-router';
import {
  Building,
  Flame,
  MoreHorizontal,
  Shield,
  Star,
  Volume2,
  Wrench,
} from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

interface FeedbackCardProps {
  feedback: Feedback;
  onPress: () => void;
}

const ICON_MAP: Record<string, any> = {
  Wrench: Wrench,
  Building: Building,
  Volume2: Volume2,
  Shield: Shield,
  Flame: Flame,
  MoreHorizontal: MoreHorizontal,
};

export default function FeedbackCard({ feedback, onPress }: FeedbackCardProps) {
  const statusLabel = getFeedbackStatusLabel(feedback.status);
  const statusColor = getFeedbackStatusColor(feedback.status);

  const formattedDate = format(
    new Date(feedback.created_at),
    "dd/MM/yyyy · HH'h'",
    { locale: vi }
  );

  const category = FEEDBACK_CATEGORIES.find((c) => c.type === feedback.type);
  const IconComponent = category
    ? ICON_MAP[category.icon]
    : ICON_MAP.MoreHorizontal;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-lg p-4 mb-3 border border-gray-200"
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text className="text-xs text-gray-500 mr-2">
              {feedback.code} · {formattedDate}
            </Text>
          </View>
          <Text
            className="text-base font-semibold text-gray-900"
            numberOfLines={2}
          >
            {feedback.title}
          </Text>
        </View>

        <View className="flex-row items-center ml-2">
          {category && (
            <View className="mr-2 opacity-60">
              <IconComponent size={14} color={category.color} />
            </View>
          )}
          <View
            className="px-2 py-1 rounded-md"
            style={{ backgroundColor: statusColor + '15' }}
          >
            <Text
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: statusColor }}
            >
              {statusLabel}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row justify-between items-end mt-3 pt-3 border-t border-gray-50">
        <View>
          {feedback.rating ? (
            <View className="flex-row items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={12}
                  color="#F59E0B"
                  fill={index < feedback.rating! ? '#F59E0B' : 'transparent'}
                />
              ))}
              <Text className="text-[10px] text-gray-400 ml-1.5 font-medium">
                Đã đánh giá
              </Text>
            </View>
          ) : (
            <Text className="text-[10px] text-gray-400 italic">
              Chưa có đánh giá
            </Text>
          )}
        </View>

        {feedback.status === 'RESOLVED' && !feedback.rating && (
          <TouchableOpacity
            className="bg-[#FFA11D] px-3 py-1.5 rounded-lg flex-row items-center"
            onPress={(e) => {
              e.stopPropagation();
              router.push(`/feedback/rate/${feedback.id}` as any);
            }}
          >
            <Star size={12} color="white" fill="white" />
            <Text className="text-white text-[11px] font-bold ml-1.5">
              Đánh giá ngay
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}
