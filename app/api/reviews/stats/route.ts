import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const business = await prisma.business.findFirst({ where: { userId: session.user.id } })
  if (!business) return NextResponse.json({ stats: null, reviews: [], monthly: [] })

  const reviews = await prisma.review.findMany({ where: { businessId: business.id } })

  const totalReviews = reviews.length
  const avgRating = totalReviews > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / totalReviews
    : 0

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  const thisMonthReviews = reviews.filter(r => r.publishedAt >= startOfMonth).length

  const replied = reviews.filter(r => r.replied).length
  const responseRate = totalReviews > 0 ? Math.round((replied / totalReviews) * 100) : 0
  const pendingReplies = reviews.filter(r => !r.replied).length

  // Monthly trend (last 6 months)
  const monthly = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const start = new Date(d.getFullYear(), d.getMonth(), 1)
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0)
    const monthReviews = reviews.filter(r => r.publishedAt >= start && r.publishedAt <= end)
    monthly.push({
      month: d.toLocaleDateString('ar-SA', { month: 'short' }),
      avgRating: monthReviews.length > 0
        ? Math.round((monthReviews.reduce((s, r) => s + r.rating, 0) / monthReviews.length) * 10) / 10
        : 0,
      count: monthReviews.length,
    })
  }

  const recentReviews = await prisma.review.findMany({
    where: { businessId: business.id },
    orderBy: { publishedAt: 'desc' },
    take: 10,
  })

  return NextResponse.json({
    stats: { totalReviews, avgRating: Math.round(avgRating * 10) / 10, thisMonthReviews, responseRate, pendingReplies },
    monthly,
    reviews: recentReviews,
    business: { name: business.name, niche: business.niche },
  })
}
