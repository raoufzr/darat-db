import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      plan: string
    } & DefaultSession['user']
  }
}

export interface ReviewWithBusiness {
  id: string
  googleReviewId: string
  authorName: string
  rating: number
  text: string | null
  publishedAt: Date
  replied: boolean
  replyText: string | null
  repliedAt: Date | null
  aiGenerated: boolean
  businessId: string
  business: {
    name: string
    niche: string
  }
}

export interface StatsData {
  totalReviews: number
  avgRating: number
  thisMonthReviews: number
  responseRate: number
  pendingReplies: number
}

export interface MonthlyData {
  month: string
  avgRating: number
  count: number
}

export type Niche = 'dentist' | 'salon' | 'spa' | 'restaurant'

export const NICHE_LABELS: Record<Niche, string> = {
  dentist: 'عيادة أسنان',
  salon: 'صالون تجميل',
  spa: 'سبا ومساج',
  restaurant: 'مطعم وكافيه',
}

export const NICHE_ICONS: Record<Niche, string> = {
  dentist: '🦷',
  salon: '💇',
  spa: '🧖',
  restaurant: '🍽️',
}

export type Plan = 'free' | 'basic' | 'pro' | 'multi'

export const PLAN_LABELS: Record<Plan, string> = {
  free: 'مجاني',
  basic: 'أساسي',
  pro: 'احترافي',
  multi: 'متعدد الفروع',
}

export const PLAN_PRICES: Record<Plan, number> = {
  free: 0,
  basic: 29,
  pro: 49,
  multi: 99,
}
