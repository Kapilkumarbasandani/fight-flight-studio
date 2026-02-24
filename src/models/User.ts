export interface User {
  _id?: string;
  name: string;
  email: string;
  whatsapp: string;
  password: string;
  createdAt: Date;
  profile?: {
    name?: string;
    phone?: string;
    address?: string;
    birthday?: string;
    gender?: 'male' | 'female' | 'other';
  };
  membership?: {
    type: 'drop-in' | 'flex-5' | 'unlimited';
    startDate?: Date;
    endDate?: Date;
    creditsRemaining?: number;
  };
  credits?: {
    balance: number;
    expiringCredits: Array<{
      amount: number;
      expiryDate: Date;
    }>;
  };
  stats?: {
    totalClasses: number;
    muayThaiClasses: number;
    aerialClasses: number;
    strength: number;
    agility: number;
    endurance: number;
    flexibility: number;
  };
  hero?: {
    level: number;
    levelName: string;
    achievements: string[];
  };
  formsCompleted?: string[];
  role?: 'user' | 'admin';
}

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  whatsapp: string;
  createdAt: Date;
  profile?: {
    name?: string;
    phone?: string;
    address?: string;
    birthday?: string;
    gender?: 'male' | 'female' | 'other';
  };
  membership?: {
    type: string;
    startDate?: Date;
    endDate?: Date;
    creditsRemaining?: number;
  };
  credits?: {
    balance: number;
    expiringCredits: Array<{
      amount: number;
      expiryDate: Date;
    }>;
  };
  stats?: {
    totalClasses: number;
    muayThaiClasses: number;
    aerialClasses: number;
    strength: number;
    agility: number;
    endurance: number;
    flexibility: number;
  };
  hero?: {
    level: number;
    levelName: string;
    achievements: string[];
  };
  formsCompleted?: string[];
  role?: string;
}
