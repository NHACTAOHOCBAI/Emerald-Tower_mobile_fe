import { MOCK_VOTINGS_WITH_STATUS } from '@/constants/mockVotingData';
import { Voting, VotingStatus } from '@/types/voting';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import VotingCard from '../../components/voting/VotingCard';
import StatusTabs from '../../components/voting/VotingStatusTabs';

export default function VotingScreen() {
  const [activeStatus, setActiveStatus] = useState<VotingStatus>('ongoing');

  // Filter votings theo status
  const filteredVotings = MOCK_VOTINGS_WITH_STATUS.filter(
    (v) => v.status === activeStatus
  );

  // Đếm số lượng mỗi status
  const counts = {
    ongoing: MOCK_VOTINGS_WITH_STATUS.filter((v) => v.status === 'ongoing')
      .length,
    upcoming: MOCK_VOTINGS_WITH_STATUS.filter((v) => v.status === 'upcoming')
      .length,
    closed: MOCK_VOTINGS_WITH_STATUS.filter((v) => v.status === 'closed')
      .length,
  };

  const handlePressVote = (voting: Voting) => {
    // Navigate đến màn hình voting detail
    router.push({
      pathname: '/voting/[id]',
      params: { id: voting.id },
    });
  };

  const handlePressResult = (voting: Voting) => {
    router.push({
      pathname: '/voting/result/[id]',
      params: { id: voting.id },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 py-4 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">E-Voting</Text>
      </View>

      {/* Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 py-4">
          {/* Status Tabs */}
          <StatusTabs
            activeStatus={activeStatus}
            onChangeStatus={setActiveStatus}
            counts={counts}
          />

          {/* Voting List */}
          {filteredVotings.length === 0 ? (
            <View className="py-10 items-center">
              <Text className="text-gray-500">
                Không có biểu quyết nào trong mục này
              </Text>
            </View>
          ) : (
            filteredVotings.map((voting) => (
              <VotingCard
                key={voting.id}
                voting={voting}
                onPressVote={handlePressVote}
                onPressResult={handlePressResult}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
