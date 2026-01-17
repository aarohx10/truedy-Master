# Create Call

**URL:** https://docs.ultravox.ai/api-reference/calls/calls-post

## Description
Creates a new call using the specified system prompt and other properties

## Endpoint
```
POST 
```

## Request

### cURL Example
```bash
curl--requestPOST\--urlhttps://api.ultravox.ai/api/calls\--header'Content-Type: application/json'\--header'X-API-Key: <api-key>'\--data'{"systemPrompt": "<string>","temperature": 123,"model": "<string>","voice": "<string>","externalVoice": {"elevenLabs": {"voiceId": "<string>","model": "<string>","speed": 123,"useSpeakerBoost": true,"style": 123,"similarityBoost": 123,"stability": 123,"pronunciationDictionaries": [{"dictionaryId": "<string>","versionId": "<string>"}],"optimizeStreamingLatency": 123,"maxSampleRate": 123},"cartesia": {"voiceId": "<string>","model": "<string>","speed": 123,"emotion": "<string>","emotions": ["<string>"],"generationConfig": {"volume": 123,"speed": 123,"emotion": "<string>"}},"lmnt": {"voiceId": "<string>","model": "<string>","speed": 123,"conversational": true},"google": {"voiceId": "<string>","speakingRate": 123},"generic": {"url": "<string>","headers": {},"body": {},"responseSampleRate": 123,"responseWordsPerMinute": 123,"responseMimeType": "<string>","jsonAudioFieldPath": "<string>","jsonByteEncoding": "JSON_BYTE_ENCODING_UNSPECIFIED"}},"languageHint": "<string>","initialMessages": [{"role": "MESSAGE_ROLE_UNSPECIFIED","text": "<string>","invocationId": "<string>","toolName": "<string>","errorDetails": "<string>","medium": "MESSAGE_MEDIUM_UNSPECIFIED","callStageMessageIndex": 123,"callStageId": "<string>","callState": {},"timespan": {"start": "<string>","end": "<string>"},"wallClockTimespan": {"start": "<string>","end": "<string>"}}],"joinTimeout": "<string>","maxDuration": "<string>","timeExceededMessage": "<string>","inactivityMessages": [{"duration": "<string>","message": "<string>","endBehavior": "END_BEHAVIOR_UNSPECIFIED"}],"selectedTools": [{"toolId": "<string>","toolName": "<string>","temporaryTool": {"modelToolName": "<string>","description": "<string>","dynamicParameters": [{"name": "<string>","location": "PARAMETER_LOCATION_UNSPECIFIED","schema": {},"required": true}],"staticParameters": [{"name": "<string>","location": "PARAMETER_LOCATION_UNSPECIFIED","value": "<unknown>"}],"automaticParameters": [{"name": "<string>","location": "PARAMETER_LOCATION_UNSPECIFIED","knownValue": "KNOWN_PARAM_UNSPECIFIED"}],"requirements": {"httpSecurityOptions": {"options": [{"requirements": {},"ultravoxCallTokenRequirement": {"scopes": ["<string>"]}}]},"requiredParameterOverrides": ["<string>"]},"timeout": "<string>","precomputable": true,"http": {"baseUrlPattern": "<string>","httpMethod": "<string>"},"client": {},"dataConnection": {},"defaultReaction": "AGENT_REACTION_UNSPECIFIED","staticResponse": {"responseText": "<string>"}},"nameOverride": "<string>","descriptionOverride": "<string>","authTokens": {},"parameterOverrides": {},"transitionId": "<string>"}],"medium": {"webRtc": {"dataMessages": {"pong": true,"state": true,"transcript": true,"clientToolInvocation": true,"dataConnectionToolInvocation": true,"playbackClearBuffer": true,"callStarted": true,"debug": true,"callEvent": true,"toolUsed": true}},"twilio": {"outgoing": {"to": "<string>","from": "<string>","additionalParams": {}}},"serverWebSocket": {"inputSampleRate": 123,"outputSampleRate": 123,"clientBufferSizeMs": 123,"dataMessages": {"pong": true,"state": true,"transcript": true,"clientToolInvocation": true,"dataConnectionToolInvocation": true,"playbackClearBuffer": true,"callStarted": true,"debug": true,"callEvent": true,"toolUsed": true}},"telnyx": {"outgoing": {"to": "<string>","from": "<string>","additionalParams": {}}},"plivo": {"outgoing": {"to": "<string>","from": "<string>","additionalParams": {}}},"exotel": {},"sip": {"incoming": {},"outgoing": {"to": "<string>","from": "<string>","username": "<string>","password": "<string>"}}},"recordingEnabled": true,"firstSpeaker": "FIRST_SPEAKER_UNSPECIFIED","transcriptOptional": true,"initialOutputMedium": "MESSAGE_MEDIUM_UNSPECIFIED","vadSettings": {"turnEndpointDelay": "<string>","minimumTurnDuration": "<string>","minimumInterruptionDuration": "<string>","frameActivationThreshold": 123},"firstSpeakerSettings": {"user": {"fallback": {"delay": "<string>","text": "<string>","prompt": "<string>"}},"agent": {"uninterruptible": true,"text": "<string>","prompt": "<string>","delay": "<string>"}},"experimentalSettings": {},"metadata": {},"initialState": {},"dataConnection": {"websocketUrl": "<string>","audioConfig": {"sampleRate": 123,"channelMode": "CHANNEL_MODE_UNSPECIFIED"},"dataMessages": {"pong": true,"state": true,"transcript": true,"clientToolInvocation": true,"dataConnectionToolInvocation": true,"playbackClearBuffer": true,"callStarted": true,"debug": true,"callEvent": true,"toolUsed": true}},"callbacks": {"joined": {"url": "<string>","secrets": ["<string>"]},"ended": {"url": "<string>","secrets": ["<string>"]},"billed": {"url": "<string>","secrets": ["<string>"]}}}'
```

### cURL Example
```bash
curl--requestPOST\--urlhttps://api.ultravox.ai/api/calls\--header'Content-Type: application/json'\--header'X-API-Key: <api-key>'\--data'{"systemPrompt": "<string>","temperature": 123,"model": "<string>","voice": "<string>","externalVoice": {"elevenLabs": {"voiceId": "<string>","model": "<string>","speed": 123,"useSpeakerBoost": true,"style": 123,"similarityBoost": 123,"stability": 123,"pronunciationDictionaries": [{"dictionaryId": "<string>","versionId": "<string>"}],"optimizeStreamingLatency": 123,"maxSampleRate": 123},"cartesia": {"voiceId": "<string>","model": "<string>","speed": 123,"emotion": "<string>","emotions": ["<string>"],"generationConfig": {"volume": 123,"speed": 123,"emotion": "<string>"}},"lmnt": {"voiceId": "<string>","model": "<string>","speed": 123,"conversational": true},"google": {"voiceId": "<string>","speakingRate": 123},"generic": {"url": "<string>","headers": {},"body": {},"responseSampleRate": 123,"responseWordsPerMinute": 123,"responseMimeType": "<string>","jsonAudioFieldPath": "<string>","jsonByteEncoding": "JSON_BYTE_ENCODING_UNSPECIFIED"}},"languageHint": "<string>","initialMessages": [{"role": "MESSAGE_ROLE_UNSPECIFIED","text": "<string>","invocationId": "<string>","toolName": "<string>","errorDetails": "<string>","medium": "MESSAGE_MEDIUM_UNSPECIFIED","callStageMessageIndex": 123,"callStageId": "<string>","callState": {},"timespan": {"start": "<string>","end": "<string>"},"wallClockTimespan": {"start": "<string>","end": "<string>"}}],"joinTimeout": "<string>","maxDuration": "<string>","timeExceededMessage": "<string>","inactivityMessages": [{"duration": "<string>","message": "<string>","endBehavior": "END_BEHAVIOR_UNSPECIFIED"}],"selectedTools": [{"toolId": "<string>","toolName": "<string>","temporaryTool": {"modelToolName": "<string>","description": "<string>","dynamicParameters": [{"name": "<string>","location": "PARAMETER_LOCATION_UNSPECIFIED","schema": {},"required": true}],"staticParameters": [{"name": "<string>","location": "PARAMETER_LOCATION_UNSPECIFIED","value": "<unknown>"}],"automaticParameters": [{"name": "<string>","location": "PARAMETER_LOCATION_UNSPECIFIED","knownValue": "KNOWN_PARAM_UNSPECIFIED"}],"requirements": {"httpSecurityOptions": {"options": [{"requirements": {},"ultravoxCallTokenRequirement": {"scopes": ["<string>"]}}]},"requiredParameterOverrides": ["<string>"]},"timeout": "<string>","precomputable": true,"http": {"baseUrlPattern": "<string>","httpMethod": "<string>"},"client": {},"dataConnection": {},"defaultReaction": "AGENT_REACTION_UNSPECIFIED","staticResponse": {"responseText": "<string>"}},"nameOverride": "<string>","descriptionOverride": "<string>","authTokens": {},"parameterOverrides": {},"transitionId": "<string>"}],"medium": {"webRtc": {"dataMessages": {"pong": true,"state": true,"transcript": true,"clientToolInvocation": true,"dataConnectionToolInvocation": true,"playbackClearBuffer": true,"callStarted": true,"debug": true,"callEvent": true,"toolUsed": true}},"twilio": {"outgoing": {"to": "<string>","from": "<string>","additionalParams": {}}},"serverWebSocket": {"inputSampleRate": 123,"outputSampleRate": 123,"clientBufferSizeMs": 123,"dataMessages": {"pong": true,"state": true,"transcript": true,"clientToolInvocation": true,"dataConnectionToolInvocation": true,"playbackClearBuffer": true,"callStarted": true,"debug": true,"callEvent": true,"toolUsed": true}},"telnyx": {"outgoing": {"to": "<string>","from": "<string>","additionalParams": {}}},"plivo": {"outgoing": {"to": "<string>","from": "<string>","additionalParams": {}}},"exotel": {},"sip": {"incoming": {},"outgoing": {"to": "<string>","from": "<string>","username": "<string>","password": "<string>"}}},"recordingEnabled": true,"firstSpeaker": "FIRST_SPEAKER_UNSPECIFIED","transcriptOptional": true,"initialOutputMedium": "MESSAGE_MEDIUM_UNSPECIFIED","vadSettings": {"turnEndpointDelay": "<string>","minimumTurnDuration": "<string>","minimumInterruptionDuration": "<string>","frameActivationThreshold": 123},"firstSpeakerSettings": {"user": {"fallback": {"delay": "<string>","text": "<string>","prompt": "<string>"}},"agent": {"uninterruptible": true,"text": "<string>","prompt": "<string>","delay": "<string>"}},"experimentalSettings": {},"metadata": {},"initialState": {},"dataConnection": {"websocketUrl": "<string>","audioConfig": {"sampleRate": 123,"channelMode": "CHANNEL_MODE_UNSPECIFIED"},"dataMessages": {"pong": true,"state": true,"transcript": true,"clientToolInvocation": true,"dataConnectionToolInvocation": true,"playbackClearBuffer": true,"callStarted": true,"debug": true,"callEvent": true,"toolUsed": true}},"callbacks": {"joined": {"url": "<string>","secrets": ["<string>"]},"ended": {"url": "<string>","secrets": ["<string>"]},"billed": {"url": "<string>","secrets": ["<string>"]}}}'
```

## Response

### Response Schema

