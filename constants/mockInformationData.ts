import { ApartmentInfo, ResidentInfo } from "@/types/information";

export const MOCK_RESIDENT: ResidentInfo = {
  id: "1",
  name: "Nguyễn Lưu Ly",
  cccd: "079090012345",
  dob: "01/05/1990",
  email: "luuly@gmail.com",
  phone: "0912345678",
  residencyStatus: "Chủ căn hộ",
  startDate: "15/01/2023",
};

export const MOCK_APARTMENT: ApartmentInfo = {
  id: "A1205",
  code: "A12.05",
  area: "85m2",
  block: "Tòa A",
  floor: "Tầng 12",
  type: "2 phòng ngủ",
  fullAddress: "Tòa A, Tầng 12, Emerald Tower",
};
