#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test script for voice cloning flow:
1. Clone voice to ElevenLabs
2. Import voice to Ultravox
"""
import asyncio
import httpx
import os
import sys
from pathlib import Path

# Set UTF-8 encoding for Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

# Hardcoded API keys for testing
ELEVENLABS_API_KEY = "sk_704d8650af9cb2de5a15ab2a90dc57609f436463503f1ed2"
ULTRAVOX_API_KEY = "GU42yLSQ.YmoVOP3JFOyx2VuXSlaNubfzi3q9yzzA"
ULTRAVOX_BASE_URL = "https://api.ultravox.ai"

# MP3 file path
MP3_FILE = "Sample Voice Note - Copy.mp3"
VOICE_NAME = "Test Voice Clone"


async def clone_to_elevenlabs(audio_file_path: str, voice_name: str) -> dict:
    """Clone voice to ElevenLabs and return voice_id"""
    print(f"Step 1: Cloning voice to ElevenLabs...")
    print(f"   File: {audio_file_path}")
    print(f"   Name: {voice_name}")
    
    # Read audio file
    with open(audio_file_path, "rb") as f:
        audio_bytes = f.read()
    
    print(f"   File size: {len(audio_bytes)} bytes")
    
    # Clone to ElevenLabs
    url = "https://api.elevenlabs.io/v1/voices/add"
    
    async with httpx.AsyncClient(timeout=120.0) as client:
        files = [("files", (os.path.basename(audio_file_path), audio_bytes, "audio/mpeg"))]
        data = {"name": voice_name}
        
        print(f"   Sending request to ElevenLabs...")
        response = await client.post(
            url,
            headers={"xi-api-key": ELEVENLABS_API_KEY},
            data=data,
            files=files,
        )
        
        if response.status_code >= 400:
            error_text = response.text[:500] if response.text else "No response body"
            print(f"   [ERROR] ElevenLabs error: {response.status_code}")
            print(f"   Error details: {error_text}")
            raise Exception(f"ElevenLabs clone failed: {error_text}")
        
        result = response.json()
        voice_id = result.get("voice_id")
        
        if not voice_id:
            print(f"   [ERROR] ElevenLabs response missing voice_id")
            print(f"   Full response: {result}")
            raise Exception("ElevenLabs response missing voice_id")
        
        print(f"   [OK] ElevenLabs clone successful!")
        print(f"   Voice ID: {voice_id}")
        return {"voice_id": voice_id, "full_response": result}


async def import_to_ultravox(
    voice_name: str,
    provider: str,
    provider_voice_id: str,
    description: str = None
) -> dict:
    """Import voice from provider to Ultravox"""
    print(f"\nStep 2: Importing voice to Ultravox...")
    print(f"   Provider: {provider}")
    print(f"   Provider Voice ID: {provider_voice_id}")
    print(f"   Name: {voice_name}")
    
    # Normalize name: lowercase, replace spaces with underscores
    normalized_name = voice_name.lower().replace(" ", "_").replace("-", "_")
    normalized_name = "".join(c if c.isalnum() or c == "_" else "" for c in normalized_name)
    
    # Append ElevenLabs voice ID to ensure unique names (prevents conflicts)
    # Format: name_elevenlabs_voice_id
    normalized_name = f"{normalized_name}_{provider_voice_id}"
    
    # Use correct Ultravox API endpoint and format
    url = f"{ULTRAVOX_BASE_URL}/api/voices"
    
    # Build provider-specific definition (per Ultravox API)
    payload = {
        "name": normalized_name,
    }
    
    if description:
        payload["description"] = description
    
    # Provider-specific definitions
    if provider == "elevenlabs":
        payload["definition"] = {
            "elevenLabs": {
                "voiceId": provider_voice_id,
                "model": "eleven_multilingual_v2",
                "stability": 0.5,
                "similarityBoost": 0.75,
                "style": 0.0,
                "useSpeakerBoost": True,
                "speed": 1.0,
            }
        }
    else:
        raise Exception(f"Unsupported provider: {provider}")
    
    headers = {
        "X-API-Key": ULTRAVOX_API_KEY,
        "Content-Type": "application/json",
    }
    
    print(f"   Normalized name (with voice ID): {normalized_name}")
    print(f"   Payload structure: name={normalized_name}, definition.elevenLabs.voiceId={provider_voice_id}")
    
    async with httpx.AsyncClient(timeout=120.0) as client:
        print(f"   Sending request to Ultravox...")
        response = await client.post(
            url,
            headers=headers,
            json=payload,
        )
        
        if response.status_code >= 400:
            error_text = response.text[:500] if response.text else "No response body"
            print(f"   [ERROR] Ultravox error: {response.status_code}")
            print(f"   Error details: {error_text}")
            try:
                error_json = response.json()
                print(f"   Error JSON: {error_json}")
            except:
                pass
            raise Exception(f"Ultravox import failed: {error_text}")
        
        result = response.json()
        
        # Extract voice ID from various possible fields
        ultravox_voice_id = (
            result.get("voiceId") or
            result.get("id") or
            result.get("voice_id") or
            (result.get("data", {}) if isinstance(result.get("data"), dict) else {}).get("voiceId") or
            (result.get("data", {}) if isinstance(result.get("data"), dict) else {}).get("id")
        )
        
        if not ultravox_voice_id:
            print(f"   [WARNING] Ultravox response structure:")
            print(f"   Keys: {list(result.keys()) if isinstance(result, dict) else 'not a dict'}")
            print(f"   Full response: {result}")
            raise Exception("Ultravox response missing voiceId")
        
        print(f"   [OK] Ultravox import successful!")
        print(f"   Ultravox Voice ID: {ultravox_voice_id}")
        return {"voice_id": ultravox_voice_id, "full_response": result}


async def main():
    """Main test function"""
    print("=" * 60)
    print("Voice Cloning Test Script")
    print("=" * 60)
    
    # Check if MP3 file exists
    mp3_path = Path(MP3_FILE)
    if not mp3_path.exists():
        print(f"[ERROR] MP3 file not found: {MP3_FILE}")
        print(f"   Current directory: {os.getcwd()}")
        print(f"   Looking for: {mp3_path.absolute()}")
        return
    
    print(f"\nFound MP3 file: {mp3_path.absolute()}")
    
    try:
        # Step 1: Clone to ElevenLabs
        elevenlabs_result = await clone_to_elevenlabs(str(mp3_path), VOICE_NAME)
        elevenlabs_voice_id = elevenlabs_result["voice_id"]
        
        # Step 2: Import to Ultravox
        ultravox_result = await import_to_ultravox(
            voice_name=VOICE_NAME,
            provider="elevenlabs",
            provider_voice_id=elevenlabs_voice_id,
            description=f"Test cloned voice: {VOICE_NAME}"
        )
        ultravox_voice_id = ultravox_result["voice_id"]
        
        # Summary
        print("\n" + "=" * 60)
        print("[SUCCESS] Voice cloning test completed")
        print("=" * 60)
        print(f"Summary:")
        print(f"   ElevenLabs Voice ID: {elevenlabs_voice_id}")
        print(f"   Ultravox Voice ID: {ultravox_voice_id}")
        print(f"   Voice Name: {VOICE_NAME}")
        print("\nAll steps completed successfully!")
        
    except Exception as e:
        print("\n" + "=" * 60)
        print("[ERROR] Test failed")
        print("=" * 60)
        print(f"Error: {str(e)}")
        import traceback
        print("\nFull traceback:")
        traceback.print_exc()
        return


if __name__ == "__main__":
    asyncio.run(main())
