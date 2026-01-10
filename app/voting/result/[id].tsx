import { MOCK_VOTINGS_WITH_STATUS } from '@/constants/mockVotingData';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const CHART_COLORS = [
  '#5B8C5A', // Green
  '#8FBC94', // Light green
  '#C8E6C9', // Very light green
  '#A5D6A7', // Pale green
  '#81C784', // Medium green
];

export default function VotingResultScreen() {
  const { id } = useLocalSearchParams();

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

  const totalVotes = voting.options.reduce(
    (sum, opt) => sum + (opt.vote_count || 0),
    0
  );

  const chartData = voting.options.map((option, index) => ({
    name: option.name.replace('Phương án ', 'PA '),
    population: option.vote_count || 0,
    color: CHART_COLORS[index % CHART_COLORS.length],
    legendFontColor: '#374151',
    legendFontSize: 12,
  }));

  const getPercentage = (voteCount: number) => {
    if (totalVotes === 0) return 0;
    return ((voteCount / totalVotes) * 100).toFixed(1);
  };

  const winningOption = voting.options.reduce((prev, current) =>
    (prev.vote_count || 0) > (current.vote_count || 0) ? prev : current
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white px-5 py-4 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">Kết quả</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 py-4">
          <Text className="text-lg font-bold text-gray-800 mb-8 text-center">
            {voting.title}
          </Text>

          <View className="bg-white rounded-lg p-4 mb-4 items-center">
            <Text className="text-sm text-gray-600 mb-1">
              Tổng số lượt bình chọn
            </Text>
            <Text className="text-3xl font-bold text-[#244B35]">
              {totalVotes}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">lượt bỏ phiếu</Text>
          </View>

          {totalVotes > 0 && (
            <View className="bg-white rounded-lg p-4 mb-4 items-center">
              <PieChart
                data={chartData}
                width={Dimensions.get('window').width - 60}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          )}

          <View className="bg-white rounded-lg p-4 mb-4">
            {voting.options.map((option, index) => {
              const percentage = getPercentage(option.vote_count || 0);
              const isWinner = option.id === winningOption.id && totalVotes > 0;
              const progressWidth =
                `${Math.min(Number(percentage), 100)}%` as const;

              return (
                <View
                  key={option.id}
                  className={`mb-4 pb-4 ${
                    index < voting.options.length - 1
                      ? 'border-b border-gray-100'
                      : ''
                  }`}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1 flex-row items-center">
                      <View
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            CHART_COLORS[index % CHART_COLORS.length],
                        }}
                      />
                      <Text
                        className={`flex-1 text-sm ${
                          isWinner
                            ? 'font-bold text-[#244B35]'
                            : 'text-gray-700'
                        }`}
                      >
                        {option.name}
                      </Text>
                    </View>
                    <Text
                      className={`text-sm font-bold ml-2 ${
                        isWinner ? 'text-[#244B35]' : 'text-gray-600'
                      }`}
                    >
                      {percentage}%
                    </Text>
                  </View>

                  <View className="bg-gray-100 h-2 rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: progressWidth,
                        backgroundColor:
                          CHART_COLORS[index % CHART_COLORS.length],
                      }}
                    />
                  </View>

                  <Text className="text-xs text-gray-500 mt-1">
                    {option.vote_count || 0} lượt bỏ phiếu
                  </Text>
                </View>
              );
            })}
          </View>

          {totalVotes > 0 && (
            <View className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <Text className="text-sm font-semibold text-green-800 mb-1">
                🎉 Phương án dẫn đầu
              </Text>
              <Text className="text-base font-bold text-green-900">
                {winningOption.name}
              </Text>
              <Text className="text-sm text-green-700 mt-2">
                Với {winningOption.vote_count} lượt bỏ phiếu (
                {getPercentage(winningOption.vote_count || 0)}%)
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
