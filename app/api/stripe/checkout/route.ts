import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

const PRICE_IDS: Record<string, string> = {
  basic: process.env.STRIPE_PRICE_BASIC || '',
  pro: process.env.STRIPE_PRICE_PRO || '',
  multi: process.env.STRIPE_PRICE_MULTI || '',
}

export async function POST(req: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey || stripeKey.includes('placeholder')) {
      return NextResponse.json({ error: 'Payments not configured' }, { status: 503 })
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan } = await req.json()
    if (!PRICE_IDS[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-10-28.acacia' as any })

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email ?? undefined,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
      metadata: { userId: session.user.id, plan },
      locale: 'auto',
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
