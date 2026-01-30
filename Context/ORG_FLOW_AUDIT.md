# Organization flow – full audit (skeptical review)

This document is a **skeptical, end-to-end** audit of: new user signup → create/select organization → org ID in Clerk and DB → switching organizations → inviting members → creating resources (agents, contacts, etc.) with correct org scoping. It also lists what was checked, what was fixed, and what you should verify in your environment.

---

## 1. New user signup and organization creation

### Clerk

- User signs up in Clerk (email/social). Clerk creates the **user**; no org yet.
- User is sent to `/select-org` (no active org → redirect from `AppLayout`).
- On `/select-org`, user can:
  - **Create organization**: `createOrganization({ name })` → org is created **in Clerk**.
  - **Select existing org**: `setActive({ organization: orgId })` → session gets that org.

So: **Organization is always created in Clerk first.** No change needed there.

### Backend sync (Clerk → Supabase)

Two ways the **client** (tenant) row gets created and linked to the org:

1. **Clerk webhook `organization.created`**  
   - When an org is created in Clerk, the webhook runs.  
   - Backend creates a row in `clients` with `clerk_organization_id = clerk_org_id`.  
   - Backend calls `sync_client_id_to_org_metadata(clerk_org_id, client_id)` so Clerk org `public_metadata.client_id` is set.  
   - File: `z-backend/app/api/v1/webhooks/clerk.py` → `handle_organization_created`.

2. **First call to `/auth/me`**  
   - If the webhook hasn’t run yet (or failed), the first time the user hits the app they call `/auth/me`.  
   - Backend reads `clerk_org_id` from the JWT, looks up `clients` by `clerk_organization_id`, or **creates** a client with that `clerk_organization_id` if missing.  
   - Then it creates the **user** row (if missing) with that `client_id` and syncs `client_id` to Clerk org metadata.  
   - File: `z-backend/app/api/v1/auth.py` → `get_me`.

So: **Organization ID is stored in Supabase** either via webhook or via `/auth/me`. The `clients` table has `clerk_organization_id`; that’s the source of truth for “this client = this Clerk org”.

### JWT and `clerk_org_id`

- Clerk puts the **active organization ID** in the session token as `org_id` (or equivalent).  
- Backend auth: `verify_clerk_jwt` reads `org_id` from claims and sets `_effective_org_id`. If there is no org (e.g. personal workspace), it falls back to `user_id` so there is always an effective org-like scope.  
- `get_current_user` exposes this as `clerk_org_id` and, after the fix, sets `client_id` from the **user** row in the DB (so legacy code and auth endpoints that still use `client_id` keep working).

So: **Every request that has an active org gets the correct `clerk_org_id` (and `client_id` once the user row exists).**

---

## 2. Switching organizations

- User uses Clerk’s **Organization Switcher** in the sidebar.  
- Frontend calls Clerk’s `setActive({ organization: orgId })`. Clerk updates the session; the **next** JWT will have the new `org_id`.  
- Sidebar is configured to do a **hard refresh** on org switch so the app reloads and all API calls use the new token.  
- Backend does **not** store “current org” server-side; it always uses the JWT’s `org_id` → `clerk_org_id`. So switching org = switching token = all list/create/update/delete use the new org.

So: **Switching organizations is correct as long as the frontend refreshes after `setActive`** (which it does).

---

## 3. Inviting members

- Admin invites a member in Clerk (e.g. Organization → Members → Invite).  
- When the invite is accepted, Clerk sends **`organizationMembership.created`**.  
- Backend handler expects the org to already have `public_metadata.client_id` (set by `organization.created` or `/auth/me`). It looks up that `client_id`, verifies it exists in `clients` for that `clerk_org_id`, then creates/updates the **user** row with that `client_id`.  
- So the new member gets the **same** `client_id` (same org) and, when they use that org, their JWT has the same `org_id` → same `clerk_org_id` → same data scope.

So: **Invited members are correctly tied to the same organization and same Supabase client.**

---

## 4. Creating and listing resources (agents, contacts, tools, etc.)

