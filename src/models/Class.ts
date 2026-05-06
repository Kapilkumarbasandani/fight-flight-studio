export interface Class {
  _id?: string;
  name: string;
  type: 'muay-thai' | 'aerial' | 'yoga' | 'conditioning';
  instructor: string;
  day: string;
  time: string;
  duration: number; // in minutes
  capacity: number;
  bookedCount?: number; // Number of booked spots
  creditsRequired: number; // Credits needed to book
  description?: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  image?: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClassResponse extends Class {
  _id: string;
  bookedCount: number;
  createdAt: Date;
  updatedAt: Date;
}
