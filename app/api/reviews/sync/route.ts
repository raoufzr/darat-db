import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const business = await prisma.business.findFirst({
      where: { userId: session.user.id },
    })

    if (!business) {
      return NextResponse.json({ error: 'No business found. Please set up your business profile first.' }, { status: 404 })
    }

    if (!business.googlePlaceId || !business.googleToken) {
      return NextResponse.json({
        error: 'Google Business not connected. Please connect your Google Business Profile in Settings.',
        code: 'NOT_CONNECTED'
      }, { status: 400 })
    }

    // Fetch reviews from Google My Business API
    const response = await fetch(
      `https://mybusiness.googleapis.com/v4/accounts/-/locations/${business.googlePlaceId}/reviews`,
      {
        headers: { Authorization: `Bearer ${business.googleToken}` },
      }
    )

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch from Google' }, { status: 502 })
    }

    const data = await response.json()
    const reviews = data.reviews || []

    let synced = 0
    for (const review of reviews) {
      await prisma.review.upsert({
        where: { googleReviewId: review.reviewId },
        update: {
          replied: !!review.reviewReply,
          replyText: review.reviewReply?.comment || null,
        },
        create: {
          businessId: business.id,
          googleReviewId: review.reviewId,
          authorName: review.reviewer?.displayName || 'مجهول',
          rating: parseInt(review.starRating?.replace('STAR_RATING_', '').replace('FIVE', '5').replace('FOUR', '4').replace('THREE', '3').replace('TWO', '2').replace('ONE', '1') || '3'),
          text: review.comment || null,
          publishedAt: new Date(review.createTime),
          replied: !!review.reviewReply,
          replyText: review.reviewReply?.comment || null,
        },
      })
      synced++
    }

    return NextResponse.json({ synced, total: reviews.length })
  } catch (error: any) {
    console.error('Sync error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// GET - fetch reviews from DB
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const filter = searchParams.get('filter')

  const business = await prisma.business.findFirst({ where: { userId: session.user.id } })
  if (!business) return NextResponse.json({ reviews: [] })

  const where: any = { businessId: business.id }
  if (filter === 'pending') where.replied = false
  if (filter === 'replied') where.replied = true
  if (filter === 'negative') where.rating = { lte: 3 }

  const reviews = await prisma.review.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
    take: 50,
  })

  return NextResponse.json({ reviews })
}
