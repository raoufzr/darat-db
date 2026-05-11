import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { generateReply } from '@/lib/claude'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { reviewId, reviewText, authorName, rating, generateOnly } = await req.json()

    // Get business info for context
    const business = await prisma.business.findFirst({
      where: { userId: session.user.id },
    })

    const businessName = business?.name || 'نشاطنا التجاري'
    const niche = business?.niche || 'restaurant'

    // Generate reply with Claude
    const reply = await generateReply(reviewText || '', authorName, rating, businessName, niche)

    // If just generating (not posting), return the reply
    if (generateOnly) {
      return NextResponse.json({ reply })
    }

    // Save to DB and mark as replied
    if (reviewId && reviewId !== 'demo') {
      await prisma.review.update({
        where: { id: reviewId },
        data: {
          replied: true,
          replyText: reply,
          repliedAt: new Date(),
          aiGenerated: true,
        },
      })
    }

    return NextResponse.json({ reply, success: true })
  } catch (error: any) {
    console.error('Reply error:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate reply' }, { status: 500 })
  }
}
