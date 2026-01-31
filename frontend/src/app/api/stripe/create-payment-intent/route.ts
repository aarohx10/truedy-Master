import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Stripe from 'stripe'

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user from Clerk
    const { userId, orgId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check Stripe secret key
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { amount, currency = 'usd', org_id: bodyOrgId } = body

    // Use org_id from request body (organization-first approach)
    const finalOrgId = bodyOrgId || orgId

    if (!finalOrgId) {
      return NextResponse.json(
        { error: 'Organization ID not found in session or request' },
        { status: 400 }
      )
    }

    if (!amount || amount < 500) {
      return NextResponse.json(
        { error: 'Amount must be at least $5.00' },
        { status: 400 }
      )
    }

    // Create payment intent with Stripe - CRITICAL: Use org_id for organization-first billing
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        org_id: finalOrgId,  // CRITICAL: Organization ID (primary)
        user_id: userId || '',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error: any) {
    const rawError = error instanceof Error ? error : new Error(String(error))
    console.error('[STRIPE_PAYMENT_INTENT] Error creating payment intent (RAW ERROR)', {
      userId,
      orgId,
      error: rawError,
      errorMessage: rawError.message,
      errorStack: rawError.stack,
      errorName: rawError.name,
      errorCode: (error as any).code,
      errorType: (error as any).type,
      fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
    })
    return NextResponse.json(
      { error: rawError.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

