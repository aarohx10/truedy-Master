import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/signin(.*)',
  '/signup(.*)',
  '/login(.*)', // Legacy login route redirects to signin
  '/api/webhooks(.*)',
  '/select-org(.*)', // Allow access to org selection page
])

export default clerkMiddleware(async (auth, req) => {
  // Only protect non-public routes
  if (!isPublicRoute(req)) {
    // Protect the route - Clerk will handle redirect if not authenticated
    await auth().protect()
    // Do NOT redirect to /select-org here when orgId is null.
    // Clerk's session cookie can lag after setActive(), causing a redirect loop.
    // "No org" is handled client-side in AppLayout (redirect to /select-org).
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
    // Always run for API routes (except webhooks which are public)
    '/(api|trpc)(.*)',
  ],
}