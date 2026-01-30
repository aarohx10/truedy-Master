"""
Test the actual API endpoint to see what's happening
"""
import requests
import json
import sys
import os

# Configuration
API_BASE_URL = "https://truedy.sendorahq.com/api/v1"  # Update if different
CLIENT_ID = "451c2455-dbe8-4ab7-9827-d7e73fdf430a"

# You'll need to provide a valid Clerk token
# Get this from your browser's network tab when you make a request
CLERK_TOKEN = input("Enter your Clerk JWT token (from browser network tab): ").strip()

if not CLERK_TOKEN:
    print("Error: Clerk token is required")
    sys.exit(1)

def test_api_endpoint():
    """Test the actual API endpoint"""
    print("\n" + "=" * 80)
    print("TESTING API ENDPOINT: GET /contacts/list-folders")
    print("=" * 80 + "\n")
    
    url = f"{API_BASE_URL}/contacts/list-folders"
    headers = {
        "Authorization": f"Bearer {CLERK_TOKEN}",
        "X-Client-Id": CLIENT_ID,
        "Content-Type": "application/json"
    }
    
    print(f"URL: {url}")
    print(f"Headers: {json.dumps({k: v[:50] + '...' if len(v) > 50 else v for k, v in headers.items()}, indent=2)}")
    print("\nMaking request...\n")
    
    try:
        response = requests.get(url, headers=headers, timeout=30)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"\nResponse Body:")
        print(json.dumps(response.json(), indent=2, default=str))
        
        if response.status_code == 200:
            data = response.json()
            folders = data.get("data", [])
            print(f"\n[SUCCESS] Found {len(folders)} folder(s)")
            if folders:
                for folder in folders:
                    print(f"  - {folder.get('name')} (ID: {folder.get('id')})")
            else:
                print("[WARNING] No folders in response data")
        else:
            print(f"\n[ERROR] Request failed with status {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"\n[ERROR] Request failed: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
    except Exception as e:
        print(f"\n[ERROR] Unexpected error: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_api_endpoint()
