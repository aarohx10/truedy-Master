-- Migration: Add Admin OTP Verification Table
-- Purpose: Store OTP codes for admin login verification

-- Create admin_otps table
CREATE TABLE IF NOT EXISTS admin_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_admin_otps_email ON admin_otps(email);
CREATE INDEX IF NOT EXISTS idx_admin_otps_code ON admin_otps(otp_code);
CREATE INDEX IF NOT EXISTS idx_admin_otps_expires ON admin_otps(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_otps_email_expires ON admin_otps(email, expires_at);

-- Add RLS policies (optional - since this is admin-only, you might want to disable RLS)
ALTER TABLE admin_otps ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything (for backend operations)
CREATE POLICY "Service role full access to admin_otps"
  ON admin_otps FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Function to cleanup expired OTPs (older than 1 hour or already used)
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM admin_otps
  WHERE expires_at < now() OR used = true;
END;
$$;

-- Optional: Create a scheduled job to run cleanup (if using pg_cron extension)
-- Uncomment if you have pg_cron installed:
-- SELECT cron.schedule('cleanup-admin-otps', '0 * * * *', 'SELECT cleanup_expired_otps();');
