'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { queryClient } from '@/lib/api'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/components/auth/auth-provider'
import { AuthErrorBoundary } from '@/components/auth/auth-error-boundary'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
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

