const resendApiKey = process.env.RESEND_API_KEY || ''

// Get the "from" email - use verified domain if set, otherwise use test domain
function getFromEmail(): string {
  const customFrom = process.env.RESEND_FROM_EMAIL
  if (customFrom) {
    return customFrom
  }
  // Use verified domain: support.closi.tech
  return 'Trudy Admin <admin@support.closi.tech>'
}

export async function sendOTPEmail(email: string, otpCode: string): Promise<{ success: boolean; error?: string; data?: any }> {
  if (!resendApiKey) {
    const error = 'RESEND_API_KEY is not configured. Add it to Vercel environment variables.'
    console.error('[EMAIL]', error)
    return { success: false, error }
  }

  const fromEmail = getFromEmail()

  try {
    const payload = {
      from: fromEmail,
      to: [email],
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
      reply_to: fromEmail.includes('@resend.dev') ? 'onboarding@resend.dev' : fromEmail.split('<')[1]?.split('>')[0] || 'admin@support.closi.tech',
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok) {
      let error = result.message || `Resend API error: ${response.status}`
      
      if (result.message?.includes('testing emails') || result.message?.includes('verify a domain')) {
        error = `Resend test domain limitation: ${result.message}. To fix: 1) Verify your domain at resend.com/domains, 2) Set RESEND_FROM_EMAIL in Vercel to use your verified domain, 3) Redeploy.`
      }
      
      console.error('[EMAIL] Failed to send email:', error)
      return { 
        success: false, 
        error,
        data: result
      }
    }

    return { 
      success: true,
      data: result
    }
  } catch (error: any) {
    const rawError = error instanceof Error ? error : new Error(String(error))
    console.error('[ADMIN] [EMAIL] Exception sending email (RAW ERROR)', {
      error: rawError,
      errorMessage: rawError.message,
      errorStack: rawError.stack,
      errorName: rawError.name,
      errorCause: (rawError as any).cause,
      fullErrorObject: JSON.stringify(rawError, Object.getOwnPropertyNames(rawError), 2),
      to: email,
    })
    return { 
      success: false, 
      error: error?.message || 'Network error sending email'
    }
  }
}
