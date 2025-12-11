import MyButton from "@/components/ui/Button";
import { View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="bg-red-200 p-4">
      <MyButton isLoading={true}>Primary</MyButton>
      <MyButton disabled={true} variant="secondary">
        secondary
      </MyButton>
      <MyButton variant="outline">outline</MyButton>
    </View>
  );
}
