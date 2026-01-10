import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  children?: React.ReactNode;
  onBackPress?: () => void;
}

export const CustomHeader = ({
  title,
  showBackButton = true,
  rightComponent,
  children,
  onBackPress,
}: CustomHeaderProps) => {
  const router = useRouter();

  return (
    <View className="px-5 py-4">
      <View className="flex-row items-center justify-between min-h-[40px]">
        <View className="w-10">
          {showBackButton && (
            <TouchableOpacity
              onPress={onBackPress || (() => router.back())}
              className="py-1"
            >
              <ChevronLeft size={28} color="#1F2937" />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-1 items-center">
          <Text
            numberOfLines={1}
            className="text-[24px] font-normal text-gray-800 text-center"
          >
            {title}
          </Text>
        </View>

        <View className="w-10 items-end">
          {rightComponent ? rightComponent : <View className="w-6" />}
        </View>
      </View>

      {children && <View className="mt-4">{children}</View>}
    </View>
  );
};
