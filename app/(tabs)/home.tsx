import { MOCK_NOTIFICATIONS } from '@/constants/mockNotificationData';
import { router } from 'expo-router';
import {
  Bell,
  Building,
  CreditCard,
  MessageSquare,
  Search,
  Vote,
  Wrench,
} from 'lucide-react-native';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  // Mock user data
  const user = {
    name: 'NGUYỄN LƯU LY',
    avatar: 'https://i.pravatar.cc/150?img=12',
    hasUnreadNotifications: true,
  };

  // Latest notifications (top 2)
  const latestNotifications = MOCK_NOTIFICATIONS.slice(0, 2);

  // Important items (mock data)
  const importantItems = [
    {
      id: 1,
      icon: CreditCard,
      title: '2 hóa đơn',
      subtitle: 'Hạn nộp gần nhất: 30/11/2025',
      status: 'Thanh toán',
      statusColor: 'bg-green-600',
      route: '/payment',
    },
    {
      id: 2,
      icon: MessageSquare,
      title: '1 phản ánh',
      subtitle: 'Cập nhận lần cuối: 14h · 21/11/2025',
      status: 'Đang xử lý',
      statusColor: 'bg-orange-500',
      route: '/feedback',
    },
    {
      id: 3,
      icon: Wrench,
      title: '3 dịch vụ',
      subtitle: 'Hết hạn gần nhất: 28/11/2025',
      status: 'Sắp hết hạn',
      statusColor: 'bg-orange-500',
      route: '/service',
    },
  ];

  // Shortcuts
  const shortcuts = [
    {
      id: 1,
      icon: Wrench,
      label: 'Ví dịch vụ',
      route: '/service',
    },
    {
      id: 2,
      icon: MessageSquare,
      label: 'Phản ánh',
      route: '/feedback',
    },
    {
      id: 3,
      icon: Building,
      label: 'Căn hộ của tôi',
      route: '/apartment',
    },
    {
      id: 4,
      icon: Vote,
      label: 'Biểu quyết',
      route: '/voting',
    },
  ];

  const handlePressNotification = (id: number) => {
    router.push({
      pathname: '/notification/[id]',
      params: { id },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-[#244B35] pt-20 pb-8">
        <View className="px-5 flex-row items-center justify-between">
          <Text className="text-sm text-white/80">Emerald Tower</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity>
              <Search size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/notification' as any)}
              className="relative"
            >
              <Bell size={24} color="white" />
              {user.hasUnreadNotifications && (
                <View className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View className="px-5 -mt-4 mb-6">
          <View className="bg-white rounded-2xl shadow-sm p-5">
            <View className="flex-row items-center mb-4">
              <Image
                source={{ uri: user.avatar }}
                className="w-14 h-14 rounded-full"
              />
              <View className="flex-1 ml-4">
                <Text className="text-xs text-gray-500 mb-1">
                  Welcome back!
                </Text>
                <Text className="text-lg font-bold text-gray-900">
                  {user.name}
                </Text>
              </View>
            </View>

            <Text className="text-sm text-red-600 mb-3">
              Đã đến hạn nhập chỉ số điện, nước! Vui lòng thực hiện
            </Text>

            <TouchableOpacity className="bg-[#F5F5DC] py-3 rounded-lg">
              <Text className="text-center text-[#244B35] font-semibold">
                + Thêm chỉ số
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Latest Notifications Section */}
        <View className="px-5 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-bold text-[#D2691E]">Mới</Text>
            <TouchableOpacity
              onPress={() => router.push('/notification' as any)}
            >
              <Text className="text-sm text-gray-600">Xem tất cả →</Text>
            </TouchableOpacity>
          </View>

          {latestNotifications.map((noti) => (
            <TouchableOpacity
              key={noti.id}
              onPress={() => handlePressNotification(noti.id)}
              className="bg-white rounded-lg p-4 mb-3 shadow-sm"
            >
              <View className="flex-row items-start justify-between mb-2">
                <Text className="text-base font-semibold text-gray-800 flex-1">
                  {noti.title}
                </Text>
                <View className="bg-orange-100 px-2 py-1 rounded ml-2">
                  <Text className="text-xs text-orange-700 font-medium">
                    Bảo trì
                  </Text>
                </View>
                {noti.is_urgent && (
                  <View className="ml-2">
                    <Text className="text-red-500 text-lg">ⓘ</Text>
                  </View>
                )}
              </View>
              <Text className="text-xs text-gray-500">
                Từ: 10h30, ngày 20/11/2025
              </Text>
              <Text className="text-xs text-gray-500">
                Đến: 22h10, ngày 20/11/2025
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Important Items Section */}
        <View className="px-5 mb-6">
          <Text className="text-base font-bold text-[#D2691E] mb-3">
            Quan trọng
          </Text>

          {importantItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(item.route as any)}
              className="bg-white rounded-lg p-4 mb-3 shadow-sm flex-row items-center"
            >
              <View className="bg-gray-100 p-3 rounded-lg">
                <item.icon size={24} color="#244B35" />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-base font-semibold text-gray-800 mb-1">
                  {item.title}
                </Text>
                <Text className="text-xs text-gray-600">{item.subtitle}</Text>
              </View>
              <View className={`${item.statusColor} px-3 py-1.5 rounded-lg`}>
                <Text className="text-xs text-white font-medium">
                  {item.status}
                </Text>
              </View>
              <Text className="text-gray-400 ml-2">→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Shortcuts Section */}
        <View className="px-5 pb-6">
          <Text className="text-base font-bold text-[#D2691E] mb-3">
            Shortcuts
          </Text>

          <View className="flex-row flex-wrap gap-3">
            {shortcuts.map((shortcut) => (
              <TouchableOpacity
                key={shortcut.id}
                onPress={() => router.push(shortcut.route as any)}
                className="bg-white rounded-lg p-4 items-center justify-center shadow-sm"
                style={{ width: '47%' }}
              >
                <View className="bg-gray-100 p-4 rounded-full mb-3">
                  <shortcut.icon size={28} color="#244B35" />
                </View>
                <Text className="text-sm text-gray-800 text-center">
                  {shortcut.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
