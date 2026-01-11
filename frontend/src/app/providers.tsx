'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { queryClient } from '@/lib/api'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/components/auth/auth-provider'

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
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  )
}

