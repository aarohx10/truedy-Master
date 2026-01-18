import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY || ''

if (!resendApiKey) {
  console.warn('RESEND_API_KEY not configured. Email functionality will be disabled.')
}

const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function sendOTPEmail(email: string, otpCode: string): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const { error } = await resend.emails.send({
      from: 'Trudy Admin <admin@truedy.ai>', // Update with your verified domain
      to: email,
      subject: 'Your Admin Login Code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Trudy Admin Panel</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
              <h2 style="color: #111827; margin-top: 0;">Your Login Code</h2>
              <p style="color: #6b7280; font-size: 16px;">Use this code to complete your admin login:</p>
              <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea; font-family: 'Courier New', monospace;">
                  ${otpCode}
                </div>
              </div>
              <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
                This code will expire in <strong>5 minutes</strong>.
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
                If you didn't request this code, please ignore this email.
              </p>
            </div>
          </body>
        </html>
      `,
      text: `Your Trudy Admin login code is: ${otpCode}\n\nThis code will expire in 5 minutes.\n\nIf you didn't request this code, please ignore this email.`,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message || 'Failed to send email' }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error sending OTP email:', error)
    return { success: false, error: error.message || 'Failed to send email' }
  }
}
