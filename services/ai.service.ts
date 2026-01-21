import { OCRResponse } from "@/types/ai";
import { Platform } from "react-native";
import { api } from "./api";

export const scanMeterImage = async (imageUri: string): Promise<string> => {
  const formData = new FormData();

  const filename = imageUri.split("/").pop() || "meter.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image/jpeg`;

  formData.append("file", {
    uri: Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri,
    name: filename,
    type: type,
  } as any);

  // Note: The API endpoint in your image is /api/v1/ai/ocr/read-meter
  // Adjust the base URL or path if your 'api' instance has a prefix.
  const response = await api.post<{ data: OCRResponse }>("/ai/ocr/read-meter", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.data.meter_reading;
};
