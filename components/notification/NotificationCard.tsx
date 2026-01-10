import { Notification, getNotiTypeColor } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Download, MoreVertical } from 'lucide-react-native';
import { Linking, Text, TouchableOpacity, View } from 'react-native';

interface NotificationCardProps {
  notification: Notification;
  onPress: () => void;
  onPressMenu?: () => void;
}

export default function NotificationCard({
  notification,
  onPress,
  onPressMenu,
}: NotificationCardProps) {
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
    locale: vi,
  });

  const typeColor = getNotiTypeColor(notification.type);

  const handleDownload = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white rounded-lg p-4 mb-3`}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <View className="flex-row items-center mb-2 flex-wrap gap-2">
            <Text className="text-xs text-gray-500 mb-1">{timeAgo}</Text>
            {notification.is_urgent && (
              <View className="flex-row items-center">
                <View className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1" />
                <Text className="text-xs font-bold text-red-500">
                  {' '}
                  KHẨN CẤP
                </Text>
              </View>
            )}
          </View>

          <View className="flex-row items-center flex-1">
            <Text
              className="text-base flex-1 font-bold text-gray-900"
              numberOfLines={2}
            >
              {notification.title}
            </Text>
          </View>
        </View>
        {onPressMenu && (
          <TouchableOpacity
            onPress={onPressMenu}
            className="ml-2 p-1"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MoreVertical size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      <Text
        className={`text-sm mb-2 ${
          !notification.is_read ? 'text-gray-700' : 'text-gray-600'
        }`}
        numberOfLines={5}
      >
        {notification.content}
      </Text>

      <View className="flex-row items-center mb-2 flex-wrap gap-2">
        <View
          className="px-2 py-1 rounded"
          style={{ backgroundColor: typeColor + '20' }}
        >
          <Text className="text-xs font-medium" style={{ color: typeColor }}>
            {notification.type}
          </Text>
        </View>

        {notification.target_blocks.map((block) => (
          <View key={block.id} className="bg-gray-100 px-2 py-1 rounded">
            <Text className="text-xs text-gray-600">{block.name}</Text>
          </View>
        ))}
      </View>

      {notification.file_urls.length > 0 && (
        <TouchableOpacity
          onPress={() => handleDownload(notification.file_urls[0])}
          className="flex-row items-center justify-center border border-gray-300 rounded-lg py-2 px-4 mt-2"
        >
          <Download size={16} color="#374151" />
          <Text className="text-sm text-gray-700 ml-2 font-medium">
            Quyết định s613.pdf
          </Text>
        </TouchableOpacity>
      )}

      {!notification.is_read && (
        <View className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full" />
      )}
    </TouchableOpacity>
  );
}
