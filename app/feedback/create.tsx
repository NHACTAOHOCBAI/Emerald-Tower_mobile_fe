import CategorySelector from '@/components/feedback/CategorySelector';
import { CustomHeader } from '@/components/ui/CustomHeader';
import { IssueType } from '@/types/feedback';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { ChevronDown, Image as ImageIcon, X } from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateFeedbackScreen() {
  const [selectedType, setSelectedType] = useState<IssueType | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [building, setBuilding] = useState('Tòa A');
  const [floor, setFloor] = useState('Tầng 3');
  const [room, setRoom] = useState('Phòng 301');
  const [images, setImages] = useState<string[]>([]);
  const [detailDescription, setDetailDescription] = useState('');

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Thông báo', 'Cần cấp quyền truy cập thư viện ảnh');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images' as any,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...newImages].slice(0, 5)); // Max 5 images
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!selectedType) {
      Alert.alert('Thông báo', 'Vui lòng chọn loại sự cố');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tiêu đề');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập mô tả');
      return;
    }

    Alert.alert('Thành công', 'Đã gửi phản ánh thành công!', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <CustomHeader title="Tạo phản ánh" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-5">
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-3">
              Phân loại sự cố <Text className="text-red-500">*</Text>
            </Text>
            <CategorySelector
              selectedType={selectedType}
              onSelect={setSelectedType}
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Tiêu đề <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              placeholder="VD: Thang máy Block B đứng đột ngột giữa chừng"
              value={title}
              onChangeText={setTitle}
              className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Vị trí sự cố <Text className="text-red-500">*</Text>
            </Text>
            <View className="flex-row gap-2">
              <TouchableOpacity className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-3 flex-row items-center justify-between">
                <Text className="text-gray-800">{building}</Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>

              <TouchableOpacity className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-3 flex-row items-center justify-between">
                <Text className="text-gray-800">{floor}</Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity className="mt-2 bg-white border border-gray-200 rounded-lg px-4 py-3 flex-row items-center justify-between">
              <Text className="text-gray-800">{room}</Text>
              <ChevronDown size={20} color="#6B7280" />
            </TouchableOpacity>
            <TextInput
              placeholder="Chi tiết khác"
              value={detailDescription}
              onChangeText={setDetailDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              className="mt-2 bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Mô tả chi tiết
            </Text>
            <TextInput
              placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Ảnh/video đính kèm (Tối đa 5 ảnh){' '}
              <Text className="text-red-500">*</Text>
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {images.map((uri, index) => (
                <View key={index} className="relative w-20 h-20">
                  <Image
                    source={{ uri }}
                    className="w-full h-full rounded-lg"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full items-center justify-center"
                  >
                    <X size={14} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              {images.length < 5 && (
                <TouchableOpacity
                  onPress={handlePickImage}
                  className="w-20 h-20 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center"
                >
                  <ImageIcon size={24} color="#9CA3AF" />
                  <Text className="text-xs text-gray-500 mt-1">Thêm ảnh</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-[#244B35] py-4 rounded-lg mt-4"
          >
            <Text className="text-white text-center font-bold text-base">
              Gửi phản ánh
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
