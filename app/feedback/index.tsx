import FeedbackCard from '@/components/feedback/FeedbackCard';
import { CustomHeader } from '@/components/ui/CustomHeader';
import { MOCK_FEEDBACKS } from '@/constants/mockFeedbackData';
import { FeedbackStatus } from '@/types/feedback';
import { Href, router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabKey = 'all' | 'in_progress' | 'resolved';

interface Tab {
  key: TabKey;
  label: string;
  filter: (feedback: any) => boolean;
}

const TABS: Tab[] = [
  {
    key: 'all',
    label: 'Tất cả',
    filter: () => true,
  },
  {
    key: 'in_progress',
    label: 'Đang xử lý',
    filter: (f) =>
      f.status === FeedbackStatus.PENDING ||
      f.status === FeedbackStatus.IN_PROGRESS,
  },
  {
    key: 'resolved',
    label: 'Đã xong',
    filter: (f) => f.status === FeedbackStatus.RESOLVED,
  },
];

export default function FeedbackScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const currentTab = TABS.find((t) => t.key === activeTab);
  const filteredFeedbacks = MOCK_FEEDBACKS.filter(
    currentTab?.filter || (() => true)
  );

  const sortedFeedbacks = [...filteredFeedbacks].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const handlePressFeedback = (feedbackId: number) => {
    router.push({
      pathname: '/feedback/[id]',
      params: { id: feedbackId },
    } as any);
  };

  const handleCreateFeedback = () => {
    router.push('/feedback/create' as Href);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <CustomHeader title="Phản ánh" />

      <View className="flex-row gap-2 px-5 py-4">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = MOCK_FEEDBACKS.filter(tab.filter).length;

          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 px-4 rounded-full ${
                isActive ? 'bg-[#244B35]' : 'bg-gray-100'
              }`}
            >
              <Text
                className={`text-center text-sm font-medium ${
                  isActive ? 'text-white' : 'text-gray-600'
                }`}
              >
                {tab.label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="p-5"
      >
        {sortedFeedbacks.length === 0 ? (
          <View className="py-20 items-center">
            <Text className="text-gray-500 text-center">
              Chưa có phản ánh nào
            </Text>
          </View>
        ) : (
          sortedFeedbacks.map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              onPress={() => handlePressFeedback(feedback.id)}
            />
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={handleCreateFeedback}
        className="absolute bottom-8 right-5 w-16 h-16 bg-[#244B35] rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 8,
        }}
      >
        <Plus size={32} color="white" strokeWidth={3} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
