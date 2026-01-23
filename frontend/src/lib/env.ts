/**
 * Environment Variable Validation and Type-Safe Access
 * Validates required environment variables at runtime
 */

const requiredEnvVars = {
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
} as const

const optionalEnvVars = {
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/signin',
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || '/signup',
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || '/dashboard',
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || '/dashboard',
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
} as const

/**
 * Validate required environment variables
 * Throws error with clear message if any are missing
 */
export function validateEnvVars() {
  if (typeof window !== 'undefined') {
    // Client-side: only validate public vars
    const missing: string[] = []
    
    if (!requiredEnvVars.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      missing.push('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY')
    }
    
    if (!requiredEnvVars.NEXT_PUBLIC_API_URL) {
      missing.push('NEXT_PUBLIC_API_URL')
    }
    
    if (missing.length > 0) {
      console.error('Missing required environment variables:', missing.join(', '))
      // Don't throw in client - just log error
    }
    
    return
  }
  
  // Server-side: validate all required vars
  const missing: string[] = []
  
  if (!requiredEnvVars.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    missing.push('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY')
  }
  
  if (!requiredEnvVars.CLERK_SECRET_KEY) {
    missing.push('CLERK_SECRET_KEY')
  }
  
  if (!requiredEnvVars.NEXT_PUBLIC_API_URL) {
    missing.push('NEXT_PUBLIC_API_URL')
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please set these in your Vercel project settings or .env.local file.'
    )
  }
}

/**
 * Type-safe environment variable access
 */
export const env = {
  NEXT_PUBLIC_ENABLE_DEBUG_LOGGING: process.env.NEXT_PUBLIC_ENABLE_DEBUG_LOGGING || "true",
  // Required
  CLERK_PUBLISHABLE_KEY: requiredEnvVars.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
  CLERK_SECRET_KEY: requiredEnvVars.CLERK_SECRET_KEY || '',
  API_URL: requiredEnvVars.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  
  // Optional
  CLERK_SIGN_IN_URL: optionalEnvVars.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  CLERK_SIGN_UP_URL: optionalEnvVars.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  CLERK_AFTER_SIGN_IN_URL: optionalEnvVars.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
  CLERK_AFTER_SIGN_UP_URL: optionalEnvVars.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
  STRIPE_PUBLISHABLE_KEY: optionalEnvVars.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY: optionalEnvVars.STRIPE_SECRET_KEY,
} as const

// Validate on module load (server-side only)
if (typeof window === 'undefined') {
  try {
    validateEnvVars()
  } catch (error) {
    const rawError = error instanceof Error ? error : new Error(String(error))
    console.error('[ENV] Environment validation failed (RAW ERROR)', {
      error: rawError,
      errorMessage: rawError.message,
      errorStack: rawError.stack,
      errorName: rawError.name,
      fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
    })
    // Don't throw during build - let it continue
  }
}

