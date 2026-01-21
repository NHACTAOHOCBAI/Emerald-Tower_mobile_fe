import { getPaymentHistoryByInvoice } from "@/services/payment.service";
import { useQuery } from "@tanstack/react-query";

export const usePaymentHistory = (invoiceId: number) => {
  return useQuery({
    queryKey: ["payment-history", invoiceId],
    queryFn: () => getPaymentHistoryByInvoice(invoiceId),
    enabled: !!invoiceId,
  });
};
