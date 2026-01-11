import { yupResolver } from "@hookform/resolvers/yup";
import { Building, Calendar, CreditCard, Mail, Phone, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";

import BaseInput from "@/components/ui/BaseInput";
import DatePicker from "@/components/ui/DatePicker";
import { ResidentInfo } from "@/types/information";

interface ResidentTabProps {
  data: ResidentInfo;
}

// validate
const residentSchema = Yup.object({
  phone: Yup.string()
    .required("Số điện thoại là bắt buộc")
    .test("len", "Số điện thoại phải đủ 10 số", (val) => {
      if (!val) return false;
      const cleanVal = val.replace(/\s/g, "");
      return cleanVal.length === 10;
    }),
  dob: Yup.date().required("Ngày sinh là bắt buộc"),
});

const parseDateString = (dateStr: string) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(Number(year), Number(month) - 1, Number(day));
};

const formatDateToString = (date: Date) => {
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
};

const formatPhoneNumber = (text: string) => {
  const cleaned = text.replace(/\D/g, "");

  // hiển thị chia nhóm 4-3-3
  if (cleaned.length > 7) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 10)}`;
  } else if (cleaned.length > 4) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  }
  return cleaned;
};

export const ResidentTab = ({ data }: ResidentTabProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(residentSchema),
    defaultValues: {
      phone: formatPhoneNumber(data.phone),
      dob: parseDateString(data.dob),
    },
  });

  useEffect(() => {
    reset({
      phone: formatPhoneNumber(data.phone),
      dob: parseDateString(data.dob),
    });
  }, [data, reset]);

  const onSubmit: SubmitHandler<{ phone: string; dob: Date }> = (formData) => {
    const payload = {
      ...data,
      phone: formData.phone.replace(/\s/g, ""),
      dob: formatDateToString(formData.dob),
    };
    // console.log("submit payload:", payload);
    setIsEditing(false);
  };

  return (
    <View className="mb-4">
      <View className="flex-row justify-between items-center mb-4 mt-2">
        <Text className="text-secondary font-BeVietnamProSemi text-lg">
          Thông tin chung
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (isEditing) {
              handleSubmit(onSubmit)();
            } else {
              setIsEditing(true);
            }
          }}
          className={`px-4 py-1.5 rounded-full border ${
            isEditing ? "bg-secondary border-secondary" : "border-secondary"
          }`}
        >
          <Text
            className={`text-xs font-BeVietnamProMedium ${
              isEditing ? "text-white" : "text-secondary"
            }`}
          >
            {isEditing ? "Lưu thay đổi" : "✎ Chỉnh sửa"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-2xl p-5 shadow-sm mb-6 border border-third">
        <InfoRow icon={User} label="Họ và tên" value={data.name} />
        <InfoRow icon={CreditCard} label="CCCD" value={data.cccd} />

        <View className="mb-5">
          <Controller
            control={control}
            name="dob"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View className="flex-row items-center">
                <View className="w-10 items-center">
                  <Calendar size={22} color="#4B5563" />
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-gray-400 font-BeVietnamPro text-xs mb-1">
                    Ngày sinh
                  </Text>
                  {isEditing ? (
                    <DatePicker
                      label=""
                      value={value}
                      onChange={onChange}
                      error={error?.message}
                      maximumDate={new Date()}
                    />
                  ) : (
                    <Text className="text-foreground font-BeVietnamProSemi text-base">
                      {formatDateToString(value)}
                    </Text>
                  )}
                </View>
              </View>
            )}
          />
        </View>

        <InfoRow icon={Mail} label="Email" value={data.email} />

        <View className="mb-0">
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View className="flex-row items-center">
                <View className="w-10 items-center">
                  <Phone size={22} color="#4B5563" />
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-gray-400 font-BeVietnamPro text-xs mb-1">
                    Số điện thoại
                  </Text>
                  {isEditing ? (
                    <BaseInput
                      placeholder="Nhập số điện thoại"
                      value={value}
                      onChangeText={(text) => {
                        const formatted = formatPhoneNumber(text);
                        onChange(formatted);
                      }}
                      error={error?.message}
                      keyboardType="numeric"
                      maxLength={12}
                    />
                  ) : (
                    <Text className="text-foreground text-base font-BeVietnamProSemi">
                      {value}
                    </Text>
                  )}
                </View>
              </View>
            )}
          />
        </View>
      </View>

      <Text className="text-secondary font-BeVietnamProSemi text-lg mb-4">
        Tình trạng cư trú
      </Text>
      <View className="bg-white rounded-2xl p-5 shadow-sm border border-third">
        <InfoRow icon={Building} label="Tình trạng cư trú" value={data.residencyStatus} />
        <InfoRow
          icon={Calendar}
          label="Ngày bắt đầu cư trú"
          value={data.startDate}
          isLastItem
        />
      </View>
    </View>
  );
};

const InfoRow = ({ icon: Icon, label, value, isLastItem = false }: any) => (
  <View className={`flex-row items-center ${isLastItem ? "" : "mb-5"}`}>
    <View className="w-10 items-center">
      <Icon size={22} color="#4B5563" />
    </View>
    <View className="flex-1 ml-2">
      <Text className="text-gray-400 font-BeVietnamPro text-xs mb-1">{label}</Text>
      <Text className="text-foreground font-BeVietnamProSemi text-base">{value}</Text>
    </View>
  </View>
);
