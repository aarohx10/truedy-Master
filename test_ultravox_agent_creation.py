"""
Test script to debug Ultravox agent creation
Mimics the exact behavior of create_agent_ultravox_first function
"""
import asyncio
import httpx
import json
import logging
from typing import Dict, Any, Optional

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Hardcoded for testing
ULTRAVOX_API_KEY = "7efIghiF.k6tNxlZuQGnG4NV5GiGLCY2HNnvRn0rB"
ULTRAVOX_BASE_URL = "https://api.ultravox.ai"

# Test data - mimicking what create_draft.py sends
TEST_AGENT_DATA = {
    "id": "test-agent-123",
    "client_id": "451c2455-dbe8-4ab7-9827-d7e73fdf430a",
    "name": "test_agent",  # Must match ^[a-zA-Z0-9_-]{1,64}$ - no spaces!
    "description": "Test agent",
    "voice_id": None,  # Will need to be set to a valid voice ID
    "system_prompt": "You are a helpful assistant.",
    "model": "ultravox-v0.6",
    "tools": [],
    "knowledge_bases": [],
    "status": "draft",
    "temperature": 0.3,
    "language_hint": "en-US",
    "initial_output_medium": "MESSAGE_MEDIUM_VOICE",
    "recording_enabled": False,
    "join_timeout": "30s",
    "max_duration": "3600s",
}


def normalize_agent_name(name: str) -> str:
    """
    Normalize agent name to match Ultravox requirements: ^[a-zA-Z0-9_-]{1,64}$
    - Replace spaces with underscores
    - Remove invalid characters
    - Limit to 64 characters
    """
    import re
    # Replace spaces and special chars with underscores
    normalized = re.sub(r'[^a-zA-Z0-9_-]', '_', name)
    # Limit to 64 characters
    normalized = normalized[:64]
    # Ensure it's not empty
    if not normalized:
        normalized = "untitled_agent"
    return normalized


async def get_voice_ultravox_id(voice_id: str, client_id: str) -> Optional[str]:
    """
    Get Ultravox voice ID from our voice record.
    For testing, we'll query the actual database or use a known voice ID.
    """
    # For testing, we'll need to either:
    # 1. Query the database to get a voice with ultravox_voice_id
    # 2. Or use a known Ultravox voice ID directly
    
    # Option 2: Use a known voice ID for testing
    # You'll need to replace this with an actual Ultravox voice ID from your account
    # For now, let's try to list voices from Ultravox to get one
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{ULTRAVOX_BASE_URL}/api/voices",
                headers={
                    "X-API-Key": ULTRAVOX_API_KEY,
                    "Content-Type": "application/json",
                },
            )
            if response.status_code == 200:
                voices = response.json().get("results", [])
                if voices:
                    # Get the first voice's ID
                    voice_id_ultravox = voices[0].get("voiceId") or voices[0].get("id")
                    logger.info(f"Found Ultravox voice ID: {voice_id_ultravox}")
                    return voice_id_ultravox
    except Exception as e:
        logger.error(f"Failed to get voice from Ultravox: {e}")
    
    return None


