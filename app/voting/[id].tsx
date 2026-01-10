import { MOCK_VOTINGS_WITH_STATUS } from '@/constants/mockVotingData';
import { Option } from '@/types/voting';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function VotingDetailScreen() {
  const { id } = useLocalSearchParams();
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

  const voting = MOCK_VOTINGS_WITH_STATUS.find((v) => v.id === Number(id));

  if (!voting) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text>Không tìm thấy biểu quyết</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSubmitVote = () => {
    if (!selectedOptionId) {
      Alert.alert('Thông báo', 'Vui lòng chọn một phương án');
      return;
    }

    Alert.alert('Thành công', 'Bạn đã biểu quyết thành công!', [
      {
        text: 'Xem kết quả',
        onPress: () => {
          router.replace({
            pathname: '/voting/result/[id]',
            params: { id: voting.id },
          });
        },
      },
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white px-5 py-4 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">Biểu quyết</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 py-4">
          <Text className="text-lg font-bold text-gray-800 mb-8 text-center">
            {voting.title}
          </Text>

          {voting.options.map((option) => (
            <OptionCard
              key={option.id}
              option={option}
              isSelected={selectedOptionId === option.id}
              onSelect={() => setSelectedOptionId(option.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View className="bg-white px-5 py-4 border-t border-gray-100 mb-16">
        <TouchableOpacity
          className="bg-[#244B35] py-4 rounded-lg"
          onPress={handleSubmitVote}
        >
          <Text className="text-white text-center font-semibold text-base">
            Xác nhận
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function OptionCard({
  option,
  isSelected,
  onSelect,
}: {
  option: Option;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onSelect}
      className={`bg-white rounded-lg p-4 mb-3 border-2 ${
        isSelected ? 'border-[#244B35]' : 'border-gray-200'
      }`}
    >
      <View className="flex-row items-start">
        <View
          className={`w-5 h-5 rounded-full border-2 mr-3 mt-0.5 ${
            isSelected
              ? 'border-[#244B35] bg-[#244B35]'
              : 'border-gray-300 bg-white'
          }`}
        >
          {isSelected && (
            <View className="w-2 h-2 rounded-full bg-white m-auto" />
          )}
        </View>

        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            {option.name}
          </Text>
          {option.description && (
            <Text className="text-sm text-gray-600 leading-5 whitespace-pre-line">
              {option.description}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
