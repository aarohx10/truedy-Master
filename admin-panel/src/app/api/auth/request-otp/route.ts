import { NextRequest, NextResponse } from 'next/server'
import { generateOTP, storeOTP } from '@/lib/otp'
import { sendOTPEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Generate OTP
    const otpCode = generateOTP()

    // Store OTP in database
    const storeResult = await storeOTP(normalizedEmail, otpCode)
    if (!storeResult.success) {
      console.error('[OTP] Failed to store OTP:', storeResult.error)
      return NextResponse.json(
        { error: 'Failed to generate OTP. Please try again.' },
        { status: 500 }
      )
    }

    // Send email
    const emailResult = await sendOTPEmail(normalizedEmail, otpCode)

    if (!emailResult.success) {
      console.error('[OTP] Failed to send email:', emailResult.error)
      return NextResponse.json(
        { 
          error: emailResult.error || 'Failed to send email. Check RESEND_API_KEY in Vercel.',
          details: emailResult.data
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'OTP code sent to your email' 
    })
  } catch (error: any) {
    console.error('[OTP] Exception:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