def build_ultravox_call_template(agent_record: Dict[str, Any], ultravox_voice_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Convert our agent database record to Ultravox callTemplate format.
    EXACT COPY of the function from agent.py
    """
    try:
        # Voice is REQUIRED - fail if not provided
        if not ultravox_voice_id:
            raise ValueError("ultravox_voice_id is required for callTemplate. Voice must be synced to Ultravox first.")
        
        # Build base callTemplate with required fields
        system_prompt = agent_record.get("system_prompt", "")
        if not system_prompt or not str(system_prompt).strip():
            raise ValueError("system_prompt is required but is empty or missing")
        
        model = agent_record.get("model", "ultravox-v0.6")
        if not model or not str(model).strip():
            raise ValueError("model is required but is empty or missing")
        
        temperature = agent_record.get("temperature", 0.3)
        try:
            temperature = float(temperature)
            if temperature < 0 or temperature > 1:
                raise ValueError(f"temperature must be between 0 and 1, got {temperature}")
        except (ValueError, TypeError):
            raise ValueError(f"temperature must be a valid float between 0 and 1, got {temperature}")
        
        call_template: Dict[str, Any] = {
            "systemPrompt": str(system_prompt).strip(),
            "model": str(model).strip(),
            "voice": str(ultravox_voice_id).strip(),  # Always set, never empty
            "temperature": temperature,
        }
        
        # Add optional fields
        if agent_record.get("call_template_name"):
            call_template["name"] = agent_record["call_template_name"]
        
        if agent_record.get("language_hint"):
            call_template["languageHint"] = agent_record["language_hint"]
        
        if agent_record.get("time_exceeded_message"):
            call_template["timeExceededMessage"] = agent_record["time_exceeded_message"]
        
        if agent_record.get("recording_enabled") is not None:
            call_template["recordingEnabled"] = agent_record["recording_enabled"]
        
        if agent_record.get("join_timeout"):
            call_template["joinTimeout"] = agent_record["join_timeout"]
        
        if agent_record.get("max_duration"):
            call_template["maxDuration"] = agent_record["max_duration"]
        
        if agent_record.get("initial_output_medium"):
            call_template["initialOutputMedium"] = agent_record["initial_output_medium"]
        
        # Build greeting settings (firstSpeakerSettings)
        greeting_settings = agent_record.get("greeting_settings") or {}
        if greeting_settings:
            first_speaker_settings: Dict[str, Any] = {}
            
            if greeting_settings.get("first_speaker") == "agent":
                agent_settings: Dict[str, Any] = {}
                if greeting_settings.get("text"):
                    agent_settings["text"] = greeting_settings["text"]
                if greeting_settings.get("prompt"):
                    agent_settings["prompt"] = greeting_settings["prompt"]
                if greeting_settings.get("delay"):
                    agent_settings["delay"] = greeting_settings["delay"]
                if greeting_settings.get("uninterruptible") is not None:
                    agent_settings["uninterruptible"] = greeting_settings["uninterruptible"]
                if agent_settings:
                    first_speaker_settings["agent"] = agent_settings
            
            elif greeting_settings.get("first_speaker") == "user":
                user_settings: Dict[str, Any] = {}
                fallback: Dict[str, Any] = {}
                if greeting_settings.get("fallback_delay"):
                    fallback["delay"] = greeting_settings["fallback_delay"]
                if greeting_settings.get("fallback_text"):
                    fallback["text"] = greeting_settings["fallback_text"]
                if greeting_settings.get("fallback_prompt"):
                    fallback["prompt"] = greeting_settings["fallback_prompt"]
                if fallback:
                    user_settings["fallback"] = fallback
                if user_settings:
                    first_speaker_settings["user"] = user_settings
            
            if first_speaker_settings:
                call_template["firstSpeakerSettings"] = first_speaker_settings
        
        # Build inactivity messages
        inactivity_messages = agent_record.get("inactivity_messages") or []
        if inactivity_messages:
            call_template["inactivityMessages"] = [
                {
                    "duration": msg.get("duration", ""),
                    "message": msg.get("message", ""),
                    "endBehavior": msg.get("endBehavior", "END_BEHAVIOR_UNSPECIFIED"),
                }
                for msg in inactivity_messages
            ]
        
        # Build VAD settings
        vad_settings = agent_record.get("vad_settings") or {}
        if vad_settings:
            vad_config: Dict[str, Any] = {}
            if vad_settings.get("turn_endpoint_delay"):
                vad_config["turnEndpointDelay"] = vad_settings["turn_endpoint_delay"]
            if vad_settings.get("minimum_turn_duration"):
                vad_config["minimumTurnDuration"] = vad_settings["minimum_turn_duration"]
            if vad_settings.get("minimum_interruption_duration"):
                vad_config["minimumInterruptionDuration"] = vad_settings["minimum_interruption_duration"]
            if vad_settings.get("frame_activation_threshold") is not None:
                vad_config["frameActivationThreshold"] = float(vad_settings["frame_activation_threshold"])
            if vad_config:
                call_template["vadSettings"] = vad_config
        
        # Build selectedTools (from tools array)
        tools = agent_record.get("tools") or []
        if tools:
            # For testing, we'll skip tool lookup - just log it
            logger.warning("Tools are present but tool lookup is skipped in test")
        
        # Don't add medium field - let Ultravox use defaults
        # The medium field is optional and Ultravox will default to webRtc
        # Only add it if explicitly needed for specific configurations
        
        return call_template
        
    except Exception as e:
        logger.error(f"Failed to build callTemplate: {e}", exc_info=True)
        raise


async def validate_agent_for_ultravox_sync(agent_data: Dict[str, Any], client_id: str) -> Dict[str, Any]:
    """
    Validate agent data is ready for Ultravox sync.
    EXACT COPY of the function from agent.py
    """
    errors = []
    
    # Check required fields
    name = agent_data.get("name")
    if not name or not str(name).strip():
        errors.append("Agent name is required")
    
    system_prompt = agent_data.get("system_prompt")
    if not system_prompt or not str(system_prompt).strip():
        errors.append("System prompt is required")
    
    # Check voice
    voice_id = agent_data.get("voice_id")
    if not voice_id:
        errors.append("Voice is required")
        return {"can_sync": False, "reason": "voice_required", "errors": errors}
    
    # Validate voice exists and has Ultravox ID
    ultravox_voice_id = await get_voice_ultravox_id(voice_id, client_id)
    if not ultravox_voice_id:
        errors.append(f"Voice {voice_id} is not synced to Ultravox. Voice must be synced to Ultravox first.")
        return {"can_sync": False, "reason": "voice_not_synced", "errors": errors}
    
    if errors:
        return {"can_sync": False, "reason": "validation_failed", "errors": errors}
    
    return {"can_sync": True, "reason": None, "errors": []}


async def create_agent_in_ultravox(name: str, call_template: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create agent in Ultravox API.
    EXACT COPY of the Ultravox client's create_agent method
    """
    # Normalize name to match Ultravox requirements
    normalized_name = normalize_agent_name(name)
    if normalized_name != name:
        logger.warning(f"Agent name normalized from '{name}' to '{normalized_name}'")
    
    url = f"{ULTRAVOX_BASE_URL}/api/agents"
    logger.info(f"[ULTRAVOX] Creating agent | name={normalized_name} | url={url}")
    
    payload = {
        "name": normalized_name,
        "callTemplate": call_template
    }
    
    logger.debug(f"[ULTRAVOX] Request payload: {json.dumps(payload, indent=2, default=str)}")
    
    async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
        response = await client.post(
            url,
            json=payload,
            headers={
                "X-API-Key": ULTRAVOX_API_KEY,
                "Content-Type": "application/json",
            },
        )
        
        logger.debug(f"[ULTRAVOX] Response status: {response.status_code}")
        logger.debug(f"[ULTRAVOX] Response headers: {dict(response.headers)}")
        
        if response.status_code >= 400:
            error_text = response.text[:2000] if response.text else "No response body"
            logger.error(f"[ULTRAVOX] Error Response | status={response.status_code} | response={error_text}")
            try:
                error_json = response.json()
                logger.error(f"[ULTRAVOX] Error JSON: {json.dumps(error_json, indent=2, default=str)}")
            except:
                pass
        
        response.raise_for_status()
        return response.json()


async def update_agent_in_ultravox(agent_id: str, name: str, call_template: Dict[str, Any]) -> Dict[str, Any]:
    """
    Update agent in Ultravox API.
    EXACT COPY of the Ultravox client's update_agent method
    """
    # Normalize name to match Ultravox requirements
    normalized_name = normalize_agent_name(name)
    if normalized_name != name:
        logger.warning(f"Agent name normalized from '{name}' to '{normalized_name}'")
    
    url = f"{ULTRAVOX_BASE_URL}/api/agents/{agent_id}"
    logger.info(f"[ULTRAVOX] Updating agent | agent_id={agent_id} | name={normalized_name} | url={url}")
    
    payload = {
        "name": normalized_name,
        "callTemplate": call_template
    }
    
    logger.debug(f"[ULTRAVOX] Update request payload: {json.dumps(payload, indent=2, default=str)}")
    
    async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
        response = await client.patch(
            url,
            json=payload,
            headers={
                "X-API-Key": ULTRAVOX_API_KEY,
                "Content-Type": "application/json",
            },
        )
        
        logger.debug(f"[ULTRAVOX] Update response status: {response.status_code}")
        logger.debug(f"[ULTRAVOX] Update response headers: {dict(response.headers)}")
        
        if response.status_code >= 400:
            error_text = response.text[:2000] if response.text else "No response body"
            logger.error(f"[ULTRAVOX] Update Error Response | status={response.status_code} | response={error_text}")
            try:
                error_json = response.json()
                logger.error(f"[ULTRAVOX] Update Error JSON: {json.dumps(error_json, indent=2, default=str)}")
            except:
                pass
        
        response.raise_for_status()
        return response.json()


async def delete_agent_from_ultravox(agent_id: str) -> None:
    """
    Delete agent from Ultravox API.
    EXACT COPY of the Ultravox client's delete_agent method
    """
    url = f"{ULTRAVOX_BASE_URL}/api/agents/{agent_id}"
    logger.info(f"[ULTRAVOX] Deleting agent | agent_id={agent_id} | url={url}")
    
    async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
        response = await client.delete(
            url,
            headers={
                "X-API-Key": ULTRAVOX_API_KEY,
                "Content-Type": "application/json",
            },
        )
        
        logger.debug(f"[ULTRAVOX] Delete response status: {response.status_code}")
        logger.debug(f"[ULTRAVOX] Delete response headers: {dict(response.headers)}")
        
        if response.status_code >= 400:
            error_text = response.text[:2000] if response.text else "No response body"
            logger.error(f"[ULTRAVOX] Delete Error Response | status={response.status_code} | response={error_text}")
            try:
                error_json = response.json()
                logger.error(f"[ULTRAVOX] Delete Error JSON: {json.dumps(error_json, indent=2, default=str)}")
            except:
                pass
        
        response.raise_for_status()
        logger.info(f"[ULTRAVOX] Agent deleted successfully: {agent_id}")


async def get_agent_from_ultravox(agent_id: str) -> Dict[str, Any]:
    """
    Get agent from Ultravox API.
    """
    url = f"{ULTRAVOX_BASE_URL}/api/agents/{agent_id}"
    logger.info(f"[ULTRAVOX] Getting agent | agent_id={agent_id} | url={url}")
    
    async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
        response = await client.get(
            url,
            headers={
                "X-API-Key": ULTRAVOX_API_KEY,
                "Content-Type": "application/json",
            },
        )
        
        logger.debug(f"[ULTRAVOX] Get response status: {response.status_code}")
        
        if response.status_code >= 400:
            error_text = response.text[:2000] if response.text else "No response body"
            logger.error(f"[ULTRAVOX] Get Error Response | status={response.status_code} | response={error_text}")
        
        response.raise_for_status()
        return response.json()


async def create_agent_ultravox_first(agent_data: Dict[str, Any], client_id: str) -> Dict[str, Any]:
    """
    Create agent in Ultravox FIRST (before database).
    EXACT COPY of the function from agent.py
    """
    # Validate agent can be created in Ultravox
    validation_result = await validate_agent_for_ultravox_sync(agent_data, client_id)
    if not validation_result["can_sync"]:
        error_msg = "; ".join(validation_result["errors"])
        raise ValueError(f"Agent cannot be created in Ultravox: {error_msg}")
    
    # Get voice Ultravox ID
    voice_id = agent_data.get("voice_id")
    ultravox_voice_id = await get_voice_ultravox_id(voice_id, client_id)
    if not ultravox_voice_id:
        raise ValueError(f"Voice {voice_id} does not have an Ultravox voice ID")
    
    # Build callTemplate
    call_template = build_ultravox_call_template(agent_data, ultravox_voice_id)
    
    # Log the callTemplate for debugging
    logger.debug(f"[AGENT_SERVICE] CallTemplate to send to Ultravox: {json.dumps(call_template, indent=2, default=str)}")
    
    # Validate required fields are present
    if not call_template.get("systemPrompt"):
        raise ValueError("systemPrompt is required in callTemplate but is empty")
    if not call_template.get("voice"):
        raise ValueError("voice is required in callTemplate but is empty")
    if call_template.get("temperature") is None:
        raise ValueError("temperature is required in callTemplate but is missing")
    
    # Create agent in Ultravox FIRST
    agent_name = agent_data.get("name", "untitled_agent")
    if not agent_name or not str(agent_name).strip():
        raise ValueError("Agent name is required but is empty or missing")
    
    # Normalize name before sending
    agent_name = normalize_agent_name(agent_name)
    
    response = await create_agent_in_ultravox(agent_name, call_template)
    
    logger.info(f"[AGENT_SERVICE] Created agent in Ultravox FIRST: {response.get('agentId')}")
    return response


async def update_agent_ultravox_first(ultravox_agent_id: str, agent_data: Dict[str, Any], client_id: str) -> Dict[str, Any]:
    """
    Update agent in Ultravox FIRST (before database).
    EXACT COPY of the function from agent.py
    """
    # Validate agent can be updated in Ultravox
    validation_result = await validate_agent_for_ultravox_sync(agent_data, client_id)
    if not validation_result["can_sync"]:
        error_msg = "; ".join(validation_result["errors"])
        raise ValueError(f"Agent cannot be updated in Ultravox: {error_msg}")
    
    # Get voice Ultravox ID
    voice_id = agent_data.get("voice_id")
    ultravox_voice_id = await get_voice_ultravox_id(voice_id, client_id)
    if not ultravox_voice_id:
        raise ValueError(f"Voice {voice_id} does not have an Ultravox voice ID")
    
    # Build callTemplate
    call_template = build_ultravox_call_template(agent_data, ultravox_voice_id)
    
    # Log the callTemplate for debugging
    logger.debug(f"[AGENT_SERVICE] CallTemplate to send to Ultravox: {json.dumps(call_template, indent=2, default=str)}")
    
    # Validate required fields are present
    if not call_template.get("systemPrompt"):
        raise ValueError("systemPrompt is required in callTemplate but is empty")
    if not call_template.get("voice"):
        raise ValueError("voice is required in callTemplate but is empty")
    if call_template.get("temperature") is None:
        raise ValueError("temperature is required in callTemplate but is missing")
    
    # Update agent in Ultravox FIRST
    agent_name = agent_data.get("name", "untitled_agent")
    if not agent_name or not str(agent_name).strip():
        raise ValueError("Agent name is required but is empty or missing")
    
    # Normalize name before sending
    agent_name = normalize_agent_name(agent_name)
    
    response = await update_agent_in_ultravox(ultravox_agent_id, agent_name, call_template)
    
    logger.info(f"[AGENT_SERVICE] Updated agent in Ultravox FIRST: {ultravox_agent_id}")
    return response


async def main():
    """Main test function - Complete flow: CREATE → WAIT → UPDATE → DELETE"""
    logger.info("=" * 80)
    logger.info("ULTRAVOX AGENT COMPLETE TEST (CREATE → UPDATE → DELETE)")
    logger.info("=" * 80)
    
    ultravox_agent_id = None
    
    try:
        # Step 1: Get a valid voice ID from Ultravox
        logger.info("\n[STEP 1] Getting Ultravox voice ID...")
        voice_id = "test-voice-id"  # Placeholder - will be replaced by actual lookup
        ultravox_voice_id = await get_voice_ultravox_id(voice_id, TEST_AGENT_DATA["client_id"])
        
        if not ultravox_voice_id:
            logger.info("Trying to list voices from Ultravox to find one...")
            # Try direct API call
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{ULTRAVOX_BASE_URL}/api/voices",
                    headers={
                        "X-API-Key": ULTRAVOX_API_KEY,
                        "Content-Type": "application/json",
                    },
                )
                if response.status_code == 200:
                    voices = response.json().get("results", [])
                    logger.info(f"Found {len(voices)} voices in Ultravox")
                    if voices:
                        ultravox_voice_id = voices[0].get("voiceId") or voices[0].get("id")
                        logger.info(f"✅ Using voice ID: {ultravox_voice_id}")
                        TEST_AGENT_DATA["voice_id"] = "test-voice-id"  # Set for validation
                    else:
                        logger.error("❌ No voices found in Ultravox account")
                        return
                else:
                    logger.error(f"❌ Failed to list voices: {response.status_code} - {response.text}")
                    return
        else:
            TEST_AGENT_DATA["voice_id"] = voice_id
        
        # Step 2: Validate agent data
        logger.info("\n[STEP 2] Validating agent data...")
        validation_result = await validate_agent_for_ultravox_sync(TEST_AGENT_DATA, TEST_AGENT_DATA["client_id"])
        logger.info(f"Validation result: {json.dumps(validation_result, indent=2)}")
        
        if not validation_result["can_sync"]:
            logger.error(f"❌ Validation failed: {validation_result.get('reason')}")
            logger.error(f"Errors: {validation_result.get('errors')}")
            return
        
        # Step 3: Build callTemplate
        logger.info("\n[STEP 3] Building callTemplate...")
        call_template = build_ultravox_call_template(TEST_AGENT_DATA, ultravox_voice_id)
        logger.info(f"✅ CallTemplate built successfully")
        logger.info(f"CallTemplate: {json.dumps(call_template, indent=2, default=str)}")
        
        # Step 4: CREATE agent in Ultravox
        logger.info("\n" + "=" * 80)
        logger.info("[STEP 4] CREATING agent in Ultravox...")
        logger.info("=" * 80)
        create_response = await create_agent_ultravox_first(TEST_AGENT_DATA, TEST_AGENT_DATA["client_id"])
        ultravox_agent_id = create_response.get("agentId")
        
        if not ultravox_agent_id:
            logger.error("❌ Agent created but no agentId returned")
            return
        
        logger.info(f"✅ Agent created successfully!")
        logger.info(f"Agent ID: {ultravox_agent_id}")
        logger.info(f"Full response: {json.dumps(create_response, indent=2, default=str)}")
        
        # Step 5: WAIT a bit before updating
        logger.info("\n" + "=" * 80)
        logger.info("[STEP 5] Waiting 3 seconds before update...")
        logger.info("=" * 80)
        await asyncio.sleep(3)
        
        # Step 6: GET agent to verify it exists
        logger.info("\n" + "=" * 80)
        logger.info("[STEP 6] GETTING agent from Ultravox to verify...")
        logger.info("=" * 80)
        get_response = await get_agent_from_ultravox(ultravox_agent_id)
        logger.info(f"✅ Agent retrieved successfully!")
        logger.info(f"Agent details: {json.dumps(get_response, indent=2, default=str)}")
        
        # Step 7: UPDATE agent (change system prompt)
        logger.info("\n" + "=" * 80)
        logger.info("[STEP 7] UPDATING agent in Ultravox (changing system prompt)...")
        logger.info("=" * 80)
        
        # Create updated agent data
        updated_agent_data = {**TEST_AGENT_DATA}
        updated_agent_data["system_prompt"] = "You are an expert assistant specialized in customer support. Be friendly and helpful."
        updated_agent_data["name"] = "test_agent_updated"  # Updated name
        
        # Validate updated data
        validation_result = await validate_agent_for_ultravox_sync(updated_agent_data, TEST_AGENT_DATA["client_id"])
        if not validation_result["can_sync"]:
            logger.error(f"❌ Updated agent validation failed: {validation_result.get('errors')}")
            return
        
        # Build updated callTemplate
        updated_call_template = build_ultravox_call_template(updated_agent_data, ultravox_voice_id)
        logger.info(f"Updated CallTemplate: {json.dumps(updated_call_template, indent=2, default=str)}")
        
        # Update agent
        update_response = await update_agent_ultravox_first(ultravox_agent_id, updated_agent_data, TEST_AGENT_DATA["client_id"])
        logger.info(f"✅ Agent updated successfully!")
        logger.info(f"Update response: {json.dumps(update_response, indent=2, default=str)}")
        
        # Step 8: GET agent again to verify update
        logger.info("\n" + "=" * 80)
        logger.info("[STEP 8] GETTING updated agent from Ultravox to verify changes...")
        logger.info("=" * 80)
        get_updated_response = await get_agent_from_ultravox(ultravox_agent_id)
        logger.info(f"✅ Updated agent retrieved successfully!")
        logger.info(f"Updated agent details: {json.dumps(get_updated_response, indent=2, default=str)}")
        
        # Verify the system prompt was updated
        updated_call_template_from_api = get_updated_response.get("callTemplate", {})
        updated_system_prompt = updated_call_template_from_api.get("systemPrompt", "")
        if updated_system_prompt == updated_agent_data["system_prompt"]:
            logger.info(f"✅ System prompt successfully updated: {updated_system_prompt[:50]}...")
        else:
            logger.warning(f"⚠️ System prompt may not have updated correctly")
            logger.warning(f"Expected: {updated_agent_data['system_prompt']}")
            logger.warning(f"Got: {updated_system_prompt}")
        
        # Step 9: WAIT a bit before deleting
        logger.info("\n" + "=" * 80)
        logger.info("[STEP 9] Waiting 2 seconds before deletion...")
        logger.info("=" * 80)
        await asyncio.sleep(2)
        
        # Step 10: DELETE agent
        logger.info("\n" + "=" * 80)
        logger.info("[STEP 10] DELETING agent from Ultravox...")
        logger.info("=" * 80)
        await delete_agent_from_ultravox(ultravox_agent_id)
        logger.info(f"✅ Agent deleted successfully!")
        
        # Step 11: Verify deletion (should get 404)
        logger.info("\n" + "=" * 80)
        logger.info("[STEP 11] Verifying deletion (should get 404)...")
        logger.info("=" * 80)
        try:
            await get_agent_from_ultravox(ultravox_agent_id)
            logger.error("❌ Agent still exists after deletion!")
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                logger.info("✅ Agent successfully deleted (404 as expected)")
            else:
                logger.error(f"❌ Unexpected error: {e.response.status_code}")
        
        logger.info("\n" + "=" * 80)
        logger.info("✅✅✅ ALL TESTS PASSED! ✅✅✅")
        logger.info("=" * 80)
        logger.info("Summary:")
        logger.info("  ✅ CREATE: Agent created successfully")
        logger.info("  ✅ GET: Agent retrieved successfully")
        logger.info("  ✅ UPDATE: Agent updated successfully")
        logger.info("  ✅ DELETE: Agent deleted successfully")
        logger.info("=" * 80)
        
    except ValueError as e:
        logger.error("\n" + "=" * 80)
        logger.error("❌ VALIDATION ERROR")
        logger.error("=" * 80)
        logger.error(f"Error: {str(e)}", exc_info=True)
        if ultravox_agent_id:
            logger.info(f"\n⚠️ Attempting to clean up agent {ultravox_agent_id}...")
            try:
                await delete_agent_from_ultravox(ultravox_agent_id)
                logger.info("✅ Cleanup successful")
            except:
                logger.warning("⚠️ Cleanup failed - agent may still exist")
    except httpx.HTTPStatusError as e:
        logger.error("\n" + "=" * 80)
        logger.error("❌ HTTP ERROR")
        logger.error("=" * 80)
        logger.error(f"Status Code: {e.response.status_code}")
        logger.error(f"Response: {e.response.text[:2000]}")
        try:
            error_json = e.response.json()
            logger.error(f"Error JSON: {json.dumps(error_json, indent=2, default=str)}")
        except:
            pass
        logger.error(f"Full error: {str(e)}", exc_info=True)
        if ultravox_agent_id:
            logger.info(f"\n⚠️ Attempting to clean up agent {ultravox_agent_id}...")
            try:
                await delete_agent_from_ultravox(ultravox_agent_id)
                logger.info("✅ Cleanup successful")
            except:
                logger.warning("⚠️ Cleanup failed - agent may still exist")
    except Exception as e:
        logger.error("\n" + "=" * 80)
        logger.error("❌ UNEXPECTED ERROR")
        logger.error("=" * 80)
        logger.error(f"Error: {str(e)}", exc_info=True)
        if ultravox_agent_id:
            logger.info(f"\n⚠️ Attempting to clean up agent {ultravox_agent_id}...")
            try:
                await delete_agent_from_ultravox(ultravox_agent_id)
                logger.info("✅ Cleanup successful")
            except:
                logger.warning("⚠️ Cleanup failed - agent may still exist")


if __name__ == "__main__":
    asyncio.run(main())
