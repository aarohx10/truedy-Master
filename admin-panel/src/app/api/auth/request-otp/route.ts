import { NextRequest, NextResponse } from 'next/server'
import { generateOTP, storeOTP, checkOTPRateLimit } from '@/lib/otp'
import { sendOTPEmail } from '@/lib/email'

// Rate limiting for OTP requests (in-memory, should use Redis in production)
const requestAttempts = new Map<string, { count: number; resetAt: number }>()
const MAX_REQUESTS = 3
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

function getRateLimitKey(ip: string, email: string): string {
  return `otp_request:${ip}:${email.toLowerCase()}`
}

function checkRequestRateLimit(ip: string, email: string): boolean {
  const key = getRateLimitKey(ip, email)
  const now = Date.now()
  const record = requestAttempts.get(key)

  if (!record || now > record.resetAt) {
    requestAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }

  if (record.count >= MAX_REQUESTS) {
    return false
  }

  record.count++
  requestAttempts.set(key, record)
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'

    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check rate limit
    if (!checkRequestRateLimit(ip, normalizedEmail)) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please try again in 15 minutes.' },
        { status: 429 }
      )
    }

    // Check database rate limit
    const rateLimitCheck = await checkOTPRateLimit(normalizedEmail)
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: rateLimitCheck.error || 'Too many OTP requests' },
        { status: 429 }
      )
    }

    // Verify email matches admin username (optional - you can remove this if you want to allow any email)
    const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME || ''
    if (adminEmail && normalizedEmail !== adminEmail.toLowerCase().trim()) {
      // Don't reveal if email exists - return success anyway for security
      return NextResponse.json({ success: true, message: 'If this email is registered, you will receive an OTP code.' })
    }

    // Generate and store OTP
    const otpCode = generateOTP()
    const storeResult = await storeOTP(normalizedEmail, otpCode)

    if (!storeResult.success) {
      return NextResponse.json(
        { error: 'Failed to generate OTP. Please try again.' },
        { status: 500 }
      )
    }

    // Send OTP email
    const emailResult = await sendOTPEmail(normalizedEmail, otpCode)

    if (!emailResult.success) {
      console.error('Failed to send OTP email:', emailResult.error)
      // Still return success to avoid revealing if email exists
      return NextResponse.json({ 
        success: true, 
        message: 'If this email is registered, you will receive an OTP code.' 
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'OTP code sent to your email' 
    })
  } catch (error) {
    console.error('Request OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
