'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { useOrganization, OrganizationProfile } from '@clerk/nextjs'
import { Users } from 'lucide-react'

export default function TeamPage() {
  const { organization } = useOrganization()

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Team</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage team members and their access levels
          </p>
        </div>

        {!organization ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No organization found
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center max-w-md">
              An organization will be created when you use the organization switcher in the sidebar to create one.
            </p>
          </div>
        ) : (
          <div className="w-full">
            <OrganizationProfile
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border border-gray-200 dark:border-gray-900 rounded-lg bg-white dark:bg-black",
                  navbar: "border-r border-gray-200 dark:border-gray-900",
                  page: "w-full",
                  scrollBox: "overflow-y-auto",
                  contentBox: "w-full",
                  sidebar: "min-w-[240px] border-r border-gray-200 dark:border-gray-900",
                  main: "flex-1",
                  organizationProfile: "w-full",
                  organizationProfilePage: "w-full",
                  pageScrollBox: "w-full",
                  formButtonPrimary: "bg-primary hover:bg-primary/90 text-white",
                },
              }}
              routing="hash"
            >
              <OrganizationProfile.Page
                label="Members"
                labelIcon={<Users className="h-4 w-4" />}
                url="members"
              />
            </OrganizationProfile>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