- All create endpoints that were audited use `clerk_org_id` from `current_user` and:
  - pass `org_id=clerk_org_id` into `DatabaseService`, and/or  
  - include `clerk_org_id` in insert payloads and in filters for select/update/delete.  
- List endpoints filter by `clerk_org_id` (or use `get_voice` / `get_call` / `get_campaign` with `org_id`).  
- So: **Any resource created while an org is active is stored with that org’s ID and only that org can see/update/delete it.**

Details are in `Context/ORG_SCOPING_BACKEND_FIXES.md`.

---

## 5. What was fixed in this audit

1. **`get_current_user` (backend)**  
   - Before: `result["client_id"] = None` for everyone.  
   - After: `result["client_id"] = user_data.get("client_id") if user_data else None`.  
   - So legacy fields (e.g. `agent_record["client_id"]`) and auth endpoints (`/clients`, `/users`, `/api-keys`) get a valid `client_id` once the user row exists (created by `/auth/me`).

2. **Frontend terminology**  
   - All user-facing “workspace” copy was changed to **“organization”** on:
     - `/select-org` (title, descriptions, labels, buttons, placeholders, error message).
     - `AppLayout` (redirect message and default workspace name when syncing from Clerk).

So: **Organization ID is created in Clerk, mirrored to Supabase via webhook or `/auth/me`, and used consistently for scoping; switching and invites work; wording is “organization” everywhere in the flows we touched.**

---

## 6. What you should verify in your environment

- **Clerk webhook**  
  - Your Clerk app has a webhook pointing to your backend’s `POST /api/v1/webhooks/clerk` (or equivalent).  
  - Events subscribed: at least `organization.created`, `organizationMembership.created` (and updated/deleted if you use them).  
  - `CLERK_WEBHOOK_SECRET` in the backend matches Clerk’s webhook secret.

- **Clerk JWT**  
  - In Clerk Dashboard, ensure the session token template includes the **active organization ID** (e.g. `org_id`, `org_id` in claims). Our backend reads `org_id` and uses it as `clerk_org_id`.

- **Database**  
  - Migration **024** is applied so all required tables have `clerk_org_id` (and `calls` has `created_by_user_id` if used).  
  - If you have existing data, run the **backfill** (commented block in 024) so existing rows get `clerk_org_id` from `client_id` / `clients.clerk_organization_id`.

- **First-time user**  
  - Frontend should call **`/auth/me`** early (e.g. in auth provider or layout) so the user (and client, if webhook didn’t run) are created before they create agents, etc. Otherwise `client_id` in `get_current_user` can be `None` for that first request.

- **RLS (if enabled)**  
  - If Supabase RLS is on, policies must align with `clerk_org_id` (or the same logic you use in the app). We did not change RLS in this audit; if you use RLS, review policies so they don’t block or leak by `client_id` only.

---

## 7. Summary table

| Scenario | Clerk | Backend / DB | Status |
|----------|--------|---------------|--------|
| New user creates org | Org created in Clerk; user calls `setActive` | Client created by webhook or `/auth/me` with `clerk_organization_id`; user created with `client_id` | OK (with fixes above) |
| New user selects existing org | `setActive({ organization })` | JWT has `org_id`; `/auth/me` resolves/creates user and client | OK |
| Switch organization | Organization Switcher → `setActive`; frontend refreshes | Next request uses new JWT → new `clerk_org_id` | OK |
| Invite member | Clerk invite → membership created | Webhook uses org metadata `client_id`; user created/updated with that client | OK |
| Create agent/contact/tool/… | — | Endpoints use `clerk_org_id` from JWT; insert/filter by `clerk_org_id` | OK (see ORG_SCOPING_BACKEND_FIXES.md) |
| List/update/delete by org | — | Filters use `clerk_org_id` (or org-scoped helpers) | OK |

So: **Yes – with the current design and the fixes above, a new user can sign up, create an organization (in Clerk), have that organization ID saved correctly in the database (via webhook or `/auth/me`), switch organizations, invite members, and have all create/list/update/delete use the correct organization ID.** The only caveats are environment checks (webhook, JWT claims, migration 024, backfill, and calling `/auth/me` early).
