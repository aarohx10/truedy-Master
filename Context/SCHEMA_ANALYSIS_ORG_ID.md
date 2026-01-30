# Database Schema Analysis — Organization ID (clerk_org_id) Readiness

This document compares your **actual Supabase schema** (from your SQL query) with what the **organization-first refactor** expects. It identifies missing columns and required migrations.

---

## Summary: What’s Correct vs What’s Missing

| Table | Expected column(s) | In your Supabase? | Status |
|-------|--------------------|-------------------|--------|
| **agents** | `clerk_org_id` | ✅ Yes | OK |
| **calls** | `clerk_org_id`, `created_by_user_id` | ✅ clerk_org_id only | ⚠️ Missing `created_by_user_id` |
| **campaigns** | `clerk_org_id` | ❌ No | ❌ Missing |
| **contact_folders** | `clerk_org_id` | ❌ No | ❌ Missing |
| **contacts** | `clerk_org_id` | ❌ No | ❌ Missing |
| **knowledge_bases** | `clerk_org_id` | ❌ No | ❌ Missing |
| **tools** | `clerk_org_id` | ✅ Yes | OK |
| **voices** | `clerk_org_id` | ✅ Yes | OK |
| **webhook_endpoints** | `clerk_org_id` | ❌ No | ❌ Missing |

**Conclusion:** Migrations **022** and **023** were either not run on this Supabase project or only partially applied. Several tables that the backend already filters by `clerk_org_id` do **not** have that column in the live database. That will cause queries to fail or return wrong data until the missing columns are added.

---

## Detailed Comparison

### 1. Tables that already have `clerk_org_id` (correct)

- **agents** — `clerk_org_id` present. Backend filters by it. ✅  
- **calls** — `clerk_org_id` present. Backend filters by it. ✅  
- **tools** — `clerk_org_id` present. Backend filters by it. ✅  
- **voices** — `clerk_org_id` present. Backend filters by it. ✅  

### 2. Tables missing `clerk_org_id` (must fix)

- **campaigns**  
  - Your schema: `id, client_id, agent_id, name, ...` — **no** `clerk_org_id`.  
  - Backend: Uses `clerk_org_id` for list/get/create/update/delete.  
  - **Action:** Add `clerk_org_id TEXT` (and index).

- **contact_folders**  
  - Your schema: `id, client_id, name, description, ...` — **no** `clerk_org_id`.  
  - Backend: Uses `clerk_org_id` for folder CRUD and imports.  
  - **Action:** Add `clerk_org_id TEXT` (and index).

- **contacts**  
  - Your schema: `id, client_id, folder_id, ...` — **no** `clerk_org_id`.  
  - Backend: Uses `clerk_org_id` for contact CRUD and imports.  
  - **Action:** Add `clerk_org_id TEXT` (and index).

- **knowledge_bases**  
  - Your schema: `id, client_id, name, description, ...` — **no** `clerk_org_id`.  
  - Backend: Uses `clerk_org_id` for KB list/create and content lookup.  
  - **Action:** Add `clerk_org_id TEXT` (and index).

- **webhook_endpoints**  
  - Your schema: `id, client_id, url, event_types, ...` — **no** `clerk_org_id`.  
  - Backend: Uses `clerk_org_id` for webhook CRUD and egress.  
  - **Action:** Add `clerk_org_id TEXT` (and index).

### 3. Missing column on `calls`

- **calls**  
  - Your schema: has `clerk_org_id` but **no** `created_by_user_id`.  
  - Migration 022 adds `created_by_user_id TEXT` to record which user started the call.  
  - **Action:** Add `created_by_user_id TEXT` (and index if desired).

---

## Other tables (no change needed for org scoping)

- **clients** — Has `clerk_organization_id`; used for org ↔ client mapping. No change.  
- **users** — Scoped by `client_id`; org inferred via client. No change.  
- **api_keys** — Scoped by `client_id`; optional `clerk_org_id` in `settings` JSONB. No new column required.  
- **application_logs**, **audit_log**, **credit_transactions**, **idempotency_keys** — Still client-scoped; no `clerk_org_id` expected.  
- **phone_numbers**, **telephony_credentials** — Use `organization_id` (Clerk org); naming differs but purpose is correct.  
- **agent_assistance_sessions** — Has `client_id`; not yet org-scoped in code; optional future change.  
- **campaign_contacts**, **tool_logs**, **webhook_deliveries**, **webhook_logs**, **agent_templates**, **subscription_tiers**, **admin_otps**, **agent_assistance_messages**, **data polling test** — No `clerk_org_id` required for current org-first behavior.

---

## Required migrations

1. **Apply missing parts of 022 and 023**  
   Add the following in your Supabase SQL editor (or as a new migration file):

   - `campaigns`: add `clerk_org_id TEXT`, index on `clerk_org_id`.  
   - `contact_folders`: add `clerk_org_id TEXT`, index on `clerk_org_id`.  
   - `contacts`: add `clerk_org_id TEXT`, index on `clerk_org_id`.  
   - `knowledge_bases`: add `clerk_org_id TEXT`, index on `clerk_org_id`.  
   - `webhook_endpoints`: add `clerk_org_id TEXT`, index on `clerk_org_id`.  
   - `calls`: add `created_by_user_id TEXT`, index on `created_by_user_id` (optional but useful).

2. **Backfill (optional but recommended)**  
   After adding columns, backfill existing rows so that:
   - `clerk_org_id` = value derived from the row’s `client_id` (e.g. from `clients.clerk_organization_id` where `clients.id = <table>.client_id`).  
   - `calls.created_by_user_id` = leave NULL for old rows, or set from existing audit/log data if you have it.

3. **Code**  
   No code changes are needed for “do we have the right columns?” — the backend already expects these columns. The only blocker is that the database does not yet have them on the five tables listed above and is missing `created_by_user_id` on `calls`.

---

## Next step

Run the migration script provided in **`024_add_missing_clerk_org_id_columns.sql`** (see repo). It uses `ADD COLUMN IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS`, so it is safe to run even if some columns already exist. After that, run the optional backfill if you need existing data to be queryable by `clerk_org_id`.
