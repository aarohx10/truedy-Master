import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/otp'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  let email: string | undefined
  try {
    const body = await request.json()
    email = body?.email
    const otp = body?.otp

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP code are required' },
        { status: 400 }
      )
    }

    // Verify OTP
    const verifyResult = await verifyOTP(email, otp)

    if (!verifyResult.success) {
      return NextResponse.json(
        { error: verifyResult.error || 'Invalid or expired OTP code' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const username = process.env.ADMIN_USERNAME || 'admin'
    let token: string
    try {
      token = generateToken(username)
    } catch (error: any) {
      const rawError = error instanceof Error ? error : new Error(String(error))
      console.error('[ADMIN] [VERIFY_OTP] Error generating token (RAW ERROR)', {
        error: rawError,
        errorMessage: rawError.message,
        errorStack: rawError.stack,
        errorName: rawError.name,
        errorCause: (rawError as any).cause,
        fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
        email: email || 'not provided',
      })
      return NextResponse.json(
        { error: 'Authentication configuration error' },
        { status: 500 }
      )
    }

    // Set HTTP-only cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    })

    return response
  } catch (error: any) {
    const rawError = error instanceof Error ? error : new Error(String(error))
    console.error('[ADMIN] [VERIFY_OTP] Verify OTP error (RAW ERROR)', {
      error: rawError,
      errorMessage: rawError.message,
      errorStack: rawError.stack,
      errorName: rawError.name,
      errorCause: (rawError as any).cause,
      fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      email: email || 'not provided',
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
