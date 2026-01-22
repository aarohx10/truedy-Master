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
 * Verify OTP code with atomic update to prevent race conditions
 */
export async function verifyOTP(email: string, otpCode: string): Promise<{ success: boolean; error?: string }> {
  try {
    const normalizedEmail = email.toLowerCase().trim()
    const normalizedOTP = otpCode.trim()
    const now = new Date().toISOString()

    if (process.env.NODE_ENV === 'development') {
      console.log('[OTP VERIFY] Verifying OTP for:', normalizedEmail)
    }

    // Atomic update: Mark OTP as used only if it's unused and not expired
    // This prevents race conditions when user clicks multiple times
    const { data: updatedRows, error: updateError } = await supabaseAdmin
      .from('admin_otps')
      .update({ used: true })
      .eq('email', normalizedEmail)
      .eq('otp_code', normalizedOTP)
      .eq('used', false)
      .gt('expires_at', now)
      .select('id')

    if (updateError) {
      console.error('Error verifying OTP:', updateError)
      return { success: false, error: 'Database error verifying OTP' }
    }

    // If rows were updated, OTP is valid
    if (updatedRows && updatedRows.length > 0) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[OTP VERIFY] OTP verified successfully')
      }
      return { success: true }
    }

    // No rows updated - check why
    // Check if OTP exists but is expired
    const { data: expiredData } = await supabaseAdmin
      .from('admin_otps')
      .select('id, expires_at, used')
      .eq('email', normalizedEmail)
      .eq('otp_code', normalizedOTP)
      .limit(1)
      .maybeSingle()

    if (expiredData) {
      if (expiredData.used) {
        return { success: false, error: 'OTP code has already been used' }
      }
      if (new Date(expiredData.expires_at) <= new Date(now)) {
        return { success: false, error: 'OTP code has expired. Please request a new one.' }
      }
    }

    return { success: false, error: 'Invalid OTP code' }
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
