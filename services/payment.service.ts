import { PaymentTransaction } from "@/types/payment";
import { api } from "./api";

export const getPaymentHistoryByInvoice = async (
  invoiceId: number,
): Promise<PaymentTransaction[]> => {
  const response = await api.get<{ data: PaymentTransaction[] }>(
    `/payments/invoice/${invoiceId}`,
  );
  return response.data.data;
};
