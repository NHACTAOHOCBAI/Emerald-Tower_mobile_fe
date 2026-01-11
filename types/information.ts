export interface ResidentInfo {
  id: string;
  name: string;
  cccd: string;
  dob: string;
  email: string;
  phone: string;
  residencyStatus: string;
  startDate: string;
}

export interface ApartmentInfo {
  id: string;
  code: string;
  area: string;
  block: string;
  floor: string;
  type: string;
  fullAddress: string;
}
