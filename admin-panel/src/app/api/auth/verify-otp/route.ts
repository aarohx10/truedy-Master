import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/otp'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp } = body

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

    // Verify email matches admin username
    const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME || ''
    const normalizedEmail = email.toLowerCase().trim()

    if (adminEmail && normalizedEmail !== adminEmail.toLowerCase().trim()) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const username = process.env.ADMIN_USERNAME || 'admin'
    const token = generateToken(username)

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
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
