# Backend Organization-Scoping Fixes (clerk_org_id)

This document summarizes the flow-check fixes applied so that **all create/list/update/delete operations** use `clerk_org_id` correctly: saved on create and used for filtering on list/get/update/delete.

## 1. Core: `z-backend/app/core/database.py`

- **`get_voice(voice_id, org_id)`**  
  When `effective_org_id` is set, the filter now includes `clerk_org_id`, so voices are scoped by org.
- **`get_campaign(campaign_id, org_id)`**  
  Same: filter includes `clerk_org_id` when `effective_org_id` is set.
- **`get_call(call_id, org_id)`**  
  Same: filter includes `clerk_org_id` when `effective_org_id` is set.

## 2. Agents

- **`agents/create.py`**  
  After create, fetch uses `select_one("agents", {"id": agent_id, "clerk_org_id": clerk_org_id})`.

## 3. Contacts

- **`contacts/list_contact_folders.py`**  
  - Log messages: `client_id` → `clerk_org_id` (fixes undefined variable).  
  - Removed fallback that selected all folders (`select("contact_folders", None, ...)`).  
  - Contact count: `count("contacts", {"folder_id": folder_id, "clerk_org_id": clerk_org_id})`.
- **`contacts/add_contact_to_folder.py`**  
  Folder lookup: `select_one("contact_folders", {"id": folder_id, "clerk_org_id": clerk_org_id})`.
- **`contacts/list_contacts_by_folder.py`**  
  - Folder checks: `select_one("contact_folders", {"id": folder_id, "clerk_org_id": clerk_org_id})` and same for per-contact folder info.  
  - List already used `filter_dict = {"clerk_org_id": clerk_org_id, ...}`.
- **`contacts/create_contact_folder.py`**  
  Contact count: `count("contacts", {"folder_id": folder_id, "clerk_org_id": clerk_org_id})`.  
  Insert already included `clerk_org_id`.

## 4. Voices

- **`voices.py`**  
  - Get: `db.get_voice(voice_id, org_id=clerk_org_id)` (and preview).  
  - Update: `db.update("voices", {"id": voice_id, "clerk_org_id": clerk_org_id}, update_data)` and fetch with `get_voice(..., org_id=clerk_org_id)`.  
  - Delete: `db.delete("voices", {"id": voice_id, "clerk_org_id": clerk_org_id})`.
- **`voice_clone.py`**  
  - Require `clerk_org_id` from `current_user`; raise if missing.  
  - `DatabaseService(token=..., org_id=clerk_org_id)`.  
  - Insert: `voice_record` includes `"clerk_org_id": clerk_org_id`.

## 5. Calls

- **`calls.py`**  
  - All `db.get_call(call_id)` → `db.get_call(call_id, org_id=clerk_org_id)`.  
  - All `db.update("calls", {"id": call_id}, ...)` → `db.update("calls", {"id": call_id, "clerk_org_id": clerk_org_id}, ...)`.  
  - All `db.delete("calls", {"id": call_id})` → `db.delete("calls", {"id": call_id, "clerk_org_id": clerk_org_id})`.  
  - Agent lookup when creating call: `select_one("agents", {"id": call_data.agent_id, "clerk_org_id": clerk_org_id})`.

## 6. Knowledge bases

- **`knowledge_bases.py`**  
  After create: `select_one("knowledge_bases", {"id": kb_id, "clerk_org_id": clerk_org_id})`.  
  Get/update/delete already used `clerk_org_id` in filters.

## 7. Campaigns

- **campaigns.py**: All `db.update("campaigns", ...)` and `db.delete("campaigns", ...)` now use `{"id": campaign_id, "clerk_org_id": clerk_org_id}` (or `campaign["id"]` with `clerk_org_id`) in the filter (schedule, rollback, list reconciliation, get reconciliation, update_campaign, pause, resume, bulk delete, delete).

## 8. Auth (API keys)

- **auth.py**: `db.delete("api_keys", {"id": api_key_id, "client_id": current_user["client_id"]})` so deletion is org-scoped.

## 9. Webhooks

- **`webhooks.py`**  
  - Update: `db.update("webhook_endpoints", {"id": webhook_id, "clerk_org_id": clerk_org_id}, update_data)`.  
  - Delete: `db.delete("webhook_endpoints", {"id": webhook_id, "clerk_org_id": clerk_org_id})`.  
  List/get/create already used `clerk_org_id`.

## Summary

- **Create**: All relevant inserts already set `clerk_org_id`; voice_clone was the only one missing and is fixed.  
- **List**: Contact folders, contacts, voices, calls, tools, knowledge bases, webhooks already filter by `clerk_org_id`; list_contact_folders had a bug (undefined `client_id`, unsafe fallback) and count filter fixed.  
- **Get / Update / Delete**: All single-record reads/updates/deletes for agents, contacts, contact_folders, voices, calls, knowledge_bases, webhooks now include `clerk_org_id` in the filter (or use `get_voice`/`get_call`/`get_campaign` with `org_id`).  
- **Database helpers**: `get_voice`, `get_campaign`, and `get_call` in `database.py` now add `clerk_org_id` to the filter when `org_id` context is set.

Together with migration `024_add_missing_clerk_org_id_columns.sql` (adding `clerk_org_id` where missing and optional backfill), the backend is aligned with organization-first scoping for the entities above.
