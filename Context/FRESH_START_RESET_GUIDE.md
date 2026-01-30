# Fresh Start: Do You Need to Wipe Users?

## Short answer

- **Existing users can keep working** if:
  1. They have an **organization** in Clerk (and `clerk_org_id` is in the JWT).
  2. You run the **backfill** in migration `024` (the commented `UPDATE ... SET clerk_org_id = ...` blocks) so existing Supabase rows get `clerk_org_id` from `client_id` / `clients.clerk_organization_id`.

- **You only need a full wipe** if you want a guaranteed clean slate: new signups only, no old data, and no backfill. That’s what the steps below do.

So: **no, you don’t have to remove all users** for things to work. But **yes, if you want “from scratch” and “everything perfect for new signups,”** you can delete everyone and all their data as described below.

---

## When to do a full reset

Do a full reset when you want:

- Only new signups (no existing users).
- No legacy data (no old `client_id`-only rows, no mixed state).
- A single, clear path: sign up → create/select org → use app with `clerk_org_id` everywhere.

---

## Part 1: Delete all users and data in Clerk

Clerk holds **users** and **organizations**. Your app uses `clerk_org_id` (org ID) in the JWT. For a full reset you should remove both users and organizations.

### Option A: Clerk Dashboard (manual)

1. **Organizations**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com) → your application.
   - **Organizations** → delete each organization (or use “Delete organization” for each).
   - If your plan has no “Organizations” section, skip or use API below.

2. **Users**
   - **Users** → open each user → **Delete user** (or use bulk delete if available).
   - Repeat until no users remain.

### Option B: Clerk API (scriptable)

You can call Clerk’s APIs to list and delete organizations and users. **Do not run any commands yourself** unless you decide to; below is the logic you’d use.

- **List organizations:** `GET https://api.clerk.com/v1/organizations`  
  (use your Clerk **secret key** in `Authorization: Bearer <secret_key>`).
- **Delete organization:** `DELETE https://api.clerk.com/v1/organizations/:id`
- **List users:** `GET https://api.clerk.com/v1/users` (paginate with `limit` and `offset`).
- **Delete user:** `DELETE https://api.clerk.com/v1/users/:id`

Delete all organizations first, then all users. Keep your **Clerk secret key** only in env / secrets, never in the repo.

### After Clerk wipe

- New signups will create new Clerk users.
- When you use “create organization” and “set active org” in your app, new users will get `clerk_org_id` in the JWT and everything will align with the backend’s org-scoped logic.

---

## Part 2: Wipe all user/org data in Supabase

This removes every row that belongs to tenants (users, clients, agents, calls, etc.) so the app is “empty” and ready for new signups. **It does not drop tables or change schema.**

### Before you run the SQL

1. **Backup** if you might need current data (Supabase dashboard → Database → Backups, or `pg_dump`).
2. **Confirm environment**: run only against the project (e.g. dev) you intend to reset.
3. Apply **migration 024** if you haven’t already (adds missing `clerk_org_id` / columns). The wipe script only deletes data; it doesn’t depend on 024, but your app does.

### How to run the wipe

1. Open **Supabase Dashboard** → your project → **SQL Editor**.
2. Copy the contents of **`z-backend/database/scripts/wipe_all_user_data.sql`** (see below).
3. Paste into a new query and run it.

The script uses `TRUNCATE ... RESTART IDENTITY CASCADE` so that:

- All listed tables are emptied.
- Rows in other tables that reference them are also truncated (CASCADE).
- Sequences (e.g. IDs) restart so the next insert gets clean IDs.

### Tables that get wiped

- **Auth/tenant:** `users`, `clients`
- **Org-scoped data:** `agents`, `calls`, `campaigns`, `campaign_contacts`, `contact_folders`, `contacts`, `knowledge_bases`, `tools`, `voices`, `webhook_endpoints`, `api_keys`, `idempotency_keys`
- **Supporting:** `webhook_deliveries`, `tool_logs`, `application_logs`, `audit_log`, `credit_transactions`, `agent_assistance_messages`, `agent_assistance_sessions`, `phone_numbers`, `telephony_credentials`
- **Other:** `admin_otps`, `webhook_logs`

### Tables that are not wiped (on purpose)

- **`subscription_tiers`** – product/config, not tenant data.
- **`agent_templates`** – global templates.
- Any **Supabase Auth** tables (e.g. `auth.users`) – managed by Supabase; your app uses Clerk, so you don’t need to wipe these for a “Clerk + Supabase data” fresh start.

---

## Part 3: After the reset

1. **Clerk**: New users sign up; they create or select an org; JWT contains `clerk_org_id`.
2. **Backend**: On first login, your webhook or auth flow creates a **client** and **user** in Supabase (with `clerk_organization_id` / `clerk_org_id`), and new resources (agents, contacts, etc.) get `clerk_org_id` from the token.
3. **Frontend**: User goes through `/select-org`, creates/selects org, and is redirected into the app.

Result: **new signups only, everything from scratch, with org logic applied consistently.**

---

## Summary

| Question | Answer |
|----------|--------|
| Do you **have** to remove all users for things to work? | **No.** Existing users can work if you backfill `clerk_org_id` and they use an org in Clerk. |
| Can you **choose** to remove everyone for a clean slate? | **Yes.** Wipe Clerk (users + orgs) and run the Supabase wipe script. |
| How to delete all users and data? | **Clerk:** Dashboard or API (delete orgs, then users). **Supabase:** Run `wipe_all_user_data.sql` in SQL Editor. |

If you want “create from scratch, user can sign up, everything is going to be perfect,” use the full reset path above; otherwise, keep existing users and use the backfill in migration 024.
