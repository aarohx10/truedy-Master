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

    // Get client_id from request body (will be set by frontend from useAuthClient)
    const clientId = null // Client ID should come from request body or be fetched from API

    // Check Stripe secret key
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { amount, currency = 'usd', client_id: bodyClientId } = body

    // Use client_id from request body first, then fall back to session
    const finalClientId = bodyClientId || clientId

    if (!finalClientId) {
      return NextResponse.json(
        { error: 'Client ID not found in session or request' },
        { status: 400 }
      )
    }

    if (!amount || amount < 500) {
      return NextResponse.json(
        { error: 'Amount must be at least $5.00' },
        { status: 400 }
      )
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        client_id: finalClientId,
        user_id: userId || '',
        org_id: orgId || '',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

