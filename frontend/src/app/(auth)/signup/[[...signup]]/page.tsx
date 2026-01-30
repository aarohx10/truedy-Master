'use client'

import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  // Do NOT auto-create an organization on signup. That was creating extra orgs
  // (e.g. one from user's name "Aaroh jain" and duplicates). After signup we
  // send the user to /select-org where they explicitly create ONE org with the
  // name they choose (e.g. "Sendora").
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp 
        routing="path"
        path="/signup"
        signInUrl="/signin"
        fallbackRedirectUrl="/select-org"
        forceRedirectUrl="/select-org"
      />
    </div>
  )
}