```json
{"callId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","clientVersion":"<string>","created":"2023-11-07T05:31:56Z","joined":"2023-11-07T05:31:56Z","ended":"2023-11-07T05:31:56Z","endReason":"unjoined","billedDuration":"<string>","billingStatus":"BILLING_STATUS_PENDING","firstSpeaker":"FIRST_SPEAKER_AGENT","firstSpeakerSettings": {"user": {"fallback": {"delay":"<string>","text":"<string>","prompt":"<string>"}},"agent": {"uninterruptible":true,"text":"<string>","prompt":"<string>","delay":"<string>"}},"initialOutputMedium":"MESSAGE_MEDIUM_VOICE","joinUrl":"<string>","shortSummary":"<string>","summary":"<string>","agent": {"agentId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","name":"<string>"},"agentId":"<string>","experimentalSettings":"<unknown>","metadata": {},"initialState": {},"requestContext":"<unknown>","sipDetails": {"billedDuration":"<string>","terminationReason":"SIP_TERMINATION_NORMAL"},"inactivityMessages": [{"duration":"<string>","message":"<string>","endBehavior":"END_BEHAVIOR_UNSPECIFIED"}],"joinTimeout":"30s","languageHint":"<string>","maxDuration":"3600s","medium": {"webRtc": {"dataMessages": {"pong":true,"state":true,"transcript":true,"clientToolInvocation":true,"dataConnectionToolInvocation":true,"playbackClearBuffer":true,"callStarted":true,"debug":true,"callEvent":true,"toolUsed":true}},"twilio": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"serverWebSocket": {"inputSampleRate":123,"outputSampleRate":123,"clientBufferSizeMs":123,"dataMessages": {"pong":true,"state":true,"transcript":true,"clientToolInvocation":true,"dataConnectionToolInvocation":true,"playbackClearBuffer":true,"callStarted":true,"debug":true,"callEvent":true,"toolUsed":true}},"telnyx": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"plivo": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"exotel": {},"sip": {"incoming": {},"outgoing": {"to":"<string>","from":"<string>","username":"<string>","password":"<string>"}}},"model":"ultravox-v0.6","recordingEnabled":false,"systemPrompt":"<string>","temperature":0,"timeExceededMessage":"<string>","voice":"<string>","externalVoice": {"elevenLabs": {"voiceId":"<string>","model":"<string>","speed":123,"useSpeakerBoost":true,"style":123,"similarityBoost":123,"stability":123,"pronunciationDictionaries": [{"dictionaryId":"<string>","versionId":"<string>"}],"optimizeStreamingLatency":123,"maxSampleRate":123},"cartesia": {"voiceId":"<string>","model":"<string>","speed":123,"emotion":"<string>","emotions": ["<string>"],"generationConfig": {"volume":123,"speed":123,"emotion":"<string>"}},"lmnt": {"voiceId":"<string>","model":"<string>","speed":123,"conversational":true},"google": {"voiceId":"<string>","speakingRate":123},"generic": {"url":"<string>","headers": {},"body": {},"responseSampleRate":123,"responseWordsPerMinute":123,"responseMimeType":"<string>","jsonAudioFieldPath":"<string>","jsonByteEncoding":"JSON_BYTE_ENCODING_UNSPECIFIED"}},"transcriptOptional":true,"vadSettings": {"turnEndpointDelay":"<string>","minimumTurnDuration":"<string>","minimumInterruptionDuration":"<string>","frameActivationThreshold":123},"dataConnectionConfig": {"websocketUrl":"<string>","audioConfig": {"sampleRate":123,"channelMode":"CHANNEL_MODE_UNSPECIFIED"},"dataMessages": {"pong":true,"state":true,"transcript":true,"clientToolInvocation":true,"dataConnectionToolInvocation":true,"playbackClearBuffer":true,"callStarted":true,"debug":true,"callEvent":true,"toolUsed":true}},"callbacks": {"joined": {"url":"<string>","secrets": ["<string>"]},"ended": {"url":"<string>","secrets": ["<string>"]},"billed": {"url":"<string>","secrets": ["<string>"]}}}
```

```json
{"callId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","clientVersion":"<string>","created":"2023-11-07T05:31:56Z","joined":"2023-11-07T05:31:56Z","ended":"2023-11-07T05:31:56Z","endReason":"unjoined","billedDuration":"<string>","billingStatus":"BILLING_STATUS_PENDING","firstSpeaker":"FIRST_SPEAKER_AGENT","firstSpeakerSettings": {"user": {"fallback": {"delay":"<string>","text":"<string>","prompt":"<string>"}},"agent": {"uninterruptible":true,"text":"<string>","prompt":"<string>","delay":"<string>"}},"initialOutputMedium":"MESSAGE_MEDIUM_VOICE","joinUrl":"<string>","shortSummary":"<string>","summary":"<string>","agent": {"agentId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","name":"<string>"},"agentId":"<string>","experimentalSettings":"<unknown>","metadata": {},"initialState": {},"requestContext":"<unknown>","sipDetails": {"billedDuration":"<string>","terminationReason":"SIP_TERMINATION_NORMAL"},"inactivityMessages": [{"duration":"<string>","message":"<string>","endBehavior":"END_BEHAVIOR_UNSPECIFIED"}],"joinTimeout":"30s","languageHint":"<string>","maxDuration":"3600s","medium": {"webRtc": {"dataMessages": {"pong":true,"state":true,"transcript":true,"clientToolInvocation":true,"dataConnectionToolInvocation":true,"playbackClearBuffer":true,"callStarted":true,"debug":true,"callEvent":true,"toolUsed":true}},"twilio": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"serverWebSocket": {"inputSampleRate":123,"outputSampleRate":123,"clientBufferSizeMs":123,"dataMessages": {"pong":true,"state":true,"transcript":true,"clientToolInvocation":true,"dataConnectionToolInvocation":true,"playbackClearBuffer":true,"callStarted":true,"debug":true,"callEvent":true,"toolUsed":true}},"telnyx": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"plivo": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"exotel": {},"sip": {"incoming": {},"outgoing": {"to":"<string>","from":"<string>","username":"<string>","password":"<string>"}}},"model":"ultravox-v0.6","recordingEnabled":false,"systemPrompt":"<string>","temperature":0,"timeExceededMessage":"<string>","voice":"<string>","externalVoice": {"elevenLabs": {"voiceId":"<string>","model":"<string>","speed":123,"useSpeakerBoost":true,"style":123,"similarityBoost":123,"stability":123,"pronunciationDictionaries": [{"dictionaryId":"<string>","versionId":"<string>"}],"optimizeStreamingLatency":123,"maxSampleRate":123},"cartesia": {"voiceId":"<string>","model":"<string>","speed":123,"emotion":"<string>","emotions": ["<string>"],"generationConfig": {"volume":123,"speed":123,"emotion":"<string>"}},"lmnt": {"voiceId":"<string>","model":"<string>","speed":123,"conversational":true},"google": {"voiceId":"<string>","speakingRate":123},"generic": {"url":"<string>","headers": {},"body": {},"responseSampleRate":123,"responseWordsPerMinute":123,"responseMimeType":"<string>","jsonAudioFieldPath":"<string>","jsonByteEncoding":"JSON_BYTE_ENCODING_UNSPECIFIED"}},"transcriptOptional":true,"vadSettings": {"turnEndpointDelay":"<string>","minimumTurnDuration":"<string>","minimumInterruptionDuration":"<string>","frameActivationThreshold":123},"dataConnectionConfig": {"websocketUrl":"<string>","audioConfig": {"sampleRate":123,"channelMode":"CHANNEL_MODE_UNSPECIFIED"},"dataMessages": {"pong":true,"state":true,"transcript":true,"clientToolInvocation":true,"dataConnectionToolInvocation":true,"playbackClearBuffer":true,"callStarted":true,"debug":true,"callEvent":true,"toolUsed":true}},"callbacks": {"joined": {"url":"<string>","secrets": ["<string>"]},"ended": {"url":"<string>","secrets": ["<string>"]},"billed": {"url":"<string>","secrets": ["<string>"]}}}
```

## Full Content

