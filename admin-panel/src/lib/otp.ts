import { supabaseAdmin } from './supabase'

const OTP_EXPIRY_MINUTES = 5
const OTP_LENGTH = 6

/**
 * Generate a random 6-digit OTP code
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Store OTP in database
 */
export async function storeOTP(email: string, otpCode: string): Promise<{ success: boolean; error?: string }> {
  try {
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRY_MINUTES)

    const { error } = await supabaseAdmin
      .from('admin_otps')
      .insert({
        email: email.toLowerCase().trim(),
        otp_code: otpCode,
        expires_at: expiresAt.toISOString(),
        used: false,
      })

    if (error) {
      console.error('Error storing OTP:', error)
      return { success: false, error: 'Failed to store OTP' }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error storing OTP:', error)
    return { success: false, error: error.message || 'Failed to store OTP' }
  }
}

/**
 * Verify OTP code
 */
export async function verifyOTP(email: string, otpCode: string): Promise<{ success: boolean; error?: string }> {
  try {
    const normalizedEmail = email.toLowerCase().trim()

    // Find valid, unused OTP
    const { data, error } = await supabaseAdmin
      .from('admin_otps')
      .select('id, expires_at, used')
      .eq('email', normalizedEmail)
      .eq('otp_code', otpCode)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return { success: false, error: 'Invalid or expired OTP code' }
    }

    // Mark OTP as used
    await supabaseAdmin
      .from('admin_otps')
      .update({ used: true })
      .eq('id', data.id)

    return { success: true }
  } catch (error: any) {
    console.error('Error verifying OTP:', error)
    return { success: false, error: error.message || 'Failed to verify OTP' }
  }
}

/**
 * Check rate limit for OTP requests (max 3 per 15 minutes per email)
 */
export async function checkOTPRateLimit(email: string): Promise<{ allowed: boolean; error?: string }> {
  try {
    const normalizedEmail = email.toLowerCase().trim()
    const fifteenMinutesAgo = new Date()
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15)

    const { count, error } = await supabaseAdmin
      .from('admin_otps')
      .select('id', { count: 'exact', head: true })
      .eq('email', normalizedEmail)
      .gte('created_at', fifteenMinutesAgo.toISOString())

    if (error) {
      console.error('Error checking rate limit:', error)
      return { allowed: true } // Allow on error to avoid blocking legitimate users
    }

    if (count && count >= 3) {
      return { allowed: false, error: 'Too many OTP requests. Please try again in 15 minutes.' }
    }

    return { allowed: true }
  } catch (error: any) {
    console.error('Error checking rate limit:', error)
    return { allowed: true } // Allow on error
  }
}

/**
 * Cleanup expired OTPs (call this periodically)
 */
export async function cleanupExpiredOTPs(): Promise<void> {
  try {
    await supabaseAdmin.rpc('cleanup_expired_otps')
  } catch (error) {
    // If RPC doesn't exist, do manual cleanup
    const { error: deleteError } = await supabaseAdmin
      .from('admin_otps')
      .delete()
      .or(`expires_at.lt.${new Date().toISOString()},used.eq.true`)

    if (deleteError) {
      console.error('Error cleaning up OTPs:', deleteError)
    }
  }
}
