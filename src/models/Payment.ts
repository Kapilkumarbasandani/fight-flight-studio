import { ObjectId } from 'mongodb';

export interface PaymentResponse {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  credits: number;
  packName: string;
  paymentMethod: string;
  status: 'pending' | 'submitted' | 'verified' | 'rejected';
  transactionId?: string;
  upiId?: string;
  screenshot?: string;
  createdAt: Date;
  submittedAt?: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
  notes?: string;
}

export interface Payment extends Omit<PaymentResponse, '_id'> {
  _id?: ObjectId;
}

export interface PaymentInitiateRequest {
  userId: string;
  amount: number;
  credits: number;
  packName: string;
  paymentMethod: string;
}

export interface PaymentSubmitRequest {
  paymentId: string;
  transactionId: string;
  upiId?: string;
  screenshot?: string;
}

export interface PaymentVerifyRequest {
  action: 'verify' | 'reject';
  notes?: string;
}
