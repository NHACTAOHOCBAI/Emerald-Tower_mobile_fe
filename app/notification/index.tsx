import NotificationCard from '@/components/notification/NotificationCard';
import NotificationTabs from '@/components/notification/NotificationTabs';
import { MOCK_NOTIFICATIONS } from '@/constants/mockNotificationData';
import { Notification } from '@/types/notification';
import { router } from 'expo-router';
import { ChevronLeft, Search, SlidersHorizontal } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationScreen() {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotifications = MOCK_NOTIFICATIONS.filter((noti) => {
    const matchesTab = activeTab === 'ALL' || noti.type === activeTab;

    const matchesSearch =
      searchQuery === '' ||
      noti.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      noti.content.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (a.is_read === b.is_read) {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return a.is_read ? 1 : -1;
  });

  const handlePressNotification = (notification: Notification) => {
    router.push({
      pathname: '/notification/[id]',
      params: { id: notification.id },
    });
  };

  const handlePressMenu = (notification: Notification) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Đóng', 'Đánh dấu đã đọc', 'Xóa'],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            Alert.alert('Thành công', 'Đã đánh dấu là đã đọc');
          } else if (buttonIndex === 2) {
            Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa thông báo này?');
          }
        }
      );
    } else {
      Alert.alert('Tùy chọn', 'Chọn hành động', [
        { text: 'Đánh dấu đã đọc' },
        { text: 'Xóa', style: 'destructive' },
        { text: 'Hủy', style: 'cancel' },
      ]);
    }
  };

  const handlePressFilter = () => {
    Alert.alert('Bộ lọc', 'Chức năng đang phát triển');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-[#244B35] pt-4 pb-6">
        <View className="px-5 flex-row items-center justify-between mb-4">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <ChevronLeft size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-white">Thông báo</Text>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity>
              <Search size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePressFilter}>
              <SlidersHorizontal size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-5">
          <View className="bg-white/20 backdrop-blur-lg rounded-full flex-row items-center px-4 py-2">
            <Search size={20} color="white" />
            <TextInput
              placeholder="Tìm kiếm thông báo..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-2 text-white"
            />
          </View>
        </View>
      </View>

      <View className="pt-4">
        <NotificationTabs activeTab={activeTab} onChangeTab={setActiveTab} />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-4">
          {sortedNotifications.length === 0 ? (
            <View className="py-10 items-center">
              <Text className="text-gray-500">Không có thông báo nào</Text>
            </View>
          ) : (
            sortedNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onPress={() => handlePressNotification(notification)}
                onPressMenu={() => handlePressMenu(notification)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
