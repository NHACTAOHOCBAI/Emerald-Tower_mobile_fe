export interface InvoiceHistory {
  id: string;
  invoiceCode: string;
  title: string;
  amount: number;
  status: "paid" | "unpaid" | "overdue";
  dueDate: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  amount: number;
  type: "management" | "electricity" | "water";
  period: string;
}

export interface MonthlyInvoice {
  id: string;
  invoiceCode: string;
  monthTitle: string;
  period: string;
  totalAmount: number;
  status: "unpaid" | "selected";
  items: ServiceItem[];
}
