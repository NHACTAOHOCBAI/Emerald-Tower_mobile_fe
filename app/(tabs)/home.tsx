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
    <View className="p-5">
      <DatePicker
        value={date}
        onChange={setDate}
        label="Ngày sinh"
        minimumDate={new Date(1900, 0, 1)}
        maximumDate={new Date()}
      />
    </View>
  );
}
