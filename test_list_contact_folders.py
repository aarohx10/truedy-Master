"""
Test script for debugging contact folders listing issue
Tests direct database access and API endpoint
"""
import asyncio
import sys
import os
from supabase import create_client, Client
from typing import List, Dict, Any
import json

# Fix Windows encoding issues
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Configuration
SUPABASE_URL = "https://vixvkphbowjoujtpvoxe.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpeHZrcGhib3dqb3VqdHB2b3hlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjMzNzc5OSwiZXhwIjoyMDc3OTEzNzk5fQ.9-Pl-I2Q3pk5lNpE6j2N1Lkn7-PL4TT9dTnQ0kW7IwY"
CLIENT_ID = "451c2455-dbe8-4ab7-9827-d7e73fdf430a"

def print_section(title: str):
    """Print a formatted section header"""
    print("\n" + "=" * 80)
    print(f"  {title}")
    print("=" * 80 + "\n")

def test_direct_database_query():
    """Test 1: Direct database query using service role key"""
    print_section("TEST 1: Direct Database Query (Service Role Key)")
    
    try:
        # Create Supabase client with service role key (bypasses RLS)
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        
        print(f"[OK] Supabase client created")
        print(f"  URL: {SUPABASE_URL}")
        print(f"  Client ID: {CLIENT_ID}\n")
        
        # Query contact_folders table
        print("Querying contact_folders table...")
        response = supabase.table("contact_folders").select("*").eq("client_id", CLIENT_ID).execute()
        
        folders = response.data if response.data else []
        
        print(f"[OK] Query executed successfully")
        print(f"  Found {len(folders)} folder(s)\n")
        
        if folders:
            print("Folders found:")
            for i, folder in enumerate(folders, 1):
                print(f"\n  Folder {i}:")
                print(f"    ID: {folder.get('id')}")
                print(f"    Name: {folder.get('name')}")
                print(f"    Description: {folder.get('description')}")
                print(f"    Client ID: {folder.get('client_id')}")
                print(f"    Created At: {folder.get('created_at')}")
                print(f"    Updated At: {folder.get('updated_at')}")
        else:
            print("[WARNING] No folders found for this client_id")
            print("\n  Checking if ANY folders exist in the table...")
            
            # Check if table has any data at all
            all_folders_response = supabase.table("contact_folders").select("*").limit(10).execute()
            all_folders = all_folders_response.data if all_folders_response.data else []
            
            if all_folders:
                print(f"  Found {len(all_folders)} folder(s) in table (not filtered by client_id):")
                for folder in all_folders:
                    print(f"    - ID: {folder.get('id')}, Name: {folder.get('name')}, Client ID: {folder.get('client_id')}")
            else:
                print("  [WARNING] No folders exist in the table at all")
        
        return folders
        
    except Exception as e:
        print(f"[ERROR] {type(e).__name__}: {str(e)}")
        import traceback
        print("\nFull traceback:")
        traceback.print_exc()
        return []

def test_contact_counts(folders: List[Dict[str, Any]]):
    """Test 2: Get contact counts for each folder"""
    print_section("TEST 2: Contact Counts for Each Folder")
    
    if not folders:
        print("⚠ No folders to count contacts for")
        return
    
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        
        for folder in folders:
            folder_id = folder.get('id')
            print(f"\nCounting contacts for folder: {folder.get('name')} (ID: {folder_id})")
            
            # Count contacts
            response = supabase.table("contacts").select("*", count="exact").eq("folder_id", folder_id).execute()
            count = response.count if hasattr(response, 'count') else (len(response.data) if response.data else 0)
            
            print(f"  ✓ Contact count: {count}")
            
            if count > 0:
                print(f"  Sample contacts:")
                for contact in (response.data[:3] if response.data else []):
                    print(f"    - {contact.get('first_name')} {contact.get('last_name')} ({contact.get('email')})")
    
    except Exception as e:
        print(f"[ERROR] {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()

def test_table_structure():
    """Test 3: Check table structure and RLS status"""
    print_section("TEST 3: Table Structure Check")
    
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        
        # Try to get one record to check structure
        print("Checking contact_folders table structure...")
        response = supabase.table("contact_folders").select("*").limit(1).execute()
        
        if response.data and len(response.data) > 0:
            sample = response.data[0]
            print(f"✓ Table structure (sample record):")
            for key in sample.keys():
                print(f"  - {key}: {type(sample[key]).__name__}")
        else:
            print("⚠ No records to infer structure from")
        
        # Check if we can query without filters (RLS test)
        print("\nTesting RLS by querying without client_id filter...")
        try:
            all_response = supabase.table("contact_folders").select("*").limit(5).execute()
            print(f"✓ Can query without filters (RLS likely disabled or using service role)")
        except Exception as e:
            print(f"✗ RLS might be blocking: {str(e)}")
    
    except Exception as e:
        print(f"[ERROR] {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()

def test_client_exists():
    """Test 4: Verify client exists"""
    print_section("TEST 4: Verify Client Exists")
    
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        
        print(f"Checking if client {CLIENT_ID} exists...")
        response = supabase.table("clients").select("*").eq("id", CLIENT_ID).execute()
        
        if response.data and len(response.data) > 0:
            client = response.data[0]
            print(f"✓ Client found:")
            print(f"  ID: {client.get('id')}")
            print(f"  Name: {client.get('name', 'N/A')}")
            print(f"  Clerk Org ID: {client.get('clerk_organization_id', 'N/A')}")
        else:
            print(f"✗ Client {CLIENT_ID} not found in database")
    
    except Exception as e:
        print(f"[ERROR] {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()

def main():
    """Run all tests"""
    print("\n" + "=" * 80)
    print("CONTACT FOLDERS LISTING DEBUG TEST")
    print("=" * 80)
    
    # Test 1: Direct database query
    folders = test_direct_database_query()
    
    # Test 2: Contact counts
    test_contact_counts(folders)
    
    # Test 3: Table structure
    test_table_structure()
    
    # Test 4: Client exists
    test_client_exists()
    
    # Summary
    print_section("SUMMARY")
    if folders:
        print(f"[OK] Found {len(folders)} folder(s) for client {CLIENT_ID}")
        print("\nThe database query works correctly.")
        print("If the API endpoint still fails, the issue is likely in:")
        print("  1. The endpoint code (DatabaseAdminService usage)")
        print("  2. Query parameter handling")
        print("  3. Response formatting")
    else:
        print(f"[ERROR] No folders found for client {CLIENT_ID}")
        print("\nPossible issues:")
        print("  1. Folders were created with a different client_id")
        print("  2. RLS is blocking the query (but service role should bypass)")
        print("  3. Folders don't exist in the database")
    
    print("\n" + "=" * 80)
    print("Test completed!")
    print("=" * 80 + "\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n[FATAL ERROR] {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
