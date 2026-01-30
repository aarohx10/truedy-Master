'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { queryClient } from '@/lib/api'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/components/auth/auth-provider'
import { AuthErrorBoundary } from '@/components/auth/auth-error-boundary'
import { env } from '@/lib/env'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl={env.CLERK_SIGN_IN_FALLBACK_REDIRECT_URL ?? '/dashboard'}
      signInForceRedirectUrl={env.CLERK_SIGN_IN_FORCE_REDIRECT_URL ?? '/dashboard'}
      signUpFallbackRedirectUrl={env.CLERK_SIGN_UP_FALLBACK_REDIRECT_URL ?? '/select-org'}
      signUpForceRedirectUrl={env.CLERK_SIGN_UP_FORCE_REDIRECT_URL ?? '/select-org'}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
        >
          <AuthProvider>
            <AuthErrorBoundary>
              {children}
            </AuthErrorBoundary>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  )
}

