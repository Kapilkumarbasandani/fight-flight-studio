export interface Activity {
  _id?: string;
  userId: string;
  action: string;
  type: 'booking' | 'purchase' | 'class_completion' | 'achievement' | 'other';
  createdAt: Date;
  metadata?: any;
}

export interface ActivityResponse {
  _id: string;
  userId: string;
  action: string;
  type: 'booking' | 'purchase' | 'class_completion' | 'achievement' | 'other';
  createdAt: string;
  metadata?: any;
}
