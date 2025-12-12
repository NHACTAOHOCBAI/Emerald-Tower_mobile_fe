import BaseInput from "@/components/ui/BaseInput";
import MyButton from "@/components/ui/Button";
import MyMultiImageUpload from "@/components/ui/MultiImageUpload";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { View } from "react-native";
import * as Yup from "yup";
import { InferType } from "yup";

const loginSchema = Yup.object({
  email: Yup.string().email("Email invalid").required("Email required"),
  password: Yup.string()
    .min(6, "Min 6 characters")
    .required("Password required"),
  images: Yup.array()
    .of(Yup.string())
    .min(1, "Chọn ít nhất 1 ảnh")
    .required("Images required"),
});

type LoginForm = InferType<typeof loginSchema>;

export default function LoginScreen() {
  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      images: [],
    },
  });

  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    console.log("Form data: ", data);
  };

  return (
    <View style={{ padding: 20 }}>
      {/* Email */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <BaseInput
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            error={error?.message}
          />
        )}
      />

      {/* Password */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <BaseInput
            placeholder="Password"
            value={value}
            onChangeText={onChange}
            error={error?.message}
          />
        )}
      />

      {/* Images Upload */}
      <Controller
        control={control}
        name="images"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <View style={{ marginTop: 10 }}>
            <MyMultiImageUpload
              error={error?.message}
              value={value as any}
              onChange={(imgs) => onChange(imgs)}
            />
          </View>
        )}
      />

      <MyButton className="w-full mt-4" onPress={handleSubmit(onSubmit)}>
        Login
      </MyButton>
    </View>
  );
}
