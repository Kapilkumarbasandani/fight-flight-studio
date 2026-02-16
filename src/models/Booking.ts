export interface Booking {
  _id?: string;
  userId: string;
  classId: string;
  className: string;
  classType: string;
  instructor: string;
  date: string;
  time: string;
  status: 'confirmed' | 'waitlist' | 'cancelled';
  creditsUsed: number;
  createdAt: Date;
  attended?: boolean;
}

export interface BookingResponse {
  _id: string;
  userId: string;
  classId: string;
  className: string;
  classType: string;
  instructor: string;
  date: string;
  time: string;
  status: 'confirmed' | 'waitlist' | 'cancelled';
  creditsUsed: number;
  createdAt: string;
  attended?: boolean;
}
