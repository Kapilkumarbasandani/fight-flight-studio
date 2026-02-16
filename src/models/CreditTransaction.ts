export interface CreditTransaction {
  _id?: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  balanceAfter: number;
  createdAt: Date;
  expiryDate?: Date;
  invoiceUrl?: string;
  orderId?: string;
  paymentId?: string;
}

export interface CreditTransactionResponse {
  _id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  balanceAfter: number;
  createdAt: string;
  expiryDate?: string;
  invoiceUrl?: string;
  orderId?: string;
  paymentId?: string;
}

export interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  perClass: number;
  popular: boolean;
  validityDays: number;
}
