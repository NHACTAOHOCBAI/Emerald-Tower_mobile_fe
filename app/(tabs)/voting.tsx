import { CustomHeader } from '@/components/ui/CustomHeader';
import { MOCK_VOTINGS_WITH_STATUS } from '@/constants/mockVotingData';
import { Voting, VotingStatus } from '@/types/voting';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VotingCard from '../../components/voting/VotingCard';
import StatusTabs from '../../components/voting/VotingStatusTabs';

export default function VotingScreen() {
  const [activeStatus, setActiveStatus] = useState<VotingStatus>('ongoing');

  const filteredVotings = MOCK_VOTINGS_WITH_STATUS.filter(
    (v) => v.status === activeStatus
  );

  const counts = {
    ongoing: MOCK_VOTINGS_WITH_STATUS.filter((v) => v.status === 'ongoing')
      .length,
    upcoming: MOCK_VOTINGS_WITH_STATUS.filter((v) => v.status === 'upcoming')
      .length,
    closed: MOCK_VOTINGS_WITH_STATUS.filter((v) => v.status === 'closed')
      .length,
  };

  const handlePressVote = (voting: Voting) => {
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
      <CustomHeader title="E-Voting" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 py-4">
          <StatusTabs
            activeStatus={activeStatus}
            onChangeStatus={setActiveStatus}
            counts={counts}
          />

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
