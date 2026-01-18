-- ============================================
-- Admin Panel OTP Verification - Supabase Schema
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- Location: Supabase Dashboard → SQL Editor → New Query
-- ============================================

-- Step 1: Create admin_otps table
CREATE TABLE IF NOT EXISTS admin_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Step 2: Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_admin_otps_email ON admin_otps(email);
CREATE INDEX IF NOT EXISTS idx_admin_otps_code ON admin_otps(otp_code);
CREATE INDEX IF NOT EXISTS idx_admin_otps_expires ON admin_otps(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_otps_email_expires ON admin_otps(email, expires_at);

-- Step 3: Enable Row Level Security
ALTER TABLE admin_otps ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policy for service role (allows backend to access)
CREATE POLICY "Service role full access to admin_otps"
  ON admin_otps FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Step 5: Create cleanup function for expired OTPs
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM admin_otps
  WHERE expires_at < now() OR used = true;
END;
$$;

-- ============================================
-- Verification
-- ============================================
-- After running, verify the table exists:
-- SELECT * FROM admin_otps LIMIT 1;

-- Test the cleanup function:
-- SELECT cleanup_expired_otps();

-- ============================================
-- Optional: Schedule automatic cleanup (requires pg_cron extension)
-- ============================================
-- If you have pg_cron installed, uncomment this to run cleanup every hour:
-- SELECT cron.schedule(
--   'cleanup-admin-otps',
--   '0 * * * *',
--   'SELECT cleanup_expired_otps();'
-- );
