import BaseInput from "@/components/ui/BaseInput";
import MyDropdown from "@/components/ui/Dropdown";
import { useState } from "react";
import { View } from "react-native";

export default function TestScreen() {
  const [gender, setGender] = useState<string | number>();

  return (
    <View className="p-4">
      <BaseInput />
      <MyDropdown
        value={gender}
        placeholder="Chọn giới tính"
        items={[
          { label: "Nam", value: "male" },
          { label: "Nữ", value: "female" },
          { label: "Khác", value: "other" },
        ]}
        onSelect={(v) => setGender(v)}
        error={!gender ? "Vui lòng chọn giới tính" : ""}
      />
    </View>
  );
}
