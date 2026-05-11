import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey || stripeKey.includes('placeholder')) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(stripeKey, { apiVersion: '2024-10-28.acacia' as any })

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: any
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const { userId, plan } = session.metadata
      if (userId && plan) {
        await prisma.user.update({ where: { id: userId }, data: { plan } })
      }
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object
      const customer = await stripe.customers.retrieve(sub.customer as string)
      if ('email' in customer && customer.email) {
        await prisma.user.updateMany({
          where: { email: customer.email },
          data: { plan: 'free' },
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
