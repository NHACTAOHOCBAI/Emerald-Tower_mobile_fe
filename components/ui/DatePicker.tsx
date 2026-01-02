import { CalendarDays } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  value?: Date;
  onChange: (d: Date) => void;
  error?: string;
  placeholder?: string;

  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  selectedItemClassName?: string;
};

export default function DatePicker({
  value,
  onChange,
  error,
  placeholder = "Chọn ngày",

  className,
  triggerClassName,
  contentClassName,
  itemClassName,
  selectedItemClassName = "bg-orange-200 rounded-lg",
}: Props) {
  const [open, setOpen] = useState(false);

  const display = value ? value.toLocaleDateString("vi-VN") : placeholder;
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <View className={`mb-3 ${className ?? ""}`}>
      <Pressable
        onPress={() => setOpen(!open)}
        className={`flex-row items-center px-4 py-3 rounded-xl border ${
          error ? "border-red-500" : "border-gray-300"
        } ${triggerClassName ?? ""}`}
      >
        <CalendarDays size={18} color="#666" />
        <Text className={`ml-2 ${value ? "text-black" : "text-gray-400"}`}>
          {display}
        </Text>
      </Pressable>

      {open && (
        <View
          className={`mt-2 bg-white p-3 rounded-xl shadow-md ${contentClassName ?? ""}`}
        >
          <View className="flex-row flex-wrap">
            {days.map((d) => {
              const isSelected = d === value?.getDate();
              return (
                <Pressable
                  key={d}
                  onPress={() => {
                    const newDate = value ? new Date(value) : new Date();
                    newDate.setDate(d);
                    onChange(newDate);
                    setOpen(false);
                  }}
                  className={` items-center p-2 ${
                    isSelected ? selectedItemClassName : (itemClassName ?? "")
                  }`}
                >
                  <Text
                    className={`${
                      isSelected ? "font-semibold text-black" : ""
                    }`}
                  >
                    {d}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {error && <Text className="text-red-500 mt-1 text-xs">{error}</Text>}
    </View>
  );
}
