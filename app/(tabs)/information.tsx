import BaseInput from "@/components/ui/BaseInput";
import MyButton from "@/components/ui/Button";
import MyDropdown from "@/components/ui/Dropdown";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { View } from "react-native";
import * as Yup from "yup";
import { InferType } from "yup";
// template form
const loginSchema = Yup.object({
  email: Yup.string().email("Email invalid").required("Email required"),
  password: Yup.string()
    .min(6, "Min 6 characters")
    .required("Password required"),
});
type LoginForm = InferType<typeof loginSchema>;
export default function LoginScreen() {
  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    console.log("Form data: ", data);
  };

  return (
    <View style={{ padding: 20 }}>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <BaseInput
            placeholder={"Email"}
            value={value}
            onChangeText={onChange}
            error={error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <MyDropdown
            value={value}
            placeholder="Chọn giới tính"
            items={[
              { label: "Nam", value: "12@gmail.com" },
              { label: "Nữ", value: "female" },
              { label: "Khác", value: "other" },
            ]}
            onSelect={onChange}
            error={error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <BaseInput
            placeholder={"Email"}
            value={value}
            onChangeText={onChange}
            error={error?.message}
          />
        )}
      />
      <MyButton className="w-full" onPress={handleSubmit(onSubmit)}>
        Login
      </MyButton>
    </View>
  );
}
