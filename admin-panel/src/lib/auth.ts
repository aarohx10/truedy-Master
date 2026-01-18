import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || ''
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || ''

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
  if (username !== ADMIN_USERNAME) {
    return { success: false, error: 'Invalid credentials' }
  }

  if (!ADMIN_PASSWORD_HASH) {
    return { success: false, error: 'Admin password not configured' }
  }

  const isValid = await verifyPassword(password, ADMIN_PASSWORD_HASH)
  if (!isValid) {
    return { success: false, error: 'Invalid credentials' }
  }

  const token = generateToken(username)
  return { success: true, token }
}
