import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/signin(.*)',
  '/signup(.*)',
  '/login(.*)', // Legacy login route redirects to signin
  '/api/webhooks(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Only protect non-public routes
  if (!isPublicRoute(req)) {
    // Protect the route - Clerk will handle redirect if not authenticated
    await auth().protect()
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