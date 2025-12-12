import MultiImageUpload from "@/components/ui/MultiImageUpload";
import { useState } from "react";
import { View } from "react-native";

export default function Screen() {
  const [photos, setPhotos] = useState<string[]>([]);

  return (
    <View className="p-4 mt-10">
      <MultiImageUpload value={photos} onChange={setPhotos} max={1} />;
      {/* <Text className="mt-4 text-gray-500">
        Link ảnh: {photos ?? "Chưa có ảnh"}
      </Text> */}
    </View>
  );
}