```
Calls, Messages, Stages
Create Call
Creates a new call using the specified system prompt and other properties
POST
/
api
/
calls
Try it
cURL
cURL
Copy
Ask AI
curl
--request
POST
\
--url
https://api.ultravox.ai/api/calls
\
--header
'Content-Type: application/json'
\
--header
'X-API-Key: <api-key>'
\
--data
'
{
"systemPrompt": "<string>",
"temperature": 123,
"model": "<string>",
"voice": "<string>",
"externalVoice": {
"elevenLabs": {
"voiceId": "<string>",
"model": "<string>",
"speed": 123,
"useSpeakerBoost": true,
"style": 123,
"similarityBoost": 123,
"stability": 123,
"pronunciationDictionaries": [
{
"dictionaryId": "<string>",
"versionId": "<string>"
}
],
"optimizeStreamingLatency": 123,
"maxSampleRate": 123
},
"cartesia": {
"voiceId": "<string>",
"model": "<string>",
"speed": 123,
"emotion": "<string>",
"emotions": [
"<string>"
],
"generationConfig": {
"volume": 123,
"speed": 123,
"emotion": "<string>"
}
},
"lmnt": {
"voiceId": "<string>",
"model": "<string>",
"speed": 123,
"conversational": true
},
"google": {
"voiceId": "<string>",
"speakingRate": 123
},
"generic": {
"url": "<string>",
"headers": {},
"body": {},
"responseSampleRate": 123,
"responseWordsPerMinute": 123,
"responseMimeType": "<string>",
"jsonAudioFieldPath": "<string>",
"jsonByteEncoding": "JSON_BYTE_ENCODING_UNSPECIFIED"
}
},
"languageHint": "<string>",
"initialMessages": [
{
"role": "MESSAGE_ROLE_UNSPECIFIED",
"text": "<string>",
"invocationId": "<string>",
"toolName": "<string>",
"errorDetails": "<string>",
"medium": "MESSAGE_MEDIUM_UNSPECIFIED",
"callStageMessageIndex": 123,
"callStageId": "<string>",
"callState": {},
"timespan": {
"start": "<string>",
"end": "<string>"
},
"wallClockTimespan": {
"start": "<string>",
"end": "<string>"
}
}
],
"joinTimeout": "<string>",
"maxDuration": "<string>",
"timeExceededMessage": "<string>",
"inactivityMessages": [
{
"duration": "<string>",
"message": "<string>",
"endBehavior": "END_BEHAVIOR_UNSPECIFIED"
}
],
"selectedTools": [
{
"toolId": "<string>",
"toolName": "<string>",
"temporaryTool": {
"modelToolName": "<string>",
"description": "<string>",
"dynamicParameters": [
{
"name": "<string>",
"location": "PARAMETER_LOCATION_UNSPECIFIED",
"schema": {},
"required": true
}
],
"staticParameters": [
{
"name": "<string>",
"location": "PARAMETER_LOCATION_UNSPECIFIED",
"value": "<unknown>"
}
],
"automaticParameters": [
{
"name": "<string>",
"location": "PARAMETER_LOCATION_UNSPECIFIED",
"knownValue": "KNOWN_PARAM_UNSPECIFIED"
}
],
"requirements": {
"httpSecurityOptions": {
"options": [
{
"requirements": {},
"ultravoxCallTokenRequirement": {
"scopes": [
"<string>"
]
}
}
]
},
"requiredParameterOverrides": [
"<string>"
]
},
"timeout": "<string>",
"precomputable": true,
"http": {
"baseUrlPattern": "<string>",
"httpMethod": "<string>"
},
"client": {},
"dataConnection": {},
"defaultReaction": "AGENT_REACTION_UNSPECIFIED",
"staticResponse": {
"responseText": "<string>"
}
},
"nameOverride": "<string>",
"descriptionOverride": "<string>",
"authTokens": {},
"parameterOverrides": {},
"transitionId": "<string>"
}
],
"medium": {
"webRtc": {
"dataMessages": {
"pong": true,
"state": true,
"transcript": true,
"clientToolInvocation": true,
"dataConnectionToolInvocation": true,
"playbackClearBuffer": true,
"callStarted": true,
"debug": true,
"callEvent": true,
"toolUsed": true
}
},
"twilio": {
"outgoing": {
"to": "<string>",
"from": "<string>",
"additionalParams": {}
}
},
"serverWebSocket": {
"inputSampleRate": 123,
"outputSampleRate": 123,
"clientBufferSizeMs": 123,
"dataMessages": {
"pong": true,
"state": true,
"transcript": true,
"clientToolInvocation": true,
"dataConnectionToolInvocation": true,
"playbackClearBuffer": true,
"callStarted": true,
"debug": true,
"callEvent": true,
"toolUsed": true
}
},
"telnyx": {
"outgoing": {
"to": "<string>",
"from": "<string>",
"additionalParams": {}
}
},
"plivo": {
"outgoing": {
"to": "<string>",
"from": "<string>",
"additionalParams": {}
}
},
"exotel": {},
"sip": {
"incoming": {},
"outgoing": {
"to": "<string>",
"from": "<string>",
"username": "<string>",
"password": "<string>"
}
}
},
"recordingEnabled": true,
"firstSpeaker": "FIRST_SPEAKER_UNSPECIFIED",
"transcriptOptional": true,
"initialOutputMedium": "MESSAGE_MEDIUM_UNSPECIFIED",
"vadSettings": {
"turnEndpointDelay": "<string>",
"minimumTurnDuration": "<string>",
"minimumInterruptionDuration": "<string>",
"frameActivationThreshold": 123
},
"firstSpeakerSettings": {
"user": {
"fallback": {
"delay": "<string>",
"text": "<string>",
"prompt": "<string>"
}
},
"agent": {
"uninterruptible": true,
"text": "<string>",
"prompt": "<string>",
"delay": "<string>"
}
},
"experimentalSettings": {},
"metadata": {},
"initialState": {},
"dataConnection": {
"websocketUrl": "<string>",
"audioConfig": {
"sampleRate": 123,
"channelMode": "CHANNEL_MODE_UNSPECIFIED"
},
"dataMessages": {
"pong": true,
"state": true,
"transcript": true,
"clientToolInvocation": true,
"dataConnectionToolInvocation": true,
"playbackClearBuffer": true,
"callStarted": true,
"debug": true,
"callEvent": true,
"toolUsed": true
}
},
"callbacks": {
"joined": {
"url": "<string>",
"secrets": [
"<string>"
]
},
"ended": {
"url": "<string>",
"secrets": [
"<string>"
]
},
"billed": {
"url": "<string>",
"secrets": [
"<string>"
]
}
}
}
'
201
Copy
Ask AI
{
"callId"
:
"3c90c3cc-0d44-4b50-8888-8dd25736052a"
,
"clientVersion"
:
"<string>"
,
"created"
:
"2023-11-07T05:31:56Z"
,
"joined"
:
"2023-11-07T05:31:56Z"
,
"ended"
:
"2023-11-07T05:31:56Z"
,
"endReason"
:
"unjoined"
,
"billedDuration"
:
"<string>"
,
"billingStatus"
:
"BILLING_STATUS_PENDING"
,
"firstSpeaker"
:
"FIRST_SPEAKER_AGENT"
,
"firstSpeakerSettings"
: {
"user"
: {
"fallback"
: {
"delay"
:
"<string>"
,
"text"
:
"<string>"
,
"prompt"
:
"<string>"
}
},
"agent"
: {
"uninterruptible"
:
true
,
"text"
:
"<string>"
,
"prompt"
:
"<string>"
,
"delay"
:
"<string>"
}
},
"initialOutputMedium"
:
"MESSAGE_MEDIUM_VOICE"
,
"joinUrl"
:
"<string>"
,
"shortSummary"
:
"<string>"
,
"summary"
:
"<string>"
,
"agent"
: {
"agentId"
:
"3c90c3cc-0d44-4b50-8888-8dd25736052a"
,
"name"
:
"<string>"
},
"agentId"
:
"<string>"
,
"experimentalSettings"
:
"<unknown>"
,
"metadata"
: {},
"initialState"
: {},
"requestContext"
:
"<unknown>"
,
"sipDetails"
: {
"billedDuration"
:
"<string>"
,
"terminationReason"
:
"SIP_TERMINATION_NORMAL"
},
"inactivityMessages"
: [
{
"duration"
:
"<string>"
,
"message"
:
"<string>"
,
"endBehavior"
:
"END_BEHAVIOR_UNSPECIFIED"
}
],
"joinTimeout"
:
"30s"
,
"languageHint"
:
"<string>"
,
"maxDuration"
:
"3600s"
,
"medium"
: {
"webRtc"
: {
"dataMessages"
: {
"pong"
:
true
,
"state"
:
true
,
"transcript"
:
true
,
"clientToolInvocation"
:
true
,
"dataConnectionToolInvocation"
:
true
,
"playbackClearBuffer"
:
true
,
"callStarted"
:
true
,
"debug"
:
true
,
"callEvent"
:
true
,
"toolUsed"
:
true
}
},
"twilio"
: {
"outgoing"
: {
"to"
:
"<string>"
,
"from"
:
"<string>"
,
"additionalParams"
: {}
}
},
"serverWebSocket"
: {
"inputSampleRate"
:
123
,
"outputSampleRate"
:
123
,
"clientBufferSizeMs"
:
123
,
"dataMessages"
: {
"pong"
:
true
,
"state"
:
true
,
"transcript"
:
true
,
"clientToolInvocation"
:
true
,
"dataConnectionToolInvocation"
:
true
,
"playbackClearBuffer"
:
true
,
"callStarted"
:
true
,
"debug"
:
true
,
"callEvent"
:
true
,
"toolUsed"
:
true
}
},
"telnyx"
: {
"outgoing"
: {
"to"
:
"<string>"
,
"from"
:
"<string>"
,
"additionalParams"
: {}
}
},
"plivo"
: {
"outgoing"
: {
"to"
:
"<string>"
,
"from"
:
"<string>"
,
"additionalParams"
: {}
}
},
"exotel"
: {},
"sip"
: {
"incoming"
: {},
"outgoing"
: {
"to"
:
"<string>"
,
"from"
:
"<string>"
,
"username"
:
"<string>"
,
"password"
:
"<string>"
}
}
},
"model"
:
"ultravox-v0.6"
,
"recordingEnabled"
:
false
,
"systemPrompt"
:
"<string>"
,
"temperature"
:
0
,
"timeExceededMessage"
:
"<string>"
,
"voice"
:
"<string>"
,
"externalVoice"
: {
"elevenLabs"
: {
"voiceId"
:
"<string>"
,
"model"
:
"<string>"
,
"speed"
:
123
,
"useSpeakerBoost"
:
true
,
"style"
:
123
,
"similarityBoost"
:
123
,
"stability"
:
123
,
"pronunciationDictionaries"
: [
{
"dictionaryId"
:
"<string>"
,
"versionId"
:
"<string>"
}
],
"optimizeStreamingLatency"
:
123
,
"maxSampleRate"
:
123
},
"cartesia"
: {
"voiceId"
:
"<string>"
,
"model"
:
"<string>"
,
"speed"
:
123
,
"emotion"
:
"<string>"
,
"emotions"
: [
"<string>"
],
"generationConfig"
: {
"volume"
:
123
,
"speed"
:
123
,
"emotion"
:
"<string>"
}
},
"lmnt"
: {
"voiceId"
:
"<string>"
,
"model"
:
"<string>"
,
"speed"
:
123
,
"conversational"
:
true
},
"google"
: {
"voiceId"
:
"<string>"
,
"speakingRate"
:
123
},
"generic"
: {
"url"
:
"<string>"
,
"headers"
: {},
"body"
: {},
"responseSampleRate"
:
123
,
"responseWordsPerMinute"
:
123
,
"responseMimeType"
:
"<string>"
,
"jsonAudioFieldPath"
:
"<string>"
,
"jsonByteEncoding"
:
"JSON_BYTE_ENCODING_UNSPECIFIED"
}
},
"transcriptOptional"
:
true
,
"vadSettings"
: {
"turnEndpointDelay"
:
"<string>"
,
"minimumTurnDuration"
:
"<string>"
,
"minimumInterruptionDuration"
:
"<string>"
,
"frameActivationThreshold"
:
123
},
"dataConnectionConfig"
: {
"websocketUrl"
:
"<string>"
,
"audioConfig"
: {
"sampleRate"
:
123
,
"channelMode"
:
"CHANNEL_MODE_UNSPECIFIED"
},
"dataMessages"
: {
"pong"
:
true
,
"state"
:
true
,
"transcript"
:
true
,
"clientToolInvocation"
:
true
,
"dataConnectionToolInvocation"
:
true
,
"playbackClearBuffer"
:
true
,
"callStarted"
:
true
,
"debug"
:
true
,
"callEvent"
:
true
,
"toolUsed"
:
true
}
},
"callbacks"
: {
"joined"
: {
"url"
:
"<string>"
,
"secrets"
: [
"<string>"
]
},
"ended"
: {
"url"
:
"<string>"
,
"secrets"
: [
"<string>"
]
},
"billed"
: {
"url"
:
"<string>"
,
"secrets"
: [
"<string>"
]
}
}
}
Authorizations
​
X-API-Key
string
header
required
API key
Query Parameters
​
enableGreetingPrompt
boolean
default:
true
Adds a prompt for a greeting if there's not an initial message that the model would naturally respond to (a user message or tool result).
​
priorCallId
string<uuid>
The UUID of a prior call. When specified, the new call will use the same properites as the prior call unless overriden in this request's body. The new call will also use the prior call's message history as its own initial_messages. (It's illegal to also set initial_messages in the body.)
Body
application/json
A request to start a call.
​
systemPrompt
string
The system prompt provided to the model during generations.
​
temperature
number<float>
The model temperature, between 0 and 1. Defaults to 0.
​
model
string
The model used for generations. Currently defaults to ultravox-v0.6.
​
voice
string
The ID (or name if unique) of the voice the agent should use for this call.
​
externalVoice
object
A voice not known to Ultravox Realtime that can nonetheless be used for this call.
Your account must have an API key set for the provider of the voice.
Either this or
voice
may be set, but not both.
Show
child attributes
​
externalVoice.
elevenLabs
object
A voice served by ElevenLabs.
Show
child attributes
​
externalVoice.elevenLabs.
voiceId
string
The ID of the voice in ElevenLabs.
​
externalVoice.elevenLabs.
model
string
The ElevenLabs model to use.
​
externalVoice.elevenLabs.
speed
number<float>
The speaking rate. Must be between 0.7 and 1.2. Defaults to 1.
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.speed
​
externalVoice.elevenLabs.
useSpeakerBoost
boolean
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.use_speaker_boost
​
externalVoice.elevenLabs.
style
number<float>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.style
​
externalVoice.elevenLabs.
similarityBoost
number<float>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.similarity_boost
​
externalVoice.elevenLabs.
stability
number<float>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.stability
​
externalVoice.elevenLabs.
pronunciationDictionaries
object[]
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.pronunciation_dictionary_locators
Show
child attributes
​
externalVoice.elevenLabs.pronunciationDictionaries.
dictionaryId
string
The dictionary's ID.
​
externalVoice.elevenLabs.pronunciationDictionaries.
versionId
string
The dictionary's version.
​
externalVoice.elevenLabs.
optimizeStreamingLatency
integer<int32>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.query.optimize_streaming_latency.optimize_streaming_latency
​
externalVoice.elevenLabs.
maxSampleRate
integer<int32>
The maximum sample rate Ultravox will try to use. ElevenLabs limits your allowed sample rate
based on your tier. See
https://elevenlabs.io/pricing#pricing-table
(and click "Show API details")
​
externalVoice.
cartesia
object
A voice served by Cartesia.
Show
child attributes
​
externalVoice.cartesia.
voiceId
string
The ID of the voice in Cartesia.
​
externalVoice.cartesia.
model
string
The Cartesia model to use.
​
externalVoice.cartesia.
speed
number<float>
(Deprecated) The speaking rate. Must be between -1 and 1. Defaults to 0.
​
externalVoice.cartesia.
emotion
string
(Deprecated) Use generation_config.emotion instead.
​
externalVoice.cartesia.
emotions
string[]
(Deprecated) Use generation_config.emotion instead.
​
externalVoice.cartesia.
generationConfig
object
Configure the various attributes of the generated speech.
Show
child attributes
​
externalVoice.cartesia.generationConfig.
volume
number<float>
Adjust the volume of the generated speech between 0.5x and 2.0x the original volume (default is 1.0x). Valid values are between [0.5, 2.0] inclusive.
​
externalVoice.cartesia.generationConfig.
speed
number<float>
Adjust the speed of the generated speech between 0.6x and 2.0x the original speed (default is 1.0x). Valid values are between [0.6, 1.5] inclusive.
​
externalVoice.cartesia.generationConfig.
emotion
string
The primary emotions are neutral, calm, angry, content, sad, scared. For more options, see Prompting Sonic-3.
​
externalVoice.
lmnt
object
A voice served by LMNT.
Show
child attributes
​
externalVoice.lmnt.
voiceId
string
The ID of the voice in LMNT.
​
externalVoice.lmnt.
model
string
The LMNT model to use.
​
externalVoice.lmnt.
speed
number<float>
The speaking rate. Must be between 0.25 and 2. Defaults to 1.
See
https://docs.lmnt.com/api-reference/speech/synthesize-speech-bytes#body-speed
​
externalVoice.lmnt.
conversational
boolean
See
https://docs.lmnt.com/api-reference/speech/synthesize-speech-bytes#body-conversational
​
externalVoice.
google
object
A voice served by Google, using bidirectional streaming.
(For non-streaming or output-only streaming, use generic.)
Show
child attributes
​
externalVoice.google.
voiceId
string
The ID (name) of the voice in Google, e.g. "en-US-Chirp3-HD-Charon".
​
externalVoice.google.
speakingRate
number<float>
The speaking rate. Must be between 0.25 and 2. Defaults to 1.
See
https://cloud.google.com/python/docs/reference/texttospeech/latest/google.cloud.texttospeech_v1.types.StreamingAudioConfig
​
externalVoice.
generic
object
A voice served by a generic REST-based TTS API.
Show
child attributes
​
externalVoice.generic.
url
string
The endpoint to which requests are sent.
​
externalVoice.generic.
headers
object
Headers to include in the request.
Show
child attributes
​
externalVoice.generic.headers.
{key}
string
​
externalVoice.generic.
body
object
The request body to send. Some field should include a placeholder for text
represented as {text}. The placeholder will be replaced with the text to synthesize.
​
externalVoice.generic.
responseSampleRate
integer<int32>
The sample rate of the audio returned by the API.
​
externalVoice.generic.
responseWordsPerMinute
integer<int32>
An estimate of the speaking rate of the returned audio in words per minute. This is
used for transcript timing while audio is streamed in the response. (Once the response
is complete, Ultravox Realtime uses the real audio duration to adjust the timing.)
Defaults to 150 and is unused for non-streaming responses.
​
externalVoice.generic.
responseMimeType
string
The real mime type of the content returned by the API. If unset, the Content-Type response header
will be used. This is useful for APIs whose response bodies don't strictly adhere to what the
API claims via header. For example, if your API claims to return audio/wav but omits the WAV
header (thus really returning raw PCM), set this to audio/l16. Similarly, if your API claims to
return JSON but actually streams JSON Lines, set this to application/jsonl.
​
externalVoice.generic.
jsonAudioFieldPath
string
For JSON responses, the path to the field containing base64-encoded audio data. The data must
be PCM audio, optionally with a WAV header.
​
externalVoice.generic.
jsonByteEncoding
enum<string>
For JSON responses, how audio bytes are encoded into the json_audio_field_path string.
Defaults to base64. Also supports hex.
Available options
:
JSON_BYTE_ENCODING_UNSPECIFIED
,
JSON_BYTE_ENCODING_BASE64
,
JSON_BYTE_ENCODING_HEX
​
languageHint
string
A BCP47 language code that may be used to guide speech recognition and synthesis.
​
initialMessages
object[]
The conversation history to start from for this call.
Show
child attributes
​
initialMessages.
role
enum<string>
The message's role.
Available options
:
MESSAGE_ROLE_UNSPECIFIED
,
MESSAGE_ROLE_USER
,
MESSAGE_ROLE_AGENT
,
MESSAGE_ROLE_TOOL_CALL
,
MESSAGE_ROLE_TOOL_RESULT
​
initialMessages.
text
string
The message text for user and agent messages, tool arguments for tool_call messages, tool results for tool_result messages.
​
initialMessages.
invocationId
string
The invocation ID for tool messages. Used to pair tool calls with their results.
​
initialMessages.
toolName
string
The tool name for tool messages.
​
initialMessages.
errorDetails
string
For failed tool calls, additional debugging information. While the text field is
presented to the model so it can respond to failures gracefully, the full details
are only exposed via the Ultravox REST API.
​
initialMessages.
medium
enum<string>
The medium of the message.
Available options
:
MESSAGE_MEDIUM_UNSPECIFIED
,
MESSAGE_MEDIUM_VOICE
,
MESSAGE_MEDIUM_TEXT
​
initialMessages.
callStageMessageIndex
integer<int32>
The index of the message within the call stage.
​
initialMessages.
callStageId
string
The call stage this message appeared in.
​
initialMessages.
callState
object
If the message updated the call state, the new call state.
​
initialMessages.
timespan
object
The timespan during the call when this message occurred, according
to the input audio stream.
This is only set for messages that occurred during the call (stage)
and not for messages in the call's (call stage's) initial messages.
Show
child attributes
​
initialMessages.timespan.
start
string
The offset relative to the start of the call.
​
initialMessages.timespan.
end
string
The offset relative to the start of the call.
​
initialMessages.
wallClockTimespan
object
The timespan during the call when this message occurred, according
the wall clock, relative to the call's joined time.
This is only set for messages that occurred during the call (stage)
and not for messages in the call's (call stage's) initial messages.
Show
child attributes
​
initialMessages.wallClockTimespan.
start
string
The offset relative to the start of the call.
​
initialMessages.wallClockTimespan.
end
string
The offset relative to the start of the call.
​
joinTimeout
string
A timeout for joining the call. Defaults to 30 seconds.
​
maxDuration
string
The maximum duration of the call. Defaults to 1 hour.
​
timeExceededMessage
string
What the agent should say immediately before hanging up if the call's time limit is reached.
​
inactivityMessages
object[]
Messages spoken by the agent when the user is inactive for the specified duration.
Durations are cumulative, so a message m > 1 with duration 30s will be spoken 30 seconds after message m-1.
Show
child attributes
​
inactivityMessages.
duration
string
The duration after which the message should be spoken.
​
inactivityMessages.
message
string
The message to speak.
​
inactivityMessages.
endBehavior
enum<string>
The behavior to exhibit when the message is finished being spoken.
Available options
:
END_BEHAVIOR_UNSPECIFIED
,
END_BEHAVIOR_HANG_UP_SOFT
,
END_BEHAVIOR_HANG_UP_STRICT
​
selectedTools
object[]
The tools available to the agent for (the first stage of) this call.
Show
child attributes
​
selectedTools.
toolId
string
The ID of an existing base tool.
​
selectedTools.
toolName
string
The name of an existing base tool. The name must uniquely identify the tool.
​
selectedTools.
temporaryTool
object
A temporary tool definition, available only for this call (and subsequent
calls created using priorCallId without overriding selected tools). Exactly one
implementation (http or client) should be set. See the 'Base Tool Definition'
schema for more details.
Show
child attributes
​
selectedTools.temporaryTool.
modelToolName
string
The name of the tool, as presented to the model. Must match ^[a-zA-Z0-9_-]{1,64}$.
​
selectedTools.temporaryTool.
description
string
The description of the tool.
​
selectedTools.temporaryTool.
dynamicParameters
object[]
The parameters that the tool accepts.
Show
child attributes
​
selectedTools.temporaryTool.dynamicParameters.
name
string
The name of the parameter.
​
selectedTools.temporaryTool.dynamicParameters.
location
enum<string>
Where the parameter is used.
Available options
:
PARAMETER_LOCATION_UNSPECIFIED
,
PARAMETER_LOCATION_QUERY
,
PARAMETER_LOCATION_PATH
,
PARAMETER_LOCATION_HEADER
,
PARAMETER_LOCATION_BODY
​
selectedTools.temporaryTool.dynamicParameters.
schema
object
The JsonSchema definition of the parameter. This typically
includes things like type, description, enum values, format,
other restrictions, etc.
​
selectedTools.temporaryTool.dynamicParameters.
required
boolean
Whether the parameter is required.
​
selectedTools.temporaryTool.
staticParameters
object[]
The static parameters added when the tool is invoked.
Show
child attributes
​
selectedTools.temporaryTool.staticParameters.
name
string
The name of the parameter.
​
selectedTools.temporaryTool.staticParameters.
location
enum<string>
Where the parameter is used.
Available options
:
PARAMETER_LOCATION_UNSPECIFIED
,
PARAMETER_LOCATION_QUERY
,
PARAMETER_LOCATION_PATH
,
PARAMETER_LOCATION_HEADER
,
PARAMETER_LOCATION_BODY
​
selectedTools.temporaryTool.staticParameters.
value
any
The value of the parameter.
​
selectedTools.temporaryTool.
automaticParameters
object[]
Additional parameters that are automatically set by the system when the tool is invoked.
Show
child attributes
​
selectedTools.temporaryTool.automaticParameters.
name
string
The name of the parameter.
​
selectedTools.temporaryTool.automaticParameters.
location
enum<string>
Where the parameter is used.
Available options
:
PARAMETER_LOCATION_UNSPECIFIED
,
PARAMETER_LOCATION_QUERY
,
PARAMETER_LOCATION_PATH
,
PARAMETER_LOCATION_HEADER
,
PARAMETER_LOCATION_BODY
​
selectedTools.temporaryTool.automaticParameters.
knownValue
enum<string>
The value to set for the parameter.
Available options
:
KNOWN_PARAM_UNSPECIFIED
,
KNOWN_PARAM_CALL_ID
,
KNOWN_PARAM_CONVERSATION_HISTORY
,
KNOWN_PARAM_OUTPUT_SAMPLE_RATE
,
KNOWN_PARAM_CALL_STATE
,
KNOWN_PARAM_CALL_STAGE_ID
​
selectedTools.temporaryTool.
requirements
object
Requirements that must be fulfilled when creating a call for the tool to be used.
Show
child attributes
​
selectedTools.temporaryTool.requirements.
httpSecurityOptions
object
Security requirements for an HTTP tool.
Show
child attributes
​
selectedTools.temporaryTool.requirements.httpSecurityOptions.
options
object[]
The options for security. Only one must be met. The first one that can be
satisfied will be used in general. The single exception to this rule is
that we always prefer a non-empty set of requirements over an empty set
unless no non-empty set can be satisfied.
Show
child attributes
​
selectedTools.temporaryTool.requirements.httpSecurityOptions.options.
requirements
object
Requirements keyed by name.
Show
child attributes
​
selectedTools.temporaryTool.requirements.httpSecurityOptions.options.requirements.
{key}
object
A single security requirement that must be met for a tool to be available. Exactly one
of query_api_key, header_api_key, or http_auth should be set.
Show
child attributes
​
selectedTools.temporaryTool.requirements.httpSecurityOptions.options.requirements.{key}.
queryApiKey
object
An API key must be added to the query string.
Show
child attributes
​
selectedTools.temporaryTool.requirements.httpSecurityOptions.options.requirements.{key}.queryApiKey.
name
string
The name of the query parameter.
​
selectedTools.temporaryTool.requirements.httpSecurityOptions.options.requirements.{key}.
headerApiKey
object
An API key must be added to a custom header.
Show
child attributes
​
selectedTools.temporaryTool.requirements.httpSecurityOptions.options.requirements.{key}.headerApiKey.
name
string
The name of the header.
​
selectedTools.temporaryTool.requirements.httpSecurityOptions.options.requirements.{key}.
httpAuth
object
The HTTP authentication header must be added.
Show
child attributes
​
selectedTools.temporaryTool.requirements.httpSecurityOptions.options.requirements.{key}.httpAuth.
scheme
string
The scheme of the HTTP authentication, e.g. "Bearer".
​
selectedTools.temporaryTool.requirements.httpSecurityOptions.options.
ultravoxCallTokenRequirement
object
An additional special security requirement that can be automatically fulfilled
during call creation. If a tool has this requirement set, a token identifying
the call and relevant scopes will be created during call creation and set as
an X-Ultravox-Call-Token header when the tool is invoked.
Such tokens are only verifiable by the Ultravox service and primarily exist
for built-in tools (though it's possible for third-party tools that wrap a
built-in tool to make use of them as well).
Show
child attributes
​
selectedTools.temporaryTool.requirements.httpSecurityOptions.options.ultravoxCallTokenRequirement.
scopes
string[]
The scopes that must be present in the token.
​
selectedTools.temporaryTool.requirements.
requiredParameterOverrides
string[]
Dynamic parameters that must be overridden with an explicit (static) value.
​
selectedTools.temporaryTool.
timeout
string
The maximum amount of time the tool is allowed for execution. The conversation is frozen
while tools run, so prefer sticking to the default unless you're comfortable with that
consequence. If your tool is too slow for the default and can't be made faster, still try to
keep this timeout as low as possible.
​
selectedTools.temporaryTool.
precomputable
boolean
The tool is guaranteed to be non-mutating, repeatable, and free of side-effects. Such tools
can safely be executed speculatively, reducing their effective latency. However, the fact they
were called may not be reflected in the call history if their result ends up unused.
​
selectedTools.temporaryTool.
http
object
Details for an HTTP tool.
Show
child attributes
​
selectedTools.temporaryTool.http.
baseUrlPattern
string
The base URL pattern for the tool, possibly with placeholders for path parameters.
​
selectedTools.temporaryTool.http.
httpMethod
string
The HTTP method for the tool.
​
selectedTools.temporaryTool.
client
object
Details for a client-implemented tool. Only body parameters are allowed
for client tools.
​
selectedTools.temporaryTool.
dataConnection
object
Details for a tool implemented via a data connection websocket. Only body
parameters are allowed for data connection tools.
​
selectedTools.temporaryTool.
defaultReaction
enum<string>
Indicates the default for how the agent should proceed after the tool is invoked.
Can be overridden by the tool implementation via the X-Ultravox-Agent-Reaction
header.
Available options
:
AGENT_REACTION_UNSPECIFIED
,
AGENT_REACTION_SPEAKS
,
AGENT_REACTION_LISTENS
,
AGENT_REACTION_SPEAKS_ONCE
​
selectedTools.temporaryTool.
staticResponse
object
Static response to a tool. When this is used, this response will be returned
without waiting for the tool's response.
Show
child attributes
​
selectedTools.temporaryTool.staticResponse.
responseText
string
The predefined text response to be returned immediately
​
selectedTools.
nameOverride
string
An override for the model_tool_name. This is primarily useful when using
multiple instances of the same durable tool (presumably with different
parameter overrides.) The set of tools used within a call must have a unique
set of model names and every name must match this pattern: ^[a-zA-Z0-9_-]{1,64}$.
​
selectedTools.
descriptionOverride
string
An override for the tool's description, as presented to the model. This is primarily
useful when using a built-in tool whose description you want to tweak to better fit
the rest of your prompt.
​
selectedTools.
authTokens
object
Auth tokens used to satisfy the tool's security requirements.
Show
child attributes
​
selectedTools.authTokens.
{key}
string
​
selectedTools.
parameterOverrides
object
Static values to use in place of dynamic parameters. Any parameter included
here will be hidden from the model and the static value will be used instead.
Some tools may require certain parameters to be overridden, but any parameter
can be overridden regardless of whether it is required to be.
Show
child attributes
​
selectedTools.parameterOverrides.
{key}
any
Represents a dynamically typed value which can be either null, a number, a string, a boolean, a recursive struct value, or a list of values.
​
selectedTools.
transitionId
string
For internal use. Relates this tool to a stage transition definition within a call template for attribution.
​
medium
object
The medium used for this call.
Show
child attributes
​
medium.
webRtc
object
The call will use WebRTC with the Ultravox client SDK.
This is the default.
Show
child attributes
​
medium.webRtc.
dataMessages
object
Controls which data messages are enabled for the call.
Show
child attributes
​
medium.webRtc.dataMessages.
pong
boolean
Responds to a ping message. (Default: enabled)
​
medium.webRtc.dataMessages.
state
boolean
Indicates that the agent state has changed. (Default: enabled)
​
medium.webRtc.dataMessages.
transcript
boolean
Provides transcripts of the user and agent speech. (Default: enabled)
​
medium.webRtc.dataMessages.
clientToolInvocation
boolean
Requests a client-implemented tool invocation. (Default: enabled)
​
medium.webRtc.dataMessages.
dataConnectionToolInvocation
boolean
Requests a data-connection-implemented tool invocation. (Default: enabled for data connections, disabled otherwise)
​
medium.webRtc.dataMessages.
playbackClearBuffer
boolean
Requests the client-side audio buffer to be cleared. (Default: enabled for websocket connections, disabled otherwise)
​
medium.webRtc.dataMessages.
callStarted
boolean
Provides information about the call when it starts. (Default: enabled)
​
medium.webRtc.dataMessages.
debug
boolean
Communicates debug information. (Default: disabled)
​
medium.webRtc.dataMessages.
callEvent
boolean
Indicates that a call event has been recorded. (Default: disabled)
​
medium.webRtc.dataMessages.
toolUsed
boolean
Indicates that a tool was used. (Default: disabled)
​
medium.
twilio
object
The call will use Twilio's "Media Streams" protocol.
Once you have a join URL from starting a call, include it in your
TwiML like so:
This works for both inbound and outbound calls.
Show
child attributes
​
medium.twilio.
outgoing
object
If set, Ultravox will directly create a call with Twilio. Twilio must be configured
for the requesting account.
Show
child attributes
​
medium.twilio.outgoing.
to
string
The phone number, in E.164 format (e.g. +14155552671), (or sip address) to call.
​
medium.twilio.outgoing.
from
string
The phone number or client identifier to use as the caller id. If
to
is a phone
number,
from
must be a phone number owned by your Twilio account.
​
medium.twilio.outgoing.
additionalParams
object
Additional parameters to include in the Twilio call creation request.
See
https://www.twilio.com/docs/voice/api/call-resource#request-body-parameters
​
medium.
serverWebSocket
object
The call will use a plain websocket connection. This is unlikely to yield an acceptable user
experience if used from a browser or mobile client, but may be suitable for a
server-to-server connection. This option provides a simple way to connect your own server to
an Ultravox inference instance.
Show
child attributes
​
medium.serverWebSocket.
inputSampleRate
integer<int32>
The sample rate for input (user) audio. Required.
​
medium.serverWebSocket.
outputSampleRate
integer<int32>
The desired sample rate for output (agent) audio. If unset, defaults to the input_sample_rate.
​
medium.serverWebSocket.
clientBufferSizeMs
integer<int32>
The size of the client-side audio buffer in milliseconds. Smaller buffers allow for faster
interruptions but may cause audio underflow if network latency fluctuates too greatly. For
the best of both worlds, set this to some large value (e.g. 30000) and implement support for
playback_clear_buffer messages. Defaults to 60.
​
medium.serverWebSocket.
dataMessages
object
Controls which data messages are enabled for the call.
Show
child attributes
​
medium.serverWebSocket.dataMessages.
pong
boolean
Responds to a ping message. (Default: enabled)
​
medium.serverWebSocket.dataMessages.
state
boolean
Indicates that the agent state has changed. (Default: enabled)
​
medium.serverWebSocket.dataMessages.
transcript
boolean
Provides transcripts of the user and agent speech. (Default: enabled)
​
medium.serverWebSocket.dataMessages.
clientToolInvocation
boolean
Requests a client-implemented tool invocation. (Default: enabled)
​
medium.serverWebSocket.dataMessages.
dataConnectionToolInvocation
boolean
Requests a data-connection-implemented tool invocation. (Default: enabled for data connections, disabled otherwise)
​
medium.serverWebSocket.dataMessages.
playbackClearBuffer
boolean
Requests the client-side audio buffer to be cleared. (Default: enabled for websocket connections, disabled otherwise)
​
medium.serverWebSocket.dataMessages.
callStarted
boolean
Provides information about the call when it starts. (Default: enabled)
​
medium.serverWebSocket.dataMessages.
debug
boolean
Communicates debug information. (Default: disabled)
​
medium.serverWebSocket.dataMessages.
callEvent
boolean
Indicates that a call event has been recorded. (Default: disabled)
​
medium.serverWebSocket.dataMessages.
toolUsed
boolean
Indicates that a tool was used. (Default: disabled)
​
medium.
telnyx
object
The call will use Telnyx's media streaming protocol.
Once you have a join URL from starting a call, include it in your
TexML like so:
This works for both inbound and outbound calls.
Show
child attributes
​
medium.telnyx.
outgoing
object
If set, Ultravox will directly create a call with Telnyx. Telnyx must be configured
for the requesting account.
Show
child attributes
​
medium.telnyx.outgoing.
to
string
The phone number to call in E.164 format (e.g. +14155552671).
​
medium.telnyx.outgoing.
from
string
The phone number initiating the call.
​
medium.telnyx.outgoing.
additionalParams
object
Additional parameters to include in the Telnyx call creation request.
See
https://developers.telnyx.com/api/call-scripting/initiate-texml-call
​
medium.
plivo
object
The call will use Plivo's AudioStreams protocol.
Once you have a join URL from starting a call, include it in your
Plivo XML like so:
${your-join-url}
This works for both inbound and outbound calls.
Show
child attributes
​
medium.plivo.
outgoing
object
If set, Ultravox will directly create a call with Plivo. Plivo must be configured
for the requesting account.
Show
child attributes
​
medium.plivo.outgoing.
to
string
The phone number(s) or sip URI(s) to call, separated by
<
if multiple.
​
medium.plivo.outgoing.
from
string
The phone number initiating the call, in E.164 format (e.g. +14155552671).
​
medium.plivo.outgoing.
additionalParams
object
Additional parameters to include in the Plivo call creation request.
See
https://www.plivo.com/docs/voice/api/call/make-a-call
​
medium.
exotel
object
The call will use Exotel's "Voicebot" protocol.
Once you have a join URL from starting a call, provide it to Exotel as the wss target URL
for your Voicebot (either directly or more likely dynamically from your own server).
​
medium.
sip
object
The call will be connected using Session Initiation Protocol (SIP). Note that SIP incurs
additional charges and must be enabled for your account.
Show
child attributes
​
medium.sip.
incoming
object
Details for an incoming SIP call.
​
medium.sip.
outgoing
object
Details for an outgoing SIP call. Ultravox will initiate this call (and there will be no joinUrl).
Show
child attributes
​
medium.sip.outgoing.
to
string
The SIP URI to connect to. (Phone numbers are not allowed.)
​
medium.sip.outgoing.
from
string
The SIP URI to connect from. This is the "from" field in the SIP INVITE.
​
medium.sip.outgoing.
username
string
The SIP username to use for authentication.
​
medium.sip.outgoing.
password
string
The password for the specified username.
​
recordingEnabled
boolean
Whether the call should be recorded.
​
firstSpeaker
enum<string>
Who should talk first when the call starts. Typically set to FIRST_SPEAKER_USER for outgoing
calls and left as the default (FIRST_SPEAKER_AGENT) otherwise.
Deprecated. Prefer
firstSpeakerSettings
. If both are set, they must match.
Available options
:
FIRST_SPEAKER_UNSPECIFIED
,
FIRST_SPEAKER_AGENT
,
FIRST_SPEAKER_USER
​
transcriptOptional
boolean
Indicates whether a transcript is optional for the call.
​
initialOutputMedium
enum<string>
The medium to use for the call initially. May be altered by the client later.
Defaults to voice.
Available options
:
MESSAGE_MEDIUM_UNSPECIFIED
,
MESSAGE_MEDIUM_VOICE
,
MESSAGE_MEDIUM_TEXT
​
vadSettings
object
VAD settings for the call.
Show
child attributes
​
vadSettings.
turnEndpointDelay
string
The minimum amount of time the agent will wait to respond after the user seems to be done
speaking. Increasing this value will make the agent less eager to respond, which may increase
perceived response latency but will also make the agent less likely to jump in before the user
is really done speaking.
Built-in VAD currently operates on 32ms frames, so only multiples of 32ms are meaningful.
(Anything from 1ms to 31ms will produce the same result.)
Defaults to "0.384s" (384ms) as a starting point, but there's nothing special about this value
aside from it corresponding to 12 VAD frames.
​
vadSettings.
minimumTurnDuration
string
The minimum duration of user speech required to be considered a user turn.
Increasing this value will cause the agent to ignore short user audio. This may be useful in
particularly noisy environments, but it comes at the cost of possibly ignoring very short
user responses such as "yes" or "no".
Defaults to "0s" meaning the agent considers all user audio inputs (that make it through
built-in noise cancellation).
​
vadSettings.
minimumInterruptionDuration
string
The minimum duration of user speech required to interrupt the agent. This works the same way
as minimumTurnDuration, but allows for a higher threshold for interrupting the agent. (This
value will be ignored if it is less than minimumTurnDuration.)
Defaults to "0.09s" (90ms) as a starting point, but there's nothing special about this value.
​
vadSettings.
frameActivationThreshold
number<float>
The threshold for the VAD to consider a frame as speech. This is a value between 0.1 and 1.
Miniumum value is 0.1, which is the default value.
​
firstSpeakerSettings
object
The settings for the initial message to get a conversation started.
Defaults to
agent: {}
which means the agent will start the conversation with an
(interruptible) greeting generated based on the system prompt and any initial messages.
(If first_speaker is set and this is not, first_speaker will be used instead.)
Show
child attributes
​
firstSpeakerSettings.
user
object
If set, the user should speak first.
Show
child attributes
​
firstSpeakerSettings.user.
fallback
object
If set, the agent will start the conversation itself if the user doesn't start
speaking within the given delay.
Show
child attributes
​
firstSpeakerSettings.user.fallback.
delay
string
How long the agent should wait before starting the conversation itself.
​
firstSpeakerSettings.user.fallback.
text
string
A specific greeting the agent should say.
​
firstSpeakerSettings.user.fallback.
prompt
string
A prompt for the agent to generate a greeting.
​
firstSpeakerSettings.
agent
object
If set, the agent should speak first.
Show
child attributes
​
firstSpeakerSettings.agent.
uninterruptible
boolean
Whether the user should be prevented from interrupting the agent's first message.
Defaults to false (meaning the agent is interruptible as usual).
​
firstSpeakerSettings.agent.
text
string
A specific greeting the agent should say.
​
firstSpeakerSettings.agent.
prompt
string
A prompt for the agent to generate a greeting.
​
firstSpeakerSettings.agent.
delay
string
If set, the agent will wait this long before starting its greeting. This may be useful
for ensuring the user is ready.
​
experimentalSettings
object
Experimental settings for the call.
​
metadata
object
Optional metadata key-value pairs to associate with the call. All values must be strings.
Keys may not start with "ultravox.", which is reserved for system-provided metadata.
Show
child attributes
​
metadata.
{key}
string
​
initialState
object
The initial state of the call stage which is readable/writable by tools.
​
dataConnection
object
Data connection configuration.
Show
child attributes
​
dataConnection.
websocketUrl
string
The websocket URL to which the session will connect to stream data messages.
​
dataConnection.
audioConfig
object
Audio configuration for the data connection. If not set, no audio will be sent.
Show
child attributes
​
dataConnection.audioConfig.
sampleRate
integer<int32>
The sample rate of the audio stream. If not set, will default to 16000.
​
dataConnection.audioConfig.
channelMode
enum<string>
The audio channel mode to use. CHANNEL_MODE_MIXED will combine user and agent audio
into a single mono output while CHANNEL_MODE_SEPARATED will result in stereo audio
where user and agent are separated. The latter is the default.
Available options
:
CHANNEL_MODE_UNSPECIFIED
,
CHANNEL_MODE_MIXED
,
CHANNEL_MODE_SEPARATED
​
dataConnection.
dataMessages
object
Controls which data messages are enabled for the data connection.
Show
child attributes
​
dataConnection.dataMessages.
pong
boolean
Responds to a ping message. (Default: enabled)
​
dataConnection.dataMessages.
state
boolean
Indicates that the agent state has changed. (Default: enabled)
​
dataConnection.dataMessages.
transcript
boolean
Provides transcripts of the user and agent speech. (Default: enabled)
​
dataConnection.dataMessages.
clientToolInvocation
boolean
Requests a client-implemented tool invocation. (Default: enabled)
​
dataConnection.dataMessages.
dataConnectionToolInvocation
boolean
Requests a data-connection-implemented tool invocation. (Default: enabled for data connections, disabled otherwise)
​
dataConnection.dataMessages.
playbackClearBuffer
boolean
Requests the client-side audio buffer to be cleared. (Default: enabled for websocket connections, disabled otherwise)
​
dataConnection.dataMessages.
callStarted
boolean
Provides information about the call when it starts. (Default: enabled)
​
dataConnection.dataMessages.
debug
boolean
Communicates debug information. (Default: disabled)
​
dataConnection.dataMessages.
callEvent
boolean
Indicates that a call event has been recorded. (Default: disabled)
​
dataConnection.dataMessages.
toolUsed
boolean
Indicates that a tool was used. (Default: disabled)
​
callbacks
object
Callbacks for call lifecycle events.
Show
child attributes
​
callbacks.
joined
object
Callback invoked when the call is joined.
Show
child attributes
​
callbacks.joined.
url
string
The URL to invoke.
​
callbacks.joined.
secrets
string[]
Secrets to use to signing the callback request.
​
callbacks.
ended
object
Callback invoked when the call has ended.
Show
child attributes
​
callbacks.ended.
url
string
The URL to invoke.
​
callbacks.ended.
secrets
string[]
Secrets to use to signing the callback request.
​
callbacks.
billed
object
Callback invoked when the call is billed.
Show
child attributes
​
callbacks.billed.
url
string
The URL to invoke.
​
callbacks.billed.
secrets
string[]
Secrets to use to signing the callback request.
Response
201 - application/json
​
callId
string<uuid>
required
​
clientVersion
string | null
required
The version of the client that joined this call.
​
created
string<date-time>
required
​
joined
string<date-time> | null
required
​
ended
string<date-time> | null
required
​
endReason
enum<string>
any
required
The reason the call ended.
unjoined
- Client never joined
hangup
- Client hung up
agent_hangup
- Agent hung up
timeout
- Call timed out
connection_error
- Connection error
system_error
- System error
Available options
:
unjoined
,
hangup
,
agent_hangup
,
timeout
,
connection_error
,
system_error
​
billedDuration
string | null
required
​
billingStatus
enum<string>
required
BILLING_STATUS_PENDING* - The call hasn't been billed yet, but will be in the future. This is the case for ongoing calls for example. (Note: Calls created before May 28, 2025 may have this status even if they were billed.)
BILLING_STATUS_FREE_CONSOLE* - The call was free because it was initiated on
https://app.ultravox.ai
.
BILLING_STATUS_FREE_ZERO_EFFECTIVE_DURATION* - The call was free because its effective duration was zero. (Note: There may still be a non-zero sip bill in this case.)
BILLING_STATUS_FREE_MINUTES* - The call was unbilled but counted against the account's free minutes. (Note: There may still be a non-zero sip bill in this case.)
BILLING_STATUS_FREE_SYSTEM_ERROR* - The call was free because it ended due to a system error.
BILLING_STATUS_FREE_OTHER* - The call is in an undocumented free billing state.
BILLING_STATUS_BILLED* - The call was billed. See billedDuration for the billed duration.
BILLING_STATUS_REFUNDED* - The call was billed but was later refunded.
BILLING_STATUS_UNSPECIFIED* - The call is in an unexpected billing state. Please contact support.
Available options
:
BILLING_STATUS_PENDING
,
BILLING_STATUS_FREE_CONSOLE
,
BILLING_STATUS_FREE_ZERO_EFFECTIVE_DURATION
,
BILLING_STATUS_FREE_MINUTES
,
BILLING_STATUS_FREE_SYSTEM_ERROR
,
BILLING_STATUS_FREE_OTHER
,
BILLING_STATUS_BILLED
,
BILLING_STATUS_REFUNDED
,
BILLING_STATUS_UNSPECIFIED
​
firstSpeaker
enum<string>
required
deprecated
Who was supposed to talk first when the call started. Typically set to FIRST_SPEAKER_USER for outgoing calls and left as the default (FIRST_SPEAKER_AGENT) otherwise.
Available options
:
FIRST_SPEAKER_AGENT
,
FIRST_SPEAKER_USER
​
firstSpeakerSettings
object
required
Settings for the initial message to get the call started.
Show
child attributes
​
firstSpeakerSettings.
user
object
If set, the user should speak first.
Show
child attributes
​
firstSpeakerSettings.user.
fallback
object
If set, the agent will start the conversation itself if the user doesn't start
speaking within the given delay.
Show
child attributes
​
firstSpeakerSettings.user.fallback.
delay
string
How long the agent should wait before starting the conversation itself.
​
firstSpeakerSettings.user.fallback.
text
string
A specific greeting the agent should say.
​
firstSpeakerSettings.user.fallback.
prompt
string
A prompt for the agent to generate a greeting.
​
firstSpeakerSettings.
agent
object
If set, the agent should speak first.
Show
child attributes
​
firstSpeakerSettings.agent.
uninterruptible
boolean
Whether the user should be prevented from interrupting the agent's first message.
Defaults to false (meaning the agent is interruptible as usual).
​
firstSpeakerSettings.agent.
text
string
A specific greeting the agent should say.
​
firstSpeakerSettings.agent.
prompt
string
A prompt for the agent to generate a greeting.
​
firstSpeakerSettings.agent.
delay
string
If set, the agent will wait this long before starting its greeting. This may be useful
for ensuring the user is ready.
​
initialOutputMedium
enum<string>
required
The medium used initially by the agent. May later be changed by the client.
Available options
:
MESSAGE_MEDIUM_VOICE
,
MESSAGE_MEDIUM_TEXT
​
joinUrl
string | null
required
​
shortSummary
string | null
required
A short summary of the call.
​
summary
string | null
required
A summary of the call.
​
agent
object
required
The agent used for this call.
Show
child attributes
​
agent.
agentId
string<uuid>
required
​
agent.
name
string
required
​
agentId
string | null
required
The ID of the agent used for this call.
​
experimentalSettings
any
required
Experimental settings for the call.
​
metadata
object
required
Optional metadata key-value pairs to associate with the call. All values must be strings.
Show
child attributes
​
metadata.
{key}
string
​
initialState
object
required
The initial state of the call which is readable/writable by tools.
Show
child attributes
​
initialState.
{key}
any
​
requestContext
any
required
​
sipDetails
object
required
SIP details for the call, if applicable.
Show
child attributes
​
sipDetails.
billedDuration
string | null
required
​
sipDetails.
terminationReason
enum<string>
any
required
Available options
:
SIP_TERMINATION_NORMAL
,
SIP_TERMINATION_INVALID_NUMBER
,
SIP_TERMINATION_TIMEOUT
,
SIP_TERMINATION_DESTINATION_UNAVAILABLE
,
SIP_TERMINATION_BUSY
,
SIP_TERMINATION_CANCELED
,
SIP_TERMINATION_REJECTED
,
SIP_TERMINATION_UNKNOWN
​
inactivityMessages
object[]
Messages spoken by the agent when the user is inactive for the specified duration. Durations are cumulative, so a message m > 1 with duration 30s will be spoken 30 seconds after message m-1.
Show
child attributes
​
inactivityMessages.
duration
string
The duration after which the message should be spoken.
​
inactivityMessages.
message
string
The message to speak.
​
inactivityMessages.
endBehavior
enum<string>
The behavior to exhibit when the message is finished being spoken.
Available options
:
END_BEHAVIOR_UNSPECIFIED
,
END_BEHAVIOR_HANG_UP_SOFT
,
END_BEHAVIOR_HANG_UP_STRICT
​
joinTimeout
string
default:
30s
​
languageHint
string | null
BCP47 language code that may be used to guide speech recognition.
Maximum string length:
16
​
maxDuration
string
default:
3600s
​
medium
object
Details about a call's protocol. By default, calls occur over WebRTC using
the Ultravox client SDK. Setting a different call medium will prepare the
server for a call using a different protocol.
At most one call medium may be set.
Show
child attributes
​
medium.
webRtc
object
The call will use WebRTC with the Ultravox client SDK.
This is the default.
Show
child attributes
​
medium.webRtc.
dataMessages
object
Controls which data messages are enabled for the call.
Show
child attributes
​
medium.webRtc.dataMessages.
pong
boolean
Responds to a ping message. (Default: enabled)
​
medium.webRtc.dataMessages.
state
boolean
Indicates that the agent state has changed. (Default: enabled)
​
medium.webRtc.dataMessages.
transcript
boolean
Provides transcripts of the user and agent speech. (Default: enabled)
​
medium.webRtc.dataMessages.
clientToolInvocation
boolean
Requests a client-implemented tool invocation. (Default: enabled)
​
medium.webRtc.dataMessages.
dataConnectionToolInvocation
boolean
Requests a data-connection-implemented tool invocation. (Default: enabled for data connections, disabled otherwise)
​
medium.webRtc.dataMessages.
playbackClearBuffer
boolean
Requests the client-side audio buffer to be cleared. (Default: enabled for websocket connections, disabled otherwise)
​
medium.webRtc.dataMessages.
callStarted
boolean
Provides information about the call when it starts. (Default: enabled)
​
medium.webRtc.dataMessages.
debug
boolean
Communicates debug information. (Default: disabled)
​
medium.webRtc.dataMessages.
callEvent
boolean
Indicates that a call event has been recorded. (Default: disabled)
​
medium.webRtc.dataMessages.
toolUsed
boolean
Indicates that a tool was used. (Default: disabled)
​
medium.
twilio
object
The call will use Twilio's "Media Streams" protocol.
Once you have a join URL from starting a call, include it in your
TwiML like so:
This works for both inbound and outbound calls.
Show
child attributes
​
medium.twilio.
outgoing
object
If set, Ultravox will directly create a call with Twilio. Twilio must be configured
for the requesting account.
Show
child attributes
​
medium.twilio.outgoing.
to
string
The phone number, in E.164 format (e.g. +14155552671), (or sip address) to call.
​
medium.twilio.outgoing.
from
string
The phone number or client identifier to use as the caller id. If
to
is a phone
number,
from
must be a phone number owned by your Twilio account.
​
medium.twilio.outgoing.
additionalParams
object
Additional parameters to include in the Twilio call creation request.
See
https://www.twilio.com/docs/voice/api/call-resource#request-body-parameters
​
medium.
serverWebSocket
object
The call will use a plain websocket connection. This is unlikely to yield an acceptable user
experience if used from a browser or mobile client, but may be suitable for a
server-to-server connection. This option provides a simple way to connect your own server to
an Ultravox inference instance.
Show
child attributes
​
medium.serverWebSocket.
inputSampleRate
integer<int32>
The sample rate for input (user) audio. Required.
​
medium.serverWebSocket.
outputSampleRate
integer<int32>
The desired sample rate for output (agent) audio. If unset, defaults to the input_sample_rate.
​
medium.serverWebSocket.
clientBufferSizeMs
integer<int32>
The size of the client-side audio buffer in milliseconds. Smaller buffers allow for faster
interruptions but may cause audio underflow if network latency fluctuates too greatly. For
the best of both worlds, set this to some large value (e.g. 30000) and implement support for
playback_clear_buffer messages. Defaults to 60.
​
medium.serverWebSocket.
dataMessages
object
Controls which data messages are enabled for the call.
Show
child attributes
​
medium.serverWebSocket.dataMessages.
pong
boolean
Responds to a ping message. (Default: enabled)
​
medium.serverWebSocket.dataMessages.
state
boolean
Indicates that the agent state has changed. (Default: enabled)
​
medium.serverWebSocket.dataMessages.
transcript
boolean
Provides transcripts of the user and agent speech. (Default: enabled)
​
medium.serverWebSocket.dataMessages.
clientToolInvocation
boolean
Requests a client-implemented tool invocation. (Default: enabled)
​
medium.serverWebSocket.dataMessages.
dataConnectionToolInvocation
boolean
Requests a data-connection-implemented tool invocation. (Default: enabled for data connections, disabled otherwise)
​
medium.serverWebSocket.dataMessages.
playbackClearBuffer
boolean
Requests the client-side audio buffer to be cleared. (Default: enabled for websocket connections, disabled otherwise)
​
medium.serverWebSocket.dataMessages.
callStarted
boolean
Provides information about the call when it starts. (Default: enabled)
​
medium.serverWebSocket.dataMessages.
debug
boolean
Communicates debug information. (Default: disabled)
​
medium.serverWebSocket.dataMessages.
callEvent
boolean
Indicates that a call event has been recorded. (Default: disabled)
​
medium.serverWebSocket.dataMessages.
toolUsed
boolean
Indicates that a tool was used. (Default: disabled)
​
medium.
telnyx
object
The call will use Telnyx's media streaming protocol.
Once you have a join URL from starting a call, include it in your
TexML like so:
This works for both inbound and outbound calls.
Show
child attributes
​
medium.telnyx.
outgoing
object
If set, Ultravox will directly create a call with Telnyx. Telnyx must be configured
for the requesting account.
Show
child attributes
​
medium.telnyx.outgoing.
to
string
The phone number to call in E.164 format (e.g. +14155552671).
​
medium.telnyx.outgoing.
from
string
The phone number initiating the call.
​
medium.telnyx.outgoing.
additionalParams
object
Additional parameters to include in the Telnyx call creation request.
See
https://developers.telnyx.com/api/call-scripting/initiate-texml-call
​
medium.
plivo
object
The call will use Plivo's AudioStreams protocol.
Once you have a join URL from starting a call, include it in your
Plivo XML like so:
${your-join-url}
This works for both inbound and outbound calls.
Show
child attributes
​
medium.plivo.
outgoing
object
If set, Ultravox will directly create a call with Plivo. Plivo must be configured
for the requesting account.
Show
child attributes
​
medium.plivo.outgoing.
to
string
The phone number(s) or sip URI(s) to call, separated by
<
if multiple.
​
medium.plivo.outgoing.
from
string
The phone number initiating the call, in E.164 format (e.g. +14155552671).
​
medium.plivo.outgoing.
additionalParams
object
Additional parameters to include in the Plivo call creation request.
See
https://www.plivo.com/docs/voice/api/call/make-a-call
​
medium.
exotel
object
The call will use Exotel's "Voicebot" protocol.
Once you have a join URL from starting a call, provide it to Exotel as the wss target URL
for your Voicebot (either directly or more likely dynamically from your own server).
​
medium.
sip
object
The call will be connected using Session Initiation Protocol (SIP). Note that SIP incurs
additional charges and must be enabled for your account.
Show
child attributes
​
medium.sip.
incoming
object
Details for an incoming SIP call.
​
medium.sip.
outgoing
object
Details for an outgoing SIP call. Ultravox will initiate this call (and there will be no joinUrl).
Show
child attributes
​
medium.sip.outgoing.
to
string
The SIP URI to connect to. (Phone numbers are not allowed.)
​
medium.sip.outgoing.
from
string
The SIP URI to connect from. This is the "from" field in the SIP INVITE.
​
medium.sip.outgoing.
username
string
The SIP username to use for authentication.
​
medium.sip.outgoing.
password
string
The password for the specified username.
​
model
string
default:
ultravox-v0.6
​
recordingEnabled
boolean
default:
false
​
systemPrompt
string | null
​
temperature
number<double>
default:
0
Required range
:
0 <= x <= 1
​
timeExceededMessage
string | null
​
voice
string | null
​
externalVoice
object
A voice not known to Ultravox Realtime that can nonetheless be used for a call.
Such voices are significantly less validated than normal voices and you'll be
responsible for your own TTS-related errors.
Exactly one field must be set.
Show
child attributes
​
externalVoice.
elevenLabs
object
A voice served by ElevenLabs.
Show
child attributes
​
externalVoice.elevenLabs.
voiceId
string
The ID of the voice in ElevenLabs.
​
externalVoice.elevenLabs.
model
string
The ElevenLabs model to use.
​
externalVoice.elevenLabs.
speed
number<float>
The speaking rate. Must be between 0.7 and 1.2. Defaults to 1.
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.speed
​
externalVoice.elevenLabs.
useSpeakerBoost
boolean
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.use_speaker_boost
​
externalVoice.elevenLabs.
style
number<float>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.style
​
externalVoice.elevenLabs.
similarityBoost
number<float>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.similarity_boost
​
externalVoice.elevenLabs.
stability
number<float>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.stability
​
externalVoice.elevenLabs.
pronunciationDictionaries
object[]
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.pronunciation_dictionary_locators
Show
child attributes
​
externalVoice.elevenLabs.pronunciationDictionaries.
dictionaryId
string
The dictionary's ID.
​
externalVoice.elevenLabs.pronunciationDictionaries.
versionId
string
The dictionary's version.
​
externalVoice.elevenLabs.
optimizeStreamingLatency
integer<int32>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.query.optimize_streaming_latency.optimize_streaming_latency
​
externalVoice.elevenLabs.
maxSampleRate
integer<int32>
The maximum sample rate Ultravox will try to use. ElevenLabs limits your allowed sample rate
based on your tier. See
https://elevenlabs.io/pricing#pricing-table
(and click "Show API details")
​
externalVoice.
cartesia
object
A voice served by Cartesia.
Show
child attributes
​
externalVoice.cartesia.
voiceId
string
The ID of the voice in Cartesia.
​
externalVoice.cartesia.
model
string
The Cartesia model to use.
​
externalVoice.cartesia.
speed
number<float>
(Deprecated) The speaking rate. Must be between -1 and 1. Defaults to 0.
​
externalVoice.cartesia.
emotion
string
(Deprecated) Use generation_config.emotion instead.
​
externalVoice.cartesia.
emotions
string[]
(Deprecated) Use generation_config.emotion instead.
​
externalVoice.cartesia.
generationConfig
object
Configure the various attributes of the generated speech.
Show
child attributes
​
externalVoice.cartesia.generationConfig.
volume
number<float>
Adjust the volume of the generated speech between 0.5x and 2.0x the original volume (default is 1.0x). Valid values are between [0.5, 2.0] inclusive.
​
externalVoice.cartesia.generationConfig.
speed
number<float>
Adjust the speed of the generated speech between 0.6x and 2.0x the original speed (default is 1.0x). Valid values are between [0.6, 1.5] inclusive.
​
externalVoice.cartesia.generationConfig.
emotion
string
The primary emotions are neutral, calm, angry, content, sad, scared. For more options, see Prompting Sonic-3.
​
externalVoice.
lmnt
object
A voice served by LMNT.
Show
child attributes
​
externalVoice.lmnt.
voiceId
string
The ID of the voice in LMNT.
​
externalVoice.lmnt.
model
string
The LMNT model to use.
​
externalVoice.lmnt.
speed
number<float>
The speaking rate. Must be between 0.25 and 2. Defaults to 1.
See
https://docs.lmnt.com/api-reference/speech/synthesize-speech-bytes#body-speed
​
externalVoice.lmnt.
conversational
boolean
See
https://docs.lmnt.com/api-reference/speech/synthesize-speech-bytes#body-conversational
​
externalVoice.
google
object
A voice served by Google, using bidirectional streaming.
(For non-streaming or output-only streaming, use generic.)
Show
child attributes
​
externalVoice.google.
voiceId
string
The ID (name) of the voice in Google, e.g. "en-US-Chirp3-HD-Charon".
​
externalVoice.google.
speakingRate
number<float>
The speaking rate. Must be between 0.25 and 2. Defaults to 1.
See
https://cloud.google.com/python/docs/reference/texttospeech/latest/google.cloud.texttospeech_v1.types.StreamingAudioConfig
​
externalVoice.
generic
object
A voice served by a generic REST-based TTS API.
Show
child attributes
​
externalVoice.generic.
url
string
The endpoint to which requests are sent.
​
externalVoice.generic.
headers
object
Headers to include in the request.
Show
child attributes
​
externalVoice.generic.headers.
{key}
string
​
externalVoice.generic.
body
object
The request body to send. Some field should include a placeholder for text
represented as {text}. The placeholder will be replaced with the text to synthesize.
​
externalVoice.generic.
responseSampleRate
integer<int32>
The sample rate of the audio returned by the API.
​
externalVoice.generic.
responseWordsPerMinute
integer<int32>
An estimate of the speaking rate of the returned audio in words per minute. This is
used for transcript timing while audio is streamed in the response. (Once the response
is complete, Ultravox Realtime uses the real audio duration to adjust the timing.)
Defaults to 150 and is unused for non-streaming responses.
​
externalVoice.generic.
responseMimeType
string
The real mime type of the content returned by the API. If unset, the Content-Type response header
will be used. This is useful for APIs whose response bodies don't strictly adhere to what the
API claims via header. For example, if your API claims to return audio/wav but omits the WAV
header (thus really returning raw PCM), set this to audio/l16. Similarly, if your API claims to
return JSON but actually streams JSON Lines, set this to application/jsonl.
​
externalVoice.generic.
jsonAudioFieldPath
string
For JSON responses, the path to the field containing base64-encoded audio data. The data must
be PCM audio, optionally with a WAV header.
​
externalVoice.generic.
jsonByteEncoding
enum<string>
For JSON responses, how audio bytes are encoded into the json_audio_field_path string.
Defaults to base64. Also supports hex.
Available options
:
JSON_BYTE_ENCODING_UNSPECIFIED
,
JSON_BYTE_ENCODING_BASE64
,
JSON_BYTE_ENCODING_HEX
​
transcriptOptional
boolean
default:
true
deprecated
Indicates whether a transcript is optional for the call.
​
vadSettings
object
VAD settings for the call.
Show
child attributes
​
vadSettings.
turnEndpointDelay
string
The minimum amount of time the agent will wait to respond after the user seems to be done
speaking. Increasing this value will make the agent less eager to respond, which may increase
perceived response latency but will also make the agent less likely to jump in before the user
is really done speaking.
Built-in VAD currently operates on 32ms frames, so only multiples of 32ms are meaningful.
(Anything from 1ms to 31ms will produce the same result.)
Defaults to "0.384s" (384ms) as a starting point, but there's nothing special about this value
aside from it corresponding to 12 VAD frames.
​
vadSettings.
minimumTurnDuration
string
The minimum duration of user speech required to be considered a user turn.
Increasing this value will cause the agent to ignore short user audio. This may be useful in
particularly noisy environments, but it comes at the cost of possibly ignoring very short
user responses such as "yes" or "no".
Defaults to "0s" meaning the agent considers all user audio inputs (that make it through
built-in noise cancellation).
​
vadSettings.
minimumInterruptionDuration
string
The minimum duration of user speech required to interrupt the agent. This works the same way
as minimumTurnDuration, but allows for a higher threshold for interrupting the agent. (This
value will be ignored if it is less than minimumTurnDuration.)
Defaults to "0.09s" (90ms) as a starting point, but there's nothing special about this value.
​
vadSettings.
frameActivationThreshold
number<float>
The threshold for the VAD to consider a frame as speech. This is a value between 0.1 and 1.
Miniumum value is 0.1, which is the default value.
​
dataConnectionConfig
object
Settings for exchanging data messages with an additional participant.
Show
child attributes
​
dataConnectionConfig.
websocketUrl
string
The websocket URL to which the session will connect to stream data messages.
​
dataConnectionConfig.
audioConfig
object
Audio configuration for the data connection. If not set, no audio will be sent.
Show
child attributes
​
dataConnectionConfig.audioConfig.
sampleRate
integer<int32>
The sample rate of the audio stream. If not set, will default to 16000.
​
dataConnectionConfig.audioConfig.
channelMode
enum<string>
The audio channel mode to use. CHANNEL_MODE_MIXED will combine user and agent audio
into a single mono output while CHANNEL_MODE_SEPARATED will result in stereo audio
where user and agent are separated. The latter is the default.
Available options
:
CHANNEL_MODE_UNSPECIFIED
,
CHANNEL_MODE_MIXED
,
CHANNEL_MODE_SEPARATED
​
dataConnectionConfig.
dataMessages
object
Controls which data messages are enabled for the data connection.
Show
child attributes
​
dataConnectionConfig.dataMessages.
pong
boolean
Responds to a ping message. (Default: enabled)
​
dataConnectionConfig.dataMessages.
state
boolean
Indicates that the agent state has changed. (Default: enabled)
​
dataConnectionConfig.dataMessages.
transcript
boolean
Provides transcripts of the user and agent speech. (Default: enabled)
​
dataConnectionConfig.dataMessages.
clientToolInvocation
boolean
Requests a client-implemented tool invocation. (Default: enabled)
​
dataConnectionConfig.dataMessages.
dataConnectionToolInvocation
boolean
Requests a data-connection-implemented tool invocation. (Default: enabled for data connections, disabled otherwise)
​
dataConnectionConfig.dataMessages.
playbackClearBuffer
boolean
Requests the client-side audio buffer to be cleared. (Default: enabled for websocket connections, disabled otherwise)
​
dataConnectionConfig.dataMessages.
callStarted
boolean
Provides information about the call when it starts. (Default: enabled)
​
dataConnectionConfig.dataMessages.
debug
boolean
Communicates debug information. (Default: disabled)
​
dataConnectionConfig.dataMessages.
callEvent
boolean
Indicates that a call event has been recorded. (Default: disabled)
​
dataConnectionConfig.dataMessages.
toolUsed
boolean
Indicates that a tool was used. (Default: disabled)
​
callbacks
object
Callbacks configuration for the call.
Show
child attributes
​
callbacks.
joined
object
Callback invoked when the call is joined.
Show
child attributes
​
callbacks.joined.
url
string
The URL to invoke.
​
callbacks.joined.
secrets
string[]
Secrets to use to signing the callback request.
​
callbacks.
ended
object
Callback invoked when the call has ended.
Show
child attributes
​
callbacks.ended.
url
string
The URL to invoke.
​
callbacks.ended.
secrets
string[]
Secrets to use to signing the callback request.
​
callbacks.
billed
object
Callback invoked when the call is billed.
Show
child attributes
​
callbacks.billed.
url
string
The URL to invoke.
​
callbacks.billed.
secrets
string[]
Secrets to use to signing the callback request.
Previous
Delete Call
Deletes the specified call
Next
⌘
I
discord
github
x
Powered by Mintlify
```
