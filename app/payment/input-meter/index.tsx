import { useRouter } from "expo-router";
import { Droplet, Zap } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BigImageUpload from "@/components/ui/BigImageUpload";
import MyButton from "@/components/ui/Button";
import { CustomHeader } from "@/components/ui/CustomHeader";

export default function InputMeterScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: điện, 2: nước

  const [elecIndex, setElecIndex] = useState("");
  const [waterIndex, setWaterIndex] = useState("");
  const [elecImage, setElecImage] = useState<string | null>(null);
  const [waterImage, setWaterImage] = useState<string | null>(null);

  const isInvalidNumber = (text: string) => {
    if (text.length === 0) return false;
    return !/^\d+$/.test(text);
  };

  const isElecError = isInvalidNumber(elecIndex);
  const isWaterError = isInvalidNumber(waterIndex);

  // config UI theo bước
  const isElec = step === 1;
  const iconColor = isElec ? "#FACC15" : "#3B82F6";
  const StepIcon = isElec ? Zap : Droplet;

  // Xác định lỗi hiện tại để render UI
  const currentError = isElec ? isElecError : isWaterError;

  // validate (Thêm điều kiện !isError để chặn nút nếu nhập sai)
  const isValidStep1 = elecIndex.length > 0 && !isElecError && elecImage !== null;
  const isValidStep2 = waterIndex.length > 0 && !isWaterError && waterImage !== null;

  const handleNext = () => {
    if (step === 1) setStep(2);
  };
  const handleBack = () => {
    if (step === 2) setStep(1);
    else router.back();
  };
  const handleSubmit = () => {
    console.log({ elecIndex, elecImage, waterIndex, waterImage });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F3F4F6]">
      <CustomHeader title="Nhập chỉ số đồng hồ" onBackPress={handleBack}>
        <View className="items-center">
          <Text className="text-xs text-gray-500">Bước {step}/2</Text>
        </View>
      </CustomHeader>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-5 pt-2" showsVerticalScrollIndicator={false}>
          {/* progress bar */}
          <View className="flex-row gap-2 mb-8">
            <View
              className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-[#1a4c30]" : "bg-gray-200"}`}
            />
            <View
              className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-[#1a4c30]" : "bg-gray-200"}`}
            />
          </View>

          <View className="flex-row items-center gap-2 mb-7">
            <StepIcon size={24} color={iconColor} fill={iconColor} />
            <Text className="text-xl font-extrabold text-main">
              {isElec ? "Chỉ số điện" : "Chỉ số nước"}
            </Text>
          </View>

          <View className="mb-6">
            <Text className="font-semibold text-gray-800 mb-2">
              Nhập chỉ số {isElec ? "điện (kWh)" : "nước (m³)"}{" "}
              <Text className="text-red-500">*</Text>
            </Text>

            <TextInput
              value={isElec ? elecIndex : waterIndex}
              onChangeText={isElec ? setElecIndex : setWaterIndex}
              placeholder={isElec ? "Ví dụ: 1593" : "Ví dụ: 159"}
              placeholderTextColor="#D1D5DD"
              keyboardType="numeric"
              className={`w-full bg-white border rounded-xl py-5 text-xl font-bold text-center 
                ${
                  currentError
                    ? "border-red-500 text-red-500 bg-red-50"
                    : "border-gray-200 text-black"
                }`}
            />

            {/* thông báo lỗi hoặc hướng dẫn */}
            {currentError ? (
              <Text className="text-xs text-red-500 mt-2 text-center font-medium">
                Vui lòng chỉ nhập số nguyên, không nhập ký tự lạ.
              </Text>
            ) : (
              <Text className="text-xs text-gray-400 mt-2 text-center">
                Chỉ số từ đồng hồ {isElec ? "điện" : "nước"} của bạn
              </Text>
            )}
          </View>

          <View className="mb-8">
            <Text className="font-semibold text-gray-800 mb-2">
              Chụp ảnh minh chứng <Text className="text-red-500">*</Text>
            </Text>
            <BigImageUpload
              value={isElec ? elecImage : waterImage}
              onChange={(img) => (isElec ? setElecImage(img) : setWaterImage(img))}
              height={200}
            />
          </View>
        </ScrollView>

        <View className="p-5 border-t border-gray-100">
          {step === 1 ? (
            <MyButton
              variant="primary"
              className="!bg-[#E09B6B] !w-full h-14"
              onPress={handleNext}
              disabled={!isValidStep1}
            >
              Tiếp tục
            </MyButton>
          ) : (
            <View className="flex-row gap-3">
              <View className="flex-1">
                <MyButton
                  variant="outline"
                  className="!w-full h-12 border-gray-400"
                  textClassName="text-gray-700 font-semibold"
                  onPress={handleBack}
                >
                  Quay lại
                </MyButton>
              </View>

              <View className="flex-1">
                <MyButton
                  variant="primary"
                  className="!bg-[#E09B6B] !w-full h-14"
                  textClassName="font-bold"
                  onPress={handleSubmit}
                  disabled={!isValidStep2}
                >
                  Xác nhận
                </MyButton>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
