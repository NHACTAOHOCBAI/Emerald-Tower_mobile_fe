import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import {
  Building,
  Calendar,
  Camera,
  Home,
  IdCard,
  LogOut,
  MapPin,
  Phone,
  User,
  UserRound,
  X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BaseInput from "@/components/ui/BaseInput";
import DatePicker from "@/components/ui/DatePicker";
import MyDropdown from "@/components/ui/Dropdown";
import MySelect from "@/components/ui/Select";
import { useProvinces, useWardsByProvince } from "@/hooks/useLocation";
import { useUpdateResident } from "@/hooks/useResident";
import { ResidentResponse } from "@/types/resident";
import { InfoRow } from "./InfoRow";
import {
  checkIsVietnam,
  displayValue,
  formatDateDisplay,
  formatDateForAPI,
  formatPhoneNumber,
  GENDER_OPTIONS,
  parseDateString,
  residentSchema,
} from "./ResidentHelpers";
import { ChangePasswordModal } from "./ChangePasswordModal";
import MyButton from "../ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { changePassword } from "@/services/auth";

interface ResidentTabProps {
  data: ResidentResponse;
}

export const ResidentTab = ({ data }: ResidentTabProps) => {
  const { logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(
    null,
  );
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [provinceCode, setProvinceCode] = useState<number | null>(null);

  const { data: provinces, isLoading: loadingProvinces } = useProvinces();
  const { data: wards, isLoading: loadingWards } = useWardsByProvince(provinceCode);

  const provinceOptions = provinces?.map((p) => ({ label: p.name, value: p.code })) || [];
  const wardOptions = wards?.map((w) => ({ label: w.name, value: w.name })) || [];

  const updateMutation = useUpdateResident();
  const [pwdOpen, setPwdOpen] = useState(false);

  const submitChangePassword = async (payload: { oldPassword: string; newPassword: string }) => {
    try {
      await changePassword(payload);
      Alert.alert("Thành công", "Đổi mật khẩu thành công.");
      // logout();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Đổi mật khẩu thất bại. Vui lòng thử lại.";
      Alert.alert("Lỗi", msg);
      throw err;
    }
  };

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => void logout(),
      },
    ]);
  };
  const { control, handleSubmit, reset, setValue, watch } = useForm({
    resolver: yupResolver(residentSchema),
    defaultValues: {
      fullName: data.fullName || "",
      phone: formatPhoneNumber(data.phoneNumber),
      dob: parseDateString(data.dob),
      gender: data.gender || "MALE",
      nationality: data.nationality || "Vietnamese",
      province: data.province,
      ward: data.ward,
      detailAddress: data.detailAddress,
    },
  });

  const currentProvince = watch("province");
  const currentWard = watch("ward");
  const currentNationality = watch("nationality");
  const isVietnam = checkIsVietnam(currentNationality);

  const resetToOriginal = () => {
    reset({
      fullName: data.fullName || "",
      phone: formatPhoneNumber(data.phoneNumber),
      dob: parseDateString(data.dob),
      gender: data.gender || "MALE",
      nationality: data.nationality || "Vietnamese",
      province: data.province,
      ward: data.ward,
      detailAddress: data.detailAddress,
    });
    setSelectedImage(null);
    setProvinceCode(null);

    if (data.province && provinces) {
      const found = provinces.find((p) => p.name === data.province);
      if (found) setProvinceCode(found.code);
    }
  };

  useEffect(() => {
    resetToOriginal();
  }, [data, reset, provinces]);

  const handleCancel = () => {
    setIsEditing(false);
    resetToOriginal();
  };

  const handleEditAvatar = () => {
    Alert.alert("Cập nhật ảnh đại diện", "Chọn phương thức", [
      { text: "Chụp ảnh", onPress: openCamera },
      { text: "Chọn từ thư viện", onPress: openGallery },
      { text: "Hủy", style: "cancel" },
    ]);
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Lỗi", "Bạn cần cấp quyền truy cập Camera để chụp ảnh.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setSelectedImage(result.assets[0]);
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setSelectedImage(result.assets[0]);
  };

  const onAvatarPress = () => {
    if (isEditing) handleEditAvatar();
    else setIsZoomVisible(true);
  };

  const onSubmit: SubmitHandler<any> = (formData) => {
    updateMutation.mutate(
      {
        id: data.id,
        payload: {
          fullName: formData.fullName,
          phoneNumber: formData.phone.replace(/\s/g, ""),
          dob: formatDateForAPI(formData.dob),
          citizenId: data.citizenId,
          gender: formData.gender,
          province: isVietnam ? formData.province : "",
          ward: isVietnam ? formData.ward : "",
          district: "",
          detailAddress: formData.detailAddress,
          image: selectedImage
            ? {
              uri: selectedImage.uri,
              fileName: selectedImage.fileName,
              mimeType: selectedImage.mimeType,
            }
            : undefined,
        },
      },
      {
        onSuccess: () => {
          Alert.alert("Thành công", "Cập nhật hồ sơ thành công!");
          setIsEditing(false);
        },
        onError: () => Alert.alert("Lỗi", "Cập nhật thất bại."),
      },
    );
  };

  const currentImageUri =
    selectedImage?.uri ||
    data.imageUrl ||
    `https://ui-avatars.com/api/?name=${data.fullName || "User"}&background=random`;

  return (
    <View className="mb-4">
      <View className="items-center mb-6 mt-2">
        <TouchableOpacity
          onPress={onAvatarPress}
          className="relative"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 6,
          }}
        >
          <Image
            source={{ uri: currentImageUri }}
            className="w-28 h-28 rounded-full border-4 border-white bg-black"
            resizeMode="cover"
          />
          {isEditing && (
            <View className="absolute bottom-0 right-0 bg-[#E09B6B] p-2 rounded-full border-2 border-white elevation-4">
              <Camera size={16} color="white" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* zoom ảnh */}
      <Modal visible={isZoomVisible} transparent={true} animationType="fade">
        <View className="flex-1 bg-black/90 justify-center items-center relative">
          <SafeAreaView className="absolute top-4 right-4 z-50">
            <TouchableOpacity
              onPress={() => setIsZoomVisible(false)}
              className="bg-white/20 p-2 rounded-full"
            >
              <X size={28} color="white" />
            </TouchableOpacity>
          </SafeAreaView>
          <Image
            source={{ uri: currentImageUri }}
            style={{ width: "100%", height: "80%" }}
            resizeMode="contain"
          />
        </View>
      </Modal>

      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-[#E09B6B] text-lg font-bold">Thông tin chung</Text>
        <View className="flex-row gap-2">
          {isEditing && (
            <TouchableOpacity
              onPress={handleCancel}
              disabled={updateMutation.isPending}
              className="px-4 py-1.5 rounded-full border border-gray-300 bg-gray-100"
            >
              <Text className="text-xs font-bold text-gray-600">Hủy</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            disabled={updateMutation.isPending}
            onPress={() => (isEditing ? handleSubmit(onSubmit)() : setIsEditing(true))}
            className={`px-4 py-1.5 rounded-full border flex-row items-center gap-2 ${isEditing ? "bg-[#E09B6B] border-[#E09B6B]" : "border-[#E09B6B]"
              }`}
          >
            {updateMutation.isPending && <ActivityIndicator size="small" color="white" />}
            <Text
              className={`text-xs font-bold ${isEditing ? "text-white" : "text-[#E09B6B]"
                }`}
            >
              {isEditing ? "Lưu thay đổi" : "✎ Chỉnh sửa"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="bg-white rounded-2xl p-5 shadow-sm mb-6 border border-[#EFEAE1]">
        <View className="mb-3">
          {isEditing ? (
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InfoRow icon={User} label="Họ và tên" isEditing={true}>
                  <BaseInput
                    value={value ?? ""}
                    onChangeText={onChange}
                    error={error?.message}
                    placeholder="Nhập họ tên"
                  />
                </InfoRow>
              )}
            />
          ) : (
            <InfoRow icon={User} label="Họ và tên" value={displayValue(data.fullName)} />
          )}
        </View>

        <View className="mb-3">
          {isEditing ? (
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InfoRow icon={UserRound} label="Giới tính" isEditing={true}>
                  <MyDropdown
                    value={value}
                    items={GENDER_OPTIONS}
                    placeholder="Chọn giới tính"
                    error={error?.message}
                    onSelect={(val) => onChange(val)}
                  />
                </InfoRow>
              )}
            />
          ) : (
            <InfoRow
              icon={UserRound}
              label="Giới tính"
              value={displayValue(data.gender)}
            />
          )}
        </View>

        <View className="mb-3">
          <InfoRow icon={IdCard} label="CCCD" value={displayValue(data.citizenId)} />
        </View>

        <View className="mb-3">
          {isEditing ? (
            <Controller
              control={control}
              name="dob"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InfoRow icon={Calendar} label="Ngày sinh" isEditing={true}>
                  <DatePicker
                    label=""
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                    maximumDate={new Date()}
                  />
                </InfoRow>
              )}
            />
          ) : (
            <InfoRow
              icon={Calendar}
              label="Ngày sinh"
              value={formatDateDisplay(data.dob)}
            />
          )}
        </View>

        <View className="mb-0">
          {isEditing ? (
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InfoRow icon={Phone} label="Số điện thoại" isEditing={true}>
                  <BaseInput
                    value={value ?? ""}
                    onChangeText={(text) => onChange(formatPhoneNumber(text))}
                    error={error?.message}
                    keyboardType="numeric"
                    maxLength={12}
                  />
                </InfoRow>
              )}
            />
          ) : (
            <InfoRow
              icon={Phone}
              label="Số điện thoại"
              value={formatPhoneNumber(data.phoneNumber)}
            />
          )}
        </View>
      </View>

      <Text className="text-[#E09B6B] text-lg mb-4 font-bold">Địa chỉ thường trú</Text>
      <View className="bg-white rounded-2xl p-5 shadow-sm border border-[#EFEAE1]">
        <View className="mb-3">
          <InfoRow
            icon={Building}
            label="Quốc tịch"
            value={displayValue(data.nationality)}
          />
        </View>

        {(isEditing ? isVietnam : data.province) && (
          <View className="mb-3">
            {isEditing ? (
              <InfoRow icon={MapPin} label="Tỉnh / Thành phố" isEditing={true}>
                <MySelect
                  value={
                    currentProvince
                      ? provinceOptions.find((o) => o.label === currentProvince)?.value
                      : undefined
                  }
                  items={provinceOptions}
                  placeholder={loadingProvinces ? "Đang tải..." : "Chọn Tỉnh/TP"}
                  searchable={true}
                  onSelect={(val) => {
                    const selected = provinceOptions.find((p) => p.value === val);
                    if (selected) {
                      setValue("province", selected.label);
                      setValue("ward", "");
                      setProvinceCode(selected.value as number);
                    }
                  }}
                />
              </InfoRow>
            ) : (
              <InfoRow
                icon={MapPin}
                label="Tỉnh / Thành phố"
                value={displayValue(data.province)}
              />
            )}
          </View>
        )}

        {(isEditing ? isVietnam : data.ward) && (
          <View className="mb-3">
            {isEditing ? (
              <InfoRow icon={MapPin} label="Xã / Phường" isEditing={true}>
                <MySelect
                  value={currentWard ?? undefined}
                  items={wardOptions}
                  placeholder={
                    !provinceCode
                      ? "Vui lòng chọn Tỉnh trước"
                      : loadingWards
                        ? "Đang tải..."
                        : "Chọn Xã/Phường"
                  }
                  disabled={!provinceCode}
                  searchable={true}
                  onSelect={(val) => setValue("ward", val as string)}
                />
              </InfoRow>
            ) : (
              <InfoRow
                icon={MapPin}
                label="Xã / Phường"
                value={displayValue(data.ward)}
              />
            )}
          </View>
        )}

        <View className="mb-0">
          {isEditing ? (
            <Controller
              control={control}
              name="detailAddress"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InfoRow icon={Home} label="Số nhà, đường" isEditing={true}>
                  <BaseInput
                    value={value ?? ""}
                    onChangeText={onChange}
                    error={error?.message}
                    placeholder="Nhập số nhà, tên đường"
                  />
                </InfoRow>
              )}
            />
          ) : (
            <InfoRow
              icon={Home}
              label="Số nhà, đường"
              value={displayValue(data.detailAddress)}
            />
          )}
        </View>
      </View>
      <View className="mt-6 pb-6 flex-row gap-4 justify-center">
        <MyButton
          onPress={() => setPwdOpen(true)}
          className="py-3"
          textClassName="text-white font-semibold"
        >
          Đổi mật khẩu
        </MyButton>
        <MyButton
          onPress={handleLogout}
          className="py-3"
        >
          <View className="flex-row items-center gap-2">
            <Text className="text-white font-semibold">
              Đăng xuất
            </Text>
            <LogOut size={18} color="white" />
          </View>
        </MyButton>
      </View>
      <ChangePasswordModal
        open={pwdOpen}
        onClose={() => setPwdOpen(false)}
        onSubmit={submitChangePassword}
      />
    </View>
  );
};
