import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric', month: 'short', day: 'numeric'
  }).format(new Date(date))
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const d = new Date(date)
  const diff = now.getTime() - d.getTime()
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (hours < 1) return 'منذ قليل'
  if (hours < 24) return `منذ ${hours} ساعة`
  if (days < 7) return `منذ ${days} يوم`
  return formatDate(date)
}

export function getRatingColor(rating: number): string {
  if (rating >= 5) return 'rating-5'
  if (rating >= 4) return 'rating-4'
  if (rating === 3) return 'rating-3'
  if (rating === 2) return 'rating-2'
  return 'rating-1'
}

export function getRatingLabel(rating: number): string {
  if (rating >= 5) return 'ممتاز'
  if (rating >= 4) return 'جيد جداً'
  if (rating === 3) return 'متوسط'
  if (rating === 2) return 'ضعيف'
  return 'سيء'
}

export function formatPhone(phone: string): string {
  return phone.replace(/\s/g, '').replace(/^00/, '+').replace(/^0/, '+966')
}

export function generateReviewLink(placeId: string): string {
  return `https://search.google.com/local/writereview?placeid=${placeId}`
}
