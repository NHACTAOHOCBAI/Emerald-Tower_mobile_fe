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
    : `${service.unit_price / 1000}K/${service.unit}p`;

  const availabilityStatus = service.total_slot > 2 ? 'available' : 'full';

  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-[48%] mb-3"
      activeOpacity={0.7}
    >
      {/* Image */}
      <View className="relative">
        <Image
          source={{ uri: service.url }}
          className="w-full h-32 rounded-t-lg"
          resizeMode="cover"
        />
        {/* Overlay badge */}
        <View className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
          <Text className="text-white text-xs font-medium">{priceText}</Text>
        </View>
      </View>

      {/* Content */}
      <View className="bg-white p-3 rounded-b-lg border-x border-b border-gray-100">
        <Text
          className="text-sm font-semibold text-gray-800 mb-2"
          numberOfLines={1}
        >
          {service.name}
        </Text>
        <Text className="text-xs text-gray-600 mb-3" numberOfLines={2}>
          {service.description}
        </Text>

        {/* Action button */}
        {availabilityStatus === 'available' ? (
          <View className="bg-[#244B35] py-2 rounded-md">
            <Text className="text-white text-xs text-center font-medium">
              Đặt ngay
            </Text>
          </View>
        ) : (
          <View className="bg-gray-100 py-2 rounded-md">
            <Text className="text-gray-500 text-xs text-center font-medium">
              Đầy
            </Text>
          </View>
        )}

        {isFree && (
          <View className="absolute -top-1 -left-1 bg-green-500 px-2 py-0.5 rounded">
            <Text className="text-white text-xs font-bold">Free</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
