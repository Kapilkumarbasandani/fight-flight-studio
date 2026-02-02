// Mock data types for the booking system
export interface Class {
  id: string
  title: string
  discipline: 'muay-thai' | 'aerial'
  instructor: 'Shaleena' | 'Tinsley'
  date: string
  time: string
  duration: number
  credits: number
  spotsAvailable: number
  level: 'beginner' | 'intermediate' | 'advanced' | 'all-levels'
}

export interface User {
  id: string
  name: string
  email: string
  credits: number
  creditsExpiring: { amount: number; date: string }[]
}

export interface Booking {
  id: string
  userId: string
  classId: string
  classTitle: string
  date: string
  time: string
  credits: number
  status: 'confirmed' | 'cancelled'
}
