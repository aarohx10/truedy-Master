# Organization Flow Fixes — Summary

## What was broken

1. **Redirect loop** — Middleware required an active org and redirected to `/select-org` when `orgId` was null. After creating/selecting an org, Clerk’s session cookie wasn’t always updated before the next request, so middleware sent the user back to `/select-org` again.
2. **Invite screen** — Using Clerk’s `<CreateOrganization>` component showed an “Invite members” step with a Skip button that didn’t work reliably. Replaced with programmatic `createOrganization()` + `setActive()` so there is no invite step.
3. **AuthProvider auto-create** — Auto-created an org but didn’t call `setActive()`, so the new org wasn’t active and the user still saw “no org”. It could also race with the select-org create form. Auto-create was removed; org creation happens only on `/select-org`.

## Changes made

### 1. Middleware (`frontend/src/middleware.ts`)

- **Before:** If `userId` and no `orgId`, redirect to `/select-org`.
- **After:** Only require authentication. No org check in middleware.
- **Reason:** Session/cookie can lag after `setActive()`, which caused the redirect loop. “No org” is handled client-side instead.

### 2. AppLayout (`frontend/src/components/layout/app-layout.tsx`)

- **Added:** Client-side check: if user is signed in, org is loaded, and there is no active organization (and we’re not already on `/select-org`), call `router.replace('/select-org?redirect=...')`.
- **Added:** While redirecting (signed in, no org), show “Redirecting to workspace selection...” instead of the dashboard.
- **Reason:** Ensures users without an org are sent to select-org without using middleware, so no loop.

### 3. AuthProvider (`frontend/src/components/auth/auth-provider.tsx`)

- **Removed:** Automatic workspace creation when user had no org.
- **Reason:** Avoids races with the select-org create form and avoids creating an org without calling `setActive()`. All org creation is explicit on `/select-org`.

### 4. Select-org page (`frontend/src/app/select-org/page.tsx`)

- **Kept:** Programmatic create (form with workspace name) and `createOrganization()` + `setActive()` + redirect. No Clerk invite screen.
- **Adjusted:** Shorter redirect delays (400–500 ms) and simplified useEffect so “already has org” redirect runs once with a 400 ms delay.
- **Reason:** Stable create flow and redirect without loops.

## Current flow

1. User without org goes to `/dashboard` (or any dashboard route).
2. Middleware allows the request (user is signed in).
3. AppLayout runs; sees no org → `router.replace('/select-org?redirect=/dashboard')`.
4. User is on `/select-org`: can pick an existing org or create one (name only, no invite step).
5. On create: `createOrganization({ name })` → `setActive({ organization: newOrg.id })` → short delay → `window.location.replace(redirectUrl)`.
6. On select: `setActive({ organization: orgId })` → short delay → `window.location.replace(redirectUrl)`.
7. Next load is `/dashboard` with org in Clerk state; AppLayout no longer redirects; dashboard renders.

## Backend / DB sync (unchanged)

- Backend reads `clerk_org_id` from the JWT and uses it for all org-scoped APIs.
- Frontend sends only the Bearer token (no `x-client-id`).
- Database: run migration `024_add_missing_clerk_org_id_columns.sql` if `clerk_org_id` (and `created_by_user_id` on `calls`) are missing on campaigns, contact_folders, contacts, knowledge_bases, webhook_endpoints, and calls.
