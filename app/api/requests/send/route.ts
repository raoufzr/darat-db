import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { sendWhatsAppReviewRequest } from '@/lib/twilio'
import { formatPhone, generateReviewLink } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { phone, name, businessId } = await req.json()

    if (!phone?.trim()) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    const business = await prisma.business.findFirst({
      where: { userId: session.user.id },
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const formattedPhone = formatPhone(phone)
    const reviewLink = generateReviewLink(business.googlePlaceId || '')

    // Check plan - WhatsApp requires pro+
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (user?.plan === 'free' || user?.plan === 'basic') {
      return NextResponse.json({
        error: 'WhatsApp requests require Pro plan or higher',
        upgradeRequired: true,
      }, { status: 403 })
    }

    const success = await sendWhatsAppReviewRequest(
      formattedPhone,
      name || '',
      business.name,
      reviewLink
    )

    if (!success) {
      return NextResponse.json({ error: 'Failed to send WhatsApp message' }, { status: 502 })
    }

    // Save request record
    await prisma.reviewRequest.create({
      data: {
        businessId: business.id,
        customerPhone: formattedPhone,
        customerName: name || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Send WhatsApp error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// GET - fetch request history
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const business = await prisma.business.findFirst({ where: { userId: session.user.id } })
  if (!business) return NextResponse.json({ requests: [] })

  const requests = await prisma.reviewRequest.findMany({
    where: { businessId: business.id },
    orderBy: { sentAt: 'desc' },
    take: 50,
  })

  return NextResponse.json({ requests })
}
