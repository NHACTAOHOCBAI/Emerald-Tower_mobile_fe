import DatePicker from "@/components/ui/DatePicker";
import { useState } from "react";
import { Text, View } from "react-native";
const ITEMS = [
  {
    key: "pending",
    label: "Pending",
    quantity: 2,
    content: <Text>Pending</Text>,
  },
  {
    key: "completed",
    label: "Completed",
    quantity: 10,
    content: <Text>Completed</Text>,
  },
] as const;
export default function Screen() {
  const [date, setDate] = useState(new Date());
  return (
    <View className="p-[20px]">
      <DatePicker
        className="w-[200px]"
        value={date}
        onChange={setDate}
        placeholder="Chọn ngày sinh"
      />
      {/* <Tab items={ITEMS} defaultValue="pending" /> */}
    </View>
  );
}
