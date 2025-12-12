import { cn } from "@/utils/cn";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface DropdownItem {
  label: string;
  value: string | number;
}

interface DropdownProps {
  value?: string | number;
  placeholder?: string;
  items: DropdownItem[];
  error?: string;
  disabled?: boolean;
  onSelect?: (value: string | number) => void;
  className?: string;
  width?: number;
}

export default function MyDropdown({
  value,
  placeholder = "Select...",
  items,
  error,
  disabled,
  onSelect,
  className,
  width,
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  const height = useSharedValue(0);
  const focus = useSharedValue(0);

  const animatedContainer = useAnimatedStyle(() => {
    const borderColor = error
      ? "#EF4444"
      : interpolateColor(focus.value, [0, 1], ["#D9D9D9", "#244B35"]);

    return { borderColor };
  });

  const itemHeight = 48; // chiều cao 1 item
  const maxHeight = 240; // nếu nhiều item, scroll

  const animatedHeight = useAnimatedStyle(() => {
    const targetHeight = open
      ? Math.min(items.length * itemHeight, maxHeight)
      : 0;

    return {
      height: withTiming(targetHeight, { duration: 180 }),
      opacity: withTiming(open ? 1 : 0, { duration: 160 }),
    };
  });

  const selectedLabel =
    items.find((x) => x.value === value)?.label || placeholder;

  const toggleDropdown = () => {
    if (disabled) return;
    const next = !open;
    setOpen(next);
    focus.value = withTiming(next ? 1 : 0, { duration: 180 });
    height.value = next ? 1 : 0;
  };

  const handleSelect = (v: DropdownItem) => {
    setOpen(false);
    focus.value = withTiming(0, { duration: 180 });
    onSelect && onSelect(v.value);
  };

  const closeDropdown = () => {
    setOpen(false);
    focus.value = withTiming(0, { duration: 180 });
  };

  return (
    <View className="relative">
      {/* Header */}
      <Animated.View
        style={[animatedContainer]}
        className={cn(`rounded-lg border`, className, `w-[${width}px]`)}
      >
        <Pressable
          onPress={toggleDropdown}
          className={cn(
            "px-3 py-3 flex-row justify-between items-center",
            disabled && "opacity-50 bg-gray-100"
          )}
        >
          <Text
            className={cn(
              "text-base font-BeVietnamPro",
              value ? "text-[#244B35]" : "text-gray-400"
            )}
          >
            {selectedLabel}
          </Text>

          {open ? (
            <ChevronUp color="#6b7280" size={20} />
          ) : (
            <ChevronDown color="#6b7280" size={20} />
          )}
        </Pressable>
      </Animated.View>

      {/* OUTSIDE CLICK OVERLAY */}
      {open && (
        <Pressable
          onPress={closeDropdown}
          className="absolute top-0 left-0 right-0 bottom-0"
        >
          <View />
        </Pressable>
      )}

      {/* Dropdown list */}
      <Animated.View
        style={animatedHeight}
        className={cn(
          "overflow-hidden border border-[#D9D9D9] rounded-lg  bg-white absolute w-full z-10 mt-[48px]",
          `w-[${width}px]`
        )}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.value.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ height: itemHeight }}
              onPress={() => handleSelect(item)}
              className="px-3 py-3 border-b border-gray-100"
            >
              <Text className="text-base text-[#244B35] font-BeVietnamPro">
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </Animated.View>

      {error && <Text className="text-red-500 mt-1 text-sm">{error}</Text>}
    </View>
  );
}
