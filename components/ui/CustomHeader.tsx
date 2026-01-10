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
  backgroundColor?: string; // Có thể truyền 'bg-white' hoặc '#C89F6C'
  textColor?: string; // Có thể truyền 'text-white' hoặc '#000000'
  iconColor?: string; // Mã màu Hex cho icon
  showBorder?: boolean;
}

export const CustomHeader = ({
  title,
  showBackButton = true,
  rightComponent,
  children,
  onBackPress,
  backgroundColor = 'white',
  textColor = '#1F2937',
  iconColor = '#1F2937',
  showBorder = true,
}: CustomHeaderProps) => {
  const router = useRouter();

  const isHexColor = backgroundColor.startsWith('#');
  const isTextHex = textColor.startsWith('#');

  return (
    <View
      style={isHexColor ? { backgroundColor } : {}}
      className={`px-5 py-4 ${!isHexColor ? backgroundColor : ''} ${showBorder ? 'border-b border-gray-100' : ''}`}
    >
      <View className="flex-row items-center justify-between min-h-[40px]">
        <View className="w-10">
          {showBackButton && (
            <TouchableOpacity
              onPress={onBackPress || (() => router.back())}
              className="py-1"
            >
              <ChevronLeft size={28} color={iconColor} />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-1 items-center px-2">
          <Text
            numberOfLines={1}
            style={isTextHex ? { color: textColor } : {}}
            className={`text-[24px] font-normal text-center ${!isTextHex ? textColor : ''}`}
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
