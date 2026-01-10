import { Service } from '@/types/service';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface ServiceCardProps {
  service: Service;
  onPress: () => void;
}

export default function ServiceCard({ service, onPress }: ServiceCardProps) {
  const isFree = service.unit_price === 0;
  const priceText = isFree
    ? 'Free'
    : `${service.unit_price / 1000}K/${service.unit}`;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-[48%] mb-3 bg-white rounded-lg"
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: service.url }}
        className="w-full h-32"
        resizeMode="cover"
      />

      <View className="p-3">
        <Text
          className="text-sm font-semibold text-gray-800 mb-2"
          numberOfLines={1}
        >
          {service.name}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-medium text-gray-800">{priceText}</Text>
          <View className="bg-[#244B35] px-3 py-1.5 rounded-md">
            <Text className="text-white text-xs font-medium">Xem</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
