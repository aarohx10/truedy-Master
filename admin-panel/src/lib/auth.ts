import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || ''
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || ''

// Validate JWT_SECRET at module load
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('ERROR: JWT_SECRET is not configured. Authentication will fail.')
}

export interface AdminUser {
  username: string
  iat?: number
  exp?: number
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export function generateToken(username: string): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }
  return jwt.sign(
    { username },
    JWT_SECRET,
    { expiresIn: '1h' }
  )
}

export function verifyToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser
    return decoded
  } catch (error) {
    return null
  }
}

export async function login(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  // Check username first
  if (username !== ADMIN_USERNAME) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AUTH] Username mismatch. Expected: "${ADMIN_USERNAME}", Got: "${username}"`)
    }
    return { success: false, error: 'Invalid credentials' }
  }

  // Check if password hash is configured
  if (!ADMIN_PASSWORD_HASH) {
    console.error('[AUTH] ADMIN_PASSWORD_HASH is not configured in environment variables')
    return { success: false, error: 'Admin password not configured' }
  }

  // Verify password against hash
  const isValid = await verifyPassword(password, ADMIN_PASSWORD_HASH)
  if (!isValid) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[AUTH] Password verification failed')
    }
    return { success: false, error: 'Invalid credentials' }
  }

  // Generate token
  const token = generateToken(username)
  return { success: true, token }
}
