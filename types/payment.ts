export interface PaymentTransaction {
  id: number;
  txnRef: string;
  targetType: string;
  targetId: number;
  amount: string; // "4252270.00"
  currency: string;
  paymentMethod: string; // "MOMO", "VNPAY"
  status: "PENDING" | "SUCCESS" | "FAILED";
  description: string;
  payDate: string | null;
  paymentUrl: string | null;
  createdAt: string;
}
