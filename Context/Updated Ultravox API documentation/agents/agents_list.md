# List Agents

**URL:** https://docs.ultravox.ai/api-reference/agents/agents-list

## Description
Returns details for all agents

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/agents\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/agents\--header'X-API-Key: <api-key>'
```

## Response

### Response Schema

```json
{"results": [{"agentId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","publishedRevisionId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","created":"2023-11-07T05:31:56Z","statistics": {"calls":0},"name":"<string>","callTemplate": {"name":"<string>","created":"2023-11-07T05:31:56Z","updated":"2023-11-07T05:31:56Z","medium": {"webRtc": {"dataMessages": {"pong":true,"state":true,"transcript":true,"clientToolInvocation":true,"dataConnectionToolInvocation":true,"playbackClearBuffer":true,"callStarted":true,"debug":true,"callEvent":true,"toolUsed":true}},"twilio": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"serverWebSocket": {"inputSampleRate":123,"outputSampleRate":123,"clientBufferSizeMs":123,"dataMessages": {"pong":true,"state":true,"transcript":true,"clientToolInvocation":true,"dataConnectionToolInvocation":true,"playbackClearBuffer":true,"callStarted":true,"debug":true,"callEvent":true,"toolUsed":true}},"telnyx": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"plivo": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"exotel": {},"sip": {"incoming": {},"outgoing": {"to":"<string>","from":"<string>","username":"<string>","password":"<string>"}}},"initialOutputMedium":"MESSAGE_MEDIUM_UNSPECIFIED","joinTimeout":"<string>","maxDuration":"<string>","vadSettings": {"turnEndpointDelay":"<string>","minimumTurnDuration":"<string>","minimumInterruptionDuration":"<string>","frameActivationThreshold":123},"recordingEnabled":true,"firstSpeakerSettings": {"user": {"fallback": {"delay":"<string>","text":"<string>","prompt":"<string>"}},"agent": {"uninterruptible":true,"text":"<string>","prompt":"<string>","delay":"<string>"}},"systemPrompt":"<string>","temperature":123,"model":"<string>","voice":"<string>","externalVoice": {"elevenLabs": {"voiceId":"<string>","model":"<string>","speed":123,"useSpeakerBoost":true,"style":123,"similarityBoost":123,"stability":123,"pronunciationDictionaries": [{"dictionaryId":"<string>","versionId":"<string>"}],"optimizeStreamingLatency":123,"maxSampleRate":123},"cartesia": {"voiceId":"<string>","model":"<string>","speed":123,"emotion":"<string>","emotions": ["<string>"],"generationConfig": {"volume":123,"speed":123,"emotion":"<string>"}},"lmnt": {"voiceId":"<string>","model":"<string>","speed":123,"conversational":true},"google": {"voiceId":"<string>","speakingRate":123},"generic": {"url":"<string>","headers": {},"body": {},"responseSampleRate":123,"responseWordsPerMinute":123,"responseMimeType":"<string>","jsonAudioFieldPath":"<string>","jsonByteEncoding":"JSON_BYTE_ENCODING_UNSPECIFIED"}},"languageHint":"<string>","timeExceededMessage":"<string>","inactivityMessages": [{"duration":"<string>","message":"<string>","endBehavior":"END_BEHAVIOR_UNSPECIFIED"}],"selectedTools": [{"toolId":"<string>","toolName":"<string>","temporaryTool": {"modelToolName":"<string>","description":"<string>","dynamicParameters": [{"name":"<string>","location":"PARAMETER_LOCATION_UNSPECIFIED","schema": {},"required":true}],"staticParameters": [{"name":"<string>","location":"PARAMETER_LOCATION_UNSPECIFIED","value":"<unknown>"}],"automaticParameters": [{"name":"<string>","location":"PARAMETER_LOCATION_UNSPECIFIED","knownValue":"KNOWN_PARAM_UNSPECIFIED"}],"requirements": {"httpSecurityOptions": {"options": [{"requirements": {},"ultravoxCallTokenRequirement": {"scopes": ["<string>"]}}]},"requiredParameterOverrides": ["<string>"]},"timeout":"<string>","precomputable":true,"http": {"baseUrlPattern":"<string>","httpMethod":"<string>"},"client": {},"dataConnection": {},"defaultReaction":"AGENT_REACTION_UNSPECIFIED","staticResponse": {"responseText":"<string>"}},"nameOverride":"<string>","descriptionOverride":"<string>","authTokens": {},"parameterOverrides": {},"transitionId":"<string>"}],"dataConnection": {"websocketUrl":"<string>","audioConfig": {"sampleRate":123,"channelMode":"CHANNEL_MODE_UNSPECIFIED"},"dataMessages": {"pong":true,"state":true,"transcript":true,"clientToolInvocation":true,"dataConnectionToolInvocation":true,"playbackClearBuffer":true,"callStarted":true,"debug":true,"callEvent":true,"toolUsed":true}},"contextSchema": {}}}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

```json
{"results": [{"agentId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","publishedRevisionId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","created":"2023-11-07T05:31:56Z","statistics": {"calls":0},"name":"<string>","callTemplate": {"name":"<string>","created":"2023-11-07T05:31:56Z","updated":"2023-11-07T05:31:56Z","medium": {"webRtc": {"dataMessages": {"pong":true,"state":true,"transcript":true,"clientToolInvocation":true,"dataConnectionToolInvocation":true,"playbackClearBuffer":true,"callStarted":true,"debug":true,"callEvent":true,"toolUsed":true}},"twilio": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"serverWebSocket": {"inputSampleRate":123,"outputSampleRate":123,"clientBufferSizeMs":123,"dataMessages": {"pong":true,"state":true,"transcript":true,"clientToolInvocation":true,"dataConnectionToolInvocation":true,"playbackClearBuffer":true,"callStarted":true,"debug":true,"callEvent":true,"toolUsed":true}},"telnyx": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"plivo": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"exotel": {},"sip": {"incoming": {},"outgoing": {"to":"<string>","from":"<string>","username":"<string>","password":"<string>"}}},"initialOutputMedium":"MESSAGE_MEDIUM_UNSPECIFIED","joinTimeout":"<string>","maxDuration":"<string>","vadSettings": {"turnEndpointDelay":"<string>","minimumTurnDuration":"<string>","minimumInterruptionDuration":"<string>","frameActivationThreshold":123},"recordingEnabled":true,"firstSpeakerSettings": {"user": {"fallback": {"delay":"<string>","text":"<string>","prompt":"<string>"}},"agent": {"uninterruptible":true,"text":"<string>","prompt":"<string>","delay":"<string>"}},"systemPrompt":"<string>","temperature":123,"model":"<string>","voice":"<string>","externalVoice": {"elevenLabs": {"voiceId":"<string>","model":"<string>","speed":123,"useSpeakerBoost":true,"style":123,"similarityBoost":123,"stability":123,"pronunciationDictionaries": [{"dictionaryId":"<string>","versionId":"<string>"}],"optimizeStreamingLatency":123,"maxSampleRate":123},"cartesia": {"voiceId":"<string>","model":"<string>","speed":123,"emotion":"<string>","emotions": ["<string>"],"generationConfig": {"volume":123,"speed":123,"emotion":"<string>"}},"lmnt": {"voiceId":"<string>","model":"<string>","speed":123,"conversational":true},"google": {"voiceId":"<string>","speakingRate":123},"generic": {"url":"<string>","headers": {},"body": {},"responseSampleRate":123,"responseWordsPerMinute":123,"responseMimeType":"<string>","jsonAudioFieldPath":"<string>","jsonByteEncoding":"JSON_BYTE_ENCODING_UNSPECIFIED"}},"languageHint":"<string>","timeExceededMessage":"<string>","inactivityMessages": [{"duration":"<string>","message":"<string>","endBehavior":"END_BEHAVIOR_UNSPECIFIED"}],"selectedTools": [{"toolId":"<string>","toolName":"<string>","temporaryTool": {"modelToolName":"<string>","description":"<string>","dynamicParameters": [{"name":"<string>","location":"PARAMETER_LOCATION_UNSPECIFIED","schema": {},"required":true}],"staticParameters": [{"name":"<string>","location":"PARAMETER_LOCATION_UNSPECIFIED","value":"<unknown>"}],"automaticParameters": [{"name":"<string>","location":"PARAMETER_LOCATION_UNSPECIFIED","knownValue":"KNOWN_PARAM_UNSPECIFIED"}],"requirements": {"httpSecurityOptions": {"options": [{"requirements": {},"ultravoxCallTokenRequirement": {"scopes": ["<string>"]}}]},"requiredParameterOverrides": ["<string>"]},"timeout":"<string>","precomputable":true,"http": {"baseUrlPattern":"<string>","httpMethod":"<string>"},"client": {},"dataConnection": {},"defaultReaction":"AGENT_REACTION_UNSPECIFIED","staticResponse": {"responseText":"<string>"}},"nameOverride":"<string>","descriptionOverride":"<string>","authTokens": {},"parameterOverrides": {},"transitionId":"<string>"}],"dataConnection": {"websocketUrl":"<string>","audioConfig": {"sampleRate":123,"channelMode":"CHANNEL_MODE_UNSPECIFIED"},"dataMessages": {"pong":true,"state":true,"transcript":true,"clientToolInvocation":true,"dataConnectionToolInvocation":true,"playbackClearBuffer":true,"callStarted":true,"debug":true,"callEvent":true,"toolUsed":true}},"contextSchema": {}}}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

## Full Content

```
Agents
List Agents
Returns details for all agents
GET
/
api
/
agents
Try it
cURL
cURL
Copy
Ask AI
curl
--request
GET
\
--url
https://api.ultravox.ai/api/agents
\
--header
'X-API-Key: <api-key>'
200
Copy
Ask AI
{
"results"
: [
{
"agentId"
:
"3c90c3cc-0d44-4b50-8888-8dd25736052a"
,
"publishedRevisionId"
:
"3c90c3cc-0d44-4b50-8888-8dd25736052a"
,
"created"
:
"2023-11-07T05:31:56Z"
,
"statistics"
: {
"calls"
:
0
},
"name"
:
"<string>"
,
"callTemplate"
: {
"name"
:
"<string>"
,
"created"
:
"2023-11-07T05:31:56Z"
,
"updated"
:
"2023-11-07T05:31:56Z"
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
"initialOutputMedium"
:
"MESSAGE_MEDIUM_UNSPECIFIED"
,
"joinTimeout"
:
"<string>"
,
"maxDuration"
:
"<string>"
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
"recordingEnabled"
:
true
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
"systemPrompt"
:
"<string>"
,
"temperature"
:
123
,
"model"
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
"languageHint"
:
"<string>"
,
"timeExceededMessage"
:
"<string>"
,
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
"selectedTools"
: [
{
"toolId"
:
"<string>"
,
"toolName"
:
"<string>"
,
"temporaryTool"
: {
"modelToolName"
:
"<string>"
,
"description"
:
"<string>"
,
"dynamicParameters"
: [
{
"name"
:
"<string>"
,
"location"
:
"PARAMETER_LOCATION_UNSPECIFIED"
,
"schema"
: {},
"required"
:
true
}
],
"staticParameters"
: [
{
"name"
:
"<string>"
,
"location"
:
"PARAMETER_LOCATION_UNSPECIFIED"
,
"value"
:
"<unknown>"
}
],
"automaticParameters"
: [
{
"name"
:
"<string>"
,
"location"
:
"PARAMETER_LOCATION_UNSPECIFIED"
,
"knownValue"
:
"KNOWN_PARAM_UNSPECIFIED"
}
],
"requirements"
: {
"httpSecurityOptions"
: {
"options"
: [
{
"requirements"
: {},
"ultravoxCallTokenRequirement"
: {
"scopes"
: [
"<string>"
]
}
}
]
},
"requiredParameterOverrides"
: [
"<string>"
]
},
"timeout"
:
"<string>"
,
"precomputable"
:
true
,
"http"
: {
"baseUrlPattern"
:
"<string>"
,
"httpMethod"
:
"<string>"
},
"client"
: {},
"dataConnection"
: {},
"defaultReaction"
:
"AGENT_REACTION_UNSPECIFIED"
,
"staticResponse"
: {
"responseText"
:
"<string>"
}
},
"nameOverride"
:
"<string>"
,
"descriptionOverride"
:
"<string>"
,
"authTokens"
: {},
"parameterOverrides"
: {},
"transitionId"
:
"<string>"
}
],
"dataConnection"
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
"contextSchema"
: {}
}
}
],
"next"
:
"http://api.example.org/accounts/?cursor=cD00ODY%3D
\"
"
,
"previous"
:
"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3"
,
"total"
:
123
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
cursor
string
The pagination cursor value.
​
pageSize
integer
Number of results to return per page.
​
search
string
The search string used to filter results
Minimum string length:
1
​
sort
string
Which field to use when ordering the results.
Response
200 - application/json
​
results
object[]
required
Show
child attributes
​
results.
agentId
string<uuid>
required
​
results.
publishedRevisionId
string<uuid> | null
required
​
results.
created
string<date-time>
required
​
results.
statistics
object
required
Show
child attributes
​
results.statistics.
calls
integer
default:
0
required
​
results.
name
string
Maximum string length:
64
​
results.
callTemplate
object
A CallTemplate that can be used to create Ultravox calls with shared properties.
Show
child attributes
​
results.callTemplate.
name
string
The name of the call template.
​
results.callTemplate.
created
string<date-time>
When the call template was created.
​
results.callTemplate.
updated
string<date-time>
When the call template was last modified.
​
results.callTemplate.
medium
object
The medium used for calls by default.
Show
child attributes
​
results.callTemplate.medium.
webRtc
object
The call will use WebRTC with the Ultravox client SDK.
This is the default.
Show
child attributes
​
results.callTemplate.medium.webRtc.
dataMessages
object
Controls which data messages are enabled for the call.
Show
child attributes
​
results.callTemplate.medium.webRtc.dataMessages.
pong
boolean
Responds to a ping message. (Default: enabled)
​
results.callTemplate.medium.webRtc.dataMessages.
state
boolean
Indicates that the agent state has changed. (Default: enabled)
​
results.callTemplate.medium.webRtc.dataMessages.
transcript
boolean
Provides transcripts of the user and agent speech. (Default: enabled)
​
results.callTemplate.medium.webRtc.dataMessages.
clientToolInvocation
boolean
Requests a client-implemented tool invocation. (Default: enabled)
​
results.callTemplate.medium.webRtc.dataMessages.
dataConnectionToolInvocation
boolean
Requests a data-connection-implemented tool invocation. (Default: enabled for data connections, disabled otherwise)
​
results.callTemplate.medium.webRtc.dataMessages.
playbackClearBuffer
boolean
Requests the client-side audio buffer to be cleared. (Default: enabled for websocket connections, disabled otherwise)
​
results.callTemplate.medium.webRtc.dataMessages.
callStarted
boolean
Provides information about the call when it starts. (Default: enabled)
​
results.callTemplate.medium.webRtc.dataMessages.
debug
boolean
Communicates debug information. (Default: disabled)
​
results.callTemplate.medium.webRtc.dataMessages.
callEvent
boolean
Indicates that a call event has been recorded. (Default: disabled)
​
results.callTemplate.medium.webRtc.dataMessages.
toolUsed
boolean
Indicates that a tool was used. (Default: disabled)
​
results.callTemplate.medium.
twilio
object
The call will use Twilio's "Media Streams" protocol.
Once you have a join URL from starting a call, include it in your
TwiML like so:
This works for both inbound and outbound calls.
Show
child attributes
​
results.callTemplate.medium.twilio.
outgoing
object
If set, Ultravox will directly create a call with Twilio. Twilio must be configured
for the requesting account.
Show
child attributes
​
results.callTemplate.medium.twilio.outgoing.
to
string
The phone number, in E.164 format (e.g. +14155552671), (or sip address) to call.
​
results.callTemplate.medium.twilio.outgoing.
from
string
The phone number or client identifier to use as the caller id. If
to
is a phone
number,
from
must be a phone number owned by your Twilio account.
​
results.callTemplate.medium.twilio.outgoing.
additionalParams
object
Additional parameters to include in the Twilio call creation request.
See
https://www.twilio.com/docs/voice/api/call-resource#request-body-parameters
​
results.callTemplate.medium.
serverWebSocket
object
The call will use a plain websocket connection. This is unlikely to yield an acceptable user
experience if used from a browser or mobile client, but may be suitable for a
server-to-server connection. This option provides a simple way to connect your own server to
an Ultravox inference instance.
Show
child attributes
​
results.callTemplate.medium.serverWebSocket.
inputSampleRate
integer<int32>
The sample rate for input (user) audio. Required.
​
results.callTemplate.medium.serverWebSocket.
outputSampleRate
integer<int32>
The desired sample rate for output (agent) audio. If unset, defaults to the input_sample_rate.
​
results.callTemplate.medium.serverWebSocket.
clientBufferSizeMs
integer<int32>
The size of the client-side audio buffer in milliseconds. Smaller buffers allow for faster
interruptions but may cause audio underflow if network latency fluctuates too greatly. For
the best of both worlds, set this to some large value (e.g. 30000) and implement support for
playback_clear_buffer messages. Defaults to 60.
​
results.callTemplate.medium.serverWebSocket.
dataMessages
object
Controls which data messages are enabled for the call.
Show
child attributes
​
results.callTemplate.medium.serverWebSocket.dataMessages.
pong
boolean
Responds to a ping message. (Default: enabled)
​
results.callTemplate.medium.serverWebSocket.dataMessages.
state
boolean
Indicates that the agent state has changed. (Default: enabled)
​
results.callTemplate.medium.serverWebSocket.dataMessages.
transcript
boolean
Provides transcripts of the user and agent speech. (Default: enabled)
​
results.callTemplate.medium.serverWebSocket.dataMessages.
clientToolInvocation
boolean
Requests a client-implemented tool invocation. (Default: enabled)
​
results.callTemplate.medium.serverWebSocket.dataMessages.
dataConnectionToolInvocation
boolean
Requests a data-connection-implemented tool invocation. (Default: enabled for data connections, disabled otherwise)
​
results.callTemplate.medium.serverWebSocket.dataMessages.
playbackClearBuffer
boolean
Requests the client-side audio buffer to be cleared. (Default: enabled for websocket connections, disabled otherwise)
​
results.callTemplate.medium.serverWebSocket.dataMessages.
callStarted
boolean
Provides information about the call when it starts. (Default: enabled)
​
results.callTemplate.medium.serverWebSocket.dataMessages.
debug
boolean
Communicates debug information. (Default: disabled)
​
results.callTemplate.medium.serverWebSocket.dataMessages.
callEvent
boolean
Indicates that a call event has been recorded. (Default: disabled)
​
results.callTemplate.medium.serverWebSocket.dataMessages.
toolUsed
boolean
Indicates that a tool was used. (Default: disabled)
​
results.callTemplate.medium.
telnyx
object
The call will use Telnyx's media streaming protocol.
Once you have a join URL from starting a call, include it in your
TexML like so:
This works for both inbound and outbound calls.
Show
child attributes
​
results.callTemplate.medium.telnyx.
outgoing
object
If set, Ultravox will directly create a call with Telnyx. Telnyx must be configured
for the requesting account.
Show
child attributes
​
results.callTemplate.medium.telnyx.outgoing.
to
string
The phone number to call in E.164 format (e.g. +14155552671).
​
results.callTemplate.medium.telnyx.outgoing.
from
string
The phone number initiating the call.
​
results.callTemplate.medium.telnyx.outgoing.
additionalParams
object
Additional parameters to include in the Telnyx call creation request.
See
https://developers.telnyx.com/api/call-scripting/initiate-texml-call
​
results.callTemplate.medium.
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
results.callTemplate.medium.plivo.
outgoing
object
If set, Ultravox will directly create a call with Plivo. Plivo must be configured
for the requesting account.
Show
child attributes
​
results.callTemplate.medium.plivo.outgoing.
to
string
The phone number(s) or sip URI(s) to call, separated by
<
if multiple.
​
results.callTemplate.medium.plivo.outgoing.
from
string
The phone number initiating the call, in E.164 format (e.g. +14155552671).
​
results.callTemplate.medium.plivo.outgoing.
additionalParams
object
Additional parameters to include in the Plivo call creation request.
See
https://www.plivo.com/docs/voice/api/call/make-a-call
​
results.callTemplate.medium.
exotel
object
The call will use Exotel's "Voicebot" protocol.
Once you have a join URL from starting a call, provide it to Exotel as the wss target URL
for your Voicebot (either directly or more likely dynamically from your own server).
​
results.callTemplate.medium.
sip
object
The call will be connected using Session Initiation Protocol (SIP). Note that SIP incurs
additional charges and must be enabled for your account.
Show
child attributes
​
results.callTemplate.medium.sip.
incoming
object
Details for an incoming SIP call.
​
results.callTemplate.medium.sip.
outgoing
object
Details for an outgoing SIP call. Ultravox will initiate this call (and there will be no joinUrl).
Show
child attributes
​
results.callTemplate.medium.sip.outgoing.
to
string
The SIP URI to connect to. (Phone numbers are not allowed.)
​
results.callTemplate.medium.sip.outgoing.
from
string
The SIP URI to connect from. This is the "from" field in the SIP INVITE.
​
results.callTemplate.medium.sip.outgoing.
username
string
The SIP username to use for authentication.
​
results.callTemplate.medium.sip.outgoing.
password
string
The password for the specified username.
​
results.callTemplate.
initialOutputMedium
enum<string>
The medium initially used for calls by default. Defaults to voice.
Available options
:
MESSAGE_MEDIUM_UNSPECIFIED
,
MESSAGE_MEDIUM_VOICE
,
MESSAGE_MEDIUM_TEXT
​
results.callTemplate.
joinTimeout
string
A default timeout for joining calls. Defaults to 30 seconds.
​
results.callTemplate.
maxDuration
string
The default maximum duration of calls. Defaults to 1 hour.
​
results.callTemplate.
vadSettings
object
The default voice activity detection settings for calls.
Show
child attributes
​
results.callTemplate.vadSettings.
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
results.callTemplate.vadSettings.
minimumTurnDuration
string
The minimum duration of user speech required to be considered a user turn.
Increasing this value will cause the agent to ignore short user audio. This may be useful in
particularly noisy environments, but it comes at the cost of possibly ignoring very short
user responses such as "yes" or "no".
Defaults to "0s" meaning the agent considers all user audio inputs (that make it through
built-in noise cancellation).
​
results.callTemplate.vadSettings.
minimumInterruptionDuration
string
The minimum duration of user speech required to interrupt the agent. This works the same way
as minimumTurnDuration, but allows for a higher threshold for interrupting the agent. (This
value will be ignored if it is less than minimumTurnDuration.)
Defaults to "0.09s" (90ms) as a starting point, but there's nothing special about this value.
​
results.callTemplate.vadSettings.
frameActivationThreshold
number<float>
The threshold for the VAD to consider a frame as speech. This is a value between 0.1 and 1.
Miniumum value is 0.1, which is the default value.
​
results.callTemplate.
recordingEnabled
boolean
Whether calls are recorded by default.
​
results.callTemplate.
firstSpeakerSettings
object
The default settings for the initial message to get a conversation started for calls.
Defaults to
agent: {}
which means the agent will start the conversation with an
(interruptible) greeting generated based on the system prompt and any initial messages.
Show
child attributes
​
results.callTemplate.firstSpeakerSettings.
user
object
If set, the user should speak first.
Show
child attributes
​
results.callTemplate.firstSpeakerSettings.user.
fallback
object
If set, the agent will start the conversation itself if the user doesn't start
speaking within the given delay.
Show
child attributes
​
results.callTemplate.firstSpeakerSettings.user.fallback.
delay
string
How long the agent should wait before starting the conversation itself.
​
results.callTemplate.firstSpeakerSettings.user.fallback.
text
string
A specific greeting the agent should say.
​
results.callTemplate.firstSpeakerSettings.user.fallback.
prompt
string
A prompt for the agent to generate a greeting.
​
results.callTemplate.firstSpeakerSettings.
agent
object
If set, the agent should speak first.
Show
child attributes
​
results.callTemplate.firstSpeakerSettings.agent.
uninterruptible
boolean
Whether the user should be prevented from interrupting the agent's first message.
Defaults to false (meaning the agent is interruptible as usual).
​
results.callTemplate.firstSpeakerSettings.agent.
text
string
A specific greeting the agent should say.
​
results.callTemplate.firstSpeakerSettings.agent.
prompt
string
A prompt for the agent to generate a greeting.
​
results.callTemplate.firstSpeakerSettings.agent.
delay
string
If set, the agent will wait this long before starting its greeting. This may be useful
for ensuring the user is ready.
​
results.callTemplate.
systemPrompt
string
The system prompt used for generations.
If multiple stages are defined for the call, this will be used only for stages without their own systemPrompt.
​
results.callTemplate.
temperature
number<float>
The model temperature, between 0 and 1. Defaults to 0.
If multiple stages are defined for the call, this will be used only for stages without their own temperature.
​
results.callTemplate.
model
string
The model used for generations. Currently defaults to ultravox-v0.6.
If multiple stages are defined for the call, this will be used only for stages without their own model.
​
results.callTemplate.
voice
string
The name or ID of the voice the agent should use for calls.
If multiple stages are defined for the call, this will be used only for stages without their own voice (or external_voice).
​
results.callTemplate.
externalVoice
object
A voice not known to Ultravox Realtime that can nonetheless be used for calls with this agent.
Your account must have an API key set for the provider of the voice.
Either this or
voice
may be set, but not both.
Show
child attributes
​
results.callTemplate.externalVoice.
elevenLabs
object
A voice served by ElevenLabs.
Show
child attributes
​
results.callTemplate.externalVoice.elevenLabs.
voiceId
string
The ID of the voice in ElevenLabs.
​
results.callTemplate.externalVoice.elevenLabs.
model
string
The ElevenLabs model to use.
​
results.callTemplate.externalVoice.elevenLabs.
speed
number<float>
The speaking rate. Must be between 0.7 and 1.2. Defaults to 1.
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.speed
​
results.callTemplate.externalVoice.elevenLabs.
useSpeakerBoost
boolean
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.use_speaker_boost
​
results.callTemplate.externalVoice.elevenLabs.
style
number<float>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.style
​
results.callTemplate.externalVoice.elevenLabs.
similarityBoost
number<float>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.similarity_boost
​
results.callTemplate.externalVoice.elevenLabs.
stability
number<float>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.stability
​
results.callTemplate.externalVoice.elevenLabs.
pronunciationDictionaries
object[]
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.pronunciation_dictionary_locators
Show
child attributes
​
results.callTemplate.externalVoice.elevenLabs.pronunciationDictionaries.
dictionaryId
string
The dictionary's ID.
​
results.callTemplate.externalVoice.elevenLabs.pronunciationDictionaries.
versionId
string
The dictionary's version.
​
results.callTemplate.externalVoice.elevenLabs.
optimizeStreamingLatency
integer<int32>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.query.optimize_streaming_latency.optimize_streaming_latency
​
results.callTemplate.externalVoice.elevenLabs.
maxSampleRate
integer<int32>
The maximum sample rate Ultravox will try to use. ElevenLabs limits your allowed sample rate
based on your tier. See
https://elevenlabs.io/pricing#pricing-table
(and click "Show API details")
​
results.callTemplate.externalVoice.
cartesia
object
A voice served by Cartesia.
Show
child attributes
​
results.callTemplate.externalVoice.cartesia.
voiceId
string
The ID of the voice in Cartesia.
​
results.callTemplate.externalVoice.cartesia.
model
string
The Cartesia model to use.
​
results.callTemplate.externalVoice.cartesia.
speed
number<float>
(Deprecated) The speaking rate. Must be between -1 and 1. Defaults to 0.
​
results.callTemplate.externalVoice.cartesia.
emotion
string
(Deprecated) Use generation_config.emotion instead.
​
results.callTemplate.externalVoice.cartesia.
emotions
string[]
(Deprecated) Use generation_config.emotion instead.
​
results.callTemplate.externalVoice.cartesia.
generationConfig
object
Configure the various attributes of the generated speech.
Show
child attributes
​
results.callTemplate.externalVoice.cartesia.generationConfig.
volume
number<float>
Adjust the volume of the generated speech between 0.5x and 2.0x the original volume (default is 1.0x). Valid values are between [0.5, 2.0] inclusive.
​
results.callTemplate.externalVoice.cartesia.generationConfig.
speed
number<float>
Adjust the speed of the generated speech between 0.6x and 2.0x the original speed (default is 1.0x). Valid values are between [0.6, 1.5] inclusive.
​
results.callTemplate.externalVoice.cartesia.generationConfig.
emotion
string
The primary emotions are neutral, calm, angry, content, sad, scared. For more options, see Prompting Sonic-3.
​
results.callTemplate.externalVoice.
lmnt
object
A voice served by LMNT.
Show
child attributes
​
results.callTemplate.externalVoice.lmnt.
voiceId
string
The ID of the voice in LMNT.
​
results.callTemplate.externalVoice.lmnt.
model
string
The LMNT model to use.
​
results.callTemplate.externalVoice.lmnt.
speed
number<float>
The speaking rate. Must be between 0.25 and 2. Defaults to 1.
See
https://docs.lmnt.com/api-reference/speech/synthesize-speech-bytes#body-speed
​
results.callTemplate.externalVoice.lmnt.
conversational
boolean
See
https://docs.lmnt.com/api-reference/speech/synthesize-speech-bytes#body-conversational
​
results.callTemplate.externalVoice.
google
object
A voice served by Google, using bidirectional streaming.
(For non-streaming or output-only streaming, use generic.)
Show
child attributes
​
results.callTemplate.externalVoice.google.
voiceId
string
The ID (name) of the voice in Google, e.g. "en-US-Chirp3-HD-Charon".
​
results.callTemplate.externalVoice.google.
speakingRate
number<float>
The speaking rate. Must be between 0.25 and 2. Defaults to 1.
See
https://cloud.google.com/python/docs/reference/texttospeech/latest/google.cloud.texttospeech_v1.types.StreamingAudioConfig
​
results.callTemplate.externalVoice.
generic
object
A voice served by a generic REST-based TTS API.
Show
child attributes
​
results.callTemplate.externalVoice.generic.
url
string
The endpoint to which requests are sent.
​
results.callTemplate.externalVoice.generic.
headers
object
Headers to include in the request.
Show
child attributes
​
results.callTemplate.externalVoice.generic.headers.
{key}
string
​
results.callTemplate.externalVoice.generic.
body
object
The request body to send. Some field should include a placeholder for text
represented as {text}. The placeholder will be replaced with the text to synthesize.
​
results.callTemplate.externalVoice.generic.
responseSampleRate
integer<int32>
The sample rate of the audio returned by the API.
​
results.callTemplate.externalVoice.generic.
responseWordsPerMinute
integer<int32>
An estimate of the speaking rate of the returned audio in words per minute. This is
used for transcript timing while audio is streamed in the response. (Once the response
is complete, Ultravox Realtime uses the real audio duration to adjust the timing.)
Defaults to 150 and is unused for non-streaming responses.
​
results.callTemplate.externalVoice.generic.
responseMimeType
string
The real mime type of the content returned by the API. If unset, the Content-Type response header
will be used. This is useful for APIs whose response bodies don't strictly adhere to what the
API claims via header. For example, if your API claims to return audio/wav but omits the WAV
header (thus really returning raw PCM), set this to audio/l16. Similarly, if your API claims to
return JSON but actually streams JSON Lines, set this to application/jsonl.
​
results.callTemplate.externalVoice.generic.
jsonAudioFieldPath
string
For JSON responses, the path to the field containing base64-encoded audio data. The data must
be PCM audio, optionally with a WAV header.
​
results.callTemplate.externalVoice.generic.
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
results.callTemplate.
languageHint
string
A BCP47 language code that may be used to guide speech recognition and synthesis.
If multiple stages are defined for the call, this will be used only for stages without their own languageHint.
​
results.callTemplate.
timeExceededMessage
string
What the agent should say immediately before hanging up if the call's time limit is reached.
If multiple stages are defined for the call, this will be used only for stages without their own timeExceededMessage.
​
results.callTemplate.
inactivityMessages
object[]
Messages spoken by the agent when the user is inactive for the specified duration.
Durations are cumulative, so a message m > 1 with duration 30s will be spoken 30 seconds after message m-1.
If multiple stages are defined for the call, this will be used only for stages without their own inactivityMessages.
Show
child attributes
​
results.callTemplate.inactivityMessages.
duration
string
The duration after which the message should be spoken.
​
results.callTemplate.inactivityMessages.
message
string
The message to speak.
​
results.callTemplate.inactivityMessages.
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
results.callTemplate.
selectedTools
object[]
The tools available to the agent for this call.
The following fields are treated as templates when converting to a CallTool.
description
static_parameters.value
http.auth_headers.value
http.auth_query_params.value
If multiple stages are defined for the call, this will be used only for stages without their own selectedTools.
Show
child attributes
​
results.callTemplate.selectedTools.
toolId
string
The ID of an existing base tool.
​
results.callTemplate.selectedTools.
toolName
string
The name of an existing base tool. The name must uniquely identify the tool.
​
results.callTemplate.selectedTools.
temporaryTool
object
A temporary tool definition, available only for this call (and subsequent
calls created using priorCallId without overriding selected tools). Exactly one
implementation (http or client) should be set. See the 'Base Tool Definition'
schema for more details.
Show
child attributes
​
results.callTemplate.selectedTools.temporaryTool.
modelToolName
string
The name of the tool, as presented to the model. Must match ^[a-zA-Z0-9_-]{1,64}$.
​
results.callTemplate.selectedTools.temporaryTool.
description
string
The description of the tool.
​
results.callTemplate.selectedTools.temporaryTool.
dynamicParameters
object[]
The parameters that the tool accepts.
Show
child attributes
​
results.callTemplate.selectedTools.temporaryTool.dynamicParameters.
name
string
The name of the parameter.
​
results.callTemplate.selectedTools.temporaryTool.dynamicParameters.
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
results.callTemplate.selectedTools.temporaryTool.dynamicParameters.
schema
object
The JsonSchema definition of the parameter. This typically
includes things like type, description, enum values, format,
other restrictions, etc.
​
results.callTemplate.selectedTools.temporaryTool.dynamicParameters.
required
boolean
Whether the parameter is required.
​
results.callTemplate.selectedTools.temporaryTool.
staticParameters
object[]
The static parameters added when the tool is invoked.
Show
child attributes
​
results.callTemplate.selectedTools.temporaryTool.staticParameters.
name
string
The name of the parameter.
​
results.callTemplate.selectedTools.temporaryTool.staticParameters.
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
results.callTemplate.selectedTools.temporaryTool.staticParameters.
value
any
The value of the parameter.
​
results.callTemplate.selectedTools.temporaryTool.
automaticParameters
object[]
Additional parameters that are automatically set by the system when the tool is invoked.
Show
child attributes
​
results.callTemplate.selectedTools.temporaryTool.automaticParameters.
name
string
The name of the parameter.
​
results.callTemplate.selectedTools.temporaryTool.automaticParameters.
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
results.callTemplate.selectedTools.temporaryTool.automaticParameters.
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
results.callTemplate.selectedTools.temporaryTool.
requirements
object
Requirements that must be fulfilled when creating a call for the tool to be used.
Show
child attributes
​
results.callTemplate.selectedTools.temporaryTool.requirements.
httpSecurityOptions
object
Security requirements for an HTTP tool.
Show
child attributes
​
results.callTemplate.selectedTools.temporaryTool.requirements.httpSecurityOptions.
options
object[]
The options for security. Only one must be met. The first one that can be
satisfied will be used in general. The single exception to this rule is
that we always prefer a non-empty set of requirements over an empty set
unless no non-empty set can be satisfied.
Show
child attributes
​
results.callTemplate.selectedTools.temporaryTool.requirements.httpSecurityOptions.options.
requirements
object
Requirements keyed by name.
Show
child attributes
​
results.callTemplate.selectedTools.temporaryTool.requirements.httpSecurityOptions.options.requirements.
{key}
object
A single security requirement that must be met for a tool to be available. Exactly one
of query_api_key, header_api_key, or http_auth should be set.
Show
child attributes
​
results.callTemplate.selectedTools.temporaryTool.requirements.httpSecurityOptions.options.requirements.{key}.
queryApiKey
object
An API key must be added to the query string.
Show
child attributes
​
results.callTemplate.selectedTools.temporaryTool.requirements.httpSecurityOptions.options.requirements.{key}.queryApiKey.
name
string
The name of the query parameter.
​
results.callTemplate.selectedTools.temporaryTool.requirements.httpSecurityOptions.options.requirements.{key}.
headerApiKey
object
An API key must be added to a custom header.
Show
child attributes
​
results.callTemplate.selectedTools.temporaryTool.requirements.httpSecurityOptions.options.requirements.{key}.headerApiKey.
name
string
The name of the header.
​
results.callTemplate.selectedTools.temporaryTool.requirements.httpSecurityOptions.options.requirements.{key}.
httpAuth
object
The HTTP authentication header must be added.
Show
child attributes
​
results.callTemplate.selectedTools.temporaryTool.requirements.httpSecurityOptions.options.requirements.{key}.httpAuth.
scheme
string
The scheme of the HTTP authentication, e.g. "Bearer".
​
results.callTemplate.selectedTools.temporaryTool.requirements.httpSecurityOptions.options.
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
results.callTemplate.selectedTools.temporaryTool.requirements.httpSecurityOptions.options.ultravoxCallTokenRequirement.
scopes
string[]
The scopes that must be present in the token.
​
results.callTemplate.selectedTools.temporaryTool.requirements.
requiredParameterOverrides
string[]
Dynamic parameters that must be overridden with an explicit (static) value.
​
results.callTemplate.selectedTools.temporaryTool.
timeout
string
The maximum amount of time the tool is allowed for execution. The conversation is frozen
while tools run, so prefer sticking to the default unless you're comfortable with that
consequence. If your tool is too slow for the default and can't be made faster, still try to
keep this timeout as low as possible.
​
results.callTemplate.selectedTools.temporaryTool.
precomputable
boolean
The tool is guaranteed to be non-mutating, repeatable, and free of side-effects. Such tools
can safely be executed speculatively, reducing their effective latency. However, the fact they
were called may not be reflected in the call history if their result ends up unused.
​
results.callTemplate.selectedTools.temporaryTool.
http
object
Details for an HTTP tool.
Show
child attributes
​
results.callTemplate.selectedTools.temporaryTool.http.
baseUrlPattern
string
The base URL pattern for the tool, possibly with placeholders for path parameters.
​
results.callTemplate.selectedTools.temporaryTool.http.
httpMethod
string
The HTTP method for the tool.
​
results.callTemplate.selectedTools.temporaryTool.
client
object
Details for a client-implemented tool. Only body parameters are allowed
for client tools.
​
results.callTemplate.selectedTools.temporaryTool.
dataConnection
object
Details for a tool implemented via a data connection websocket. Only body
parameters are allowed for data connection tools.
​
results.callTemplate.selectedTools.temporaryTool.
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
results.callTemplate.selectedTools.temporaryTool.
staticResponse
object
Static response to a tool. When this is used, this response will be returned
without waiting for the tool's response.
Show
child attributes
​
results.callTemplate.selectedTools.temporaryTool.staticResponse.
responseText
string
The predefined text response to be returned immediately
​
results.callTemplate.selectedTools.
nameOverride
string
An override for the model_tool_name. This is primarily useful when using
multiple instances of the same durable tool (presumably with different
parameter overrides.) The set of tools used within a call must have a unique
set of model names and every name must match this pattern: ^[a-zA-Z0-9_-]{1,64}$.
​
results.callTemplate.selectedTools.
descriptionOverride
string
An override for the tool's description, as presented to the model. This is primarily
useful when using a built-in tool whose description you want to tweak to better fit
the rest of your prompt.
​
results.callTemplate.selectedTools.
authTokens
object
Auth tokens used to satisfy the tool's security requirements.
Show
child attributes
​
results.callTemplate.selectedTools.authTokens.
{key}
string
​
results.callTemplate.selectedTools.
parameterOverrides
object
Static values to use in place of dynamic parameters. Any parameter included
here will be hidden from the model and the static value will be used instead.
Some tools may require certain parameters to be overridden, but any parameter
can be overridden regardless of whether it is required to be.
Show
child attributes
​
results.callTemplate.selectedTools.parameterOverrides.
{key}
any
Represents a dynamically typed value which can be either null, a number, a string, a boolean, a recursive struct value, or a list of values.
​
results.callTemplate.selectedTools.
transitionId
string
For internal use. Relates this tool to a stage transition definition within a call template for attribution.
​
results.callTemplate.
dataConnection
object
Data connection configuration for calls created with this agent.
Show
child attributes
​
results.callTemplate.dataConnection.
websocketUrl
string
The websocket URL to which the session will connect to stream data messages.
​
results.callTemplate.dataConnection.
audioConfig
object
Audio configuration for the data connection. If not set, no audio will be sent.
Show
child attributes
​
results.callTemplate.dataConnection.audioConfig.
sampleRate
integer<int32>
The sample rate of the audio stream. If not set, will default to 16000.
​
results.callTemplate.dataConnection.audioConfig.
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
results.callTemplate.dataConnection.
dataMessages
object
Controls which data messages are enabled for the data connection.
Show
child attributes
​
results.callTemplate.dataConnection.dataMessages.
pong
boolean
Responds to a ping message. (Default: enabled)
​
results.callTemplate.dataConnection.dataMessages.
state
boolean
Indicates that the agent state has changed. (Default: enabled)
​
results.callTemplate.dataConnection.dataMessages.
transcript
boolean
Provides transcripts of the user and agent speech. (Default: enabled)
​
results.callTemplate.dataConnection.dataMessages.
clientToolInvocation
boolean
Requests a client-implemented tool invocation. (Default: enabled)
​
results.callTemplate.dataConnection.dataMessages.
dataConnectionToolInvocation
boolean
Requests a data-connection-implemented tool invocation. (Default: enabled for data connections, disabled otherwise)
​
results.callTemplate.dataConnection.dataMessages.
playbackClearBuffer
boolean
Requests the client-side audio buffer to be cleared. (Default: enabled for websocket connections, disabled otherwise)
​
results.callTemplate.dataConnection.dataMessages.
callStarted
boolean
Provides information about the call when it starts. (Default: enabled)
​
results.callTemplate.dataConnection.dataMessages.
debug
boolean
Communicates debug information. (Default: disabled)
​
results.callTemplate.dataConnection.dataMessages.
callEvent
boolean
Indicates that a call event has been recorded. (Default: disabled)
​
results.callTemplate.dataConnection.dataMessages.
toolUsed
boolean
Indicates that a tool was used. (Default: disabled)
​
results.callTemplate.
contextSchema
object
JSON schema for the variables used in string templates. If unset, a default schema will
be created from the variables used in the string templates.
Call creation requests must provide context adhering to this schema.
The follow fields are treated as templates:
system_prompt
language_hint
time_exceeded_message
inactivity_messages.message
selected_tools.description
selected_tools.static_parameters.value
selected_tools.http.auth_headers.value
selected_tools.http.auth_query_params.value
If multiple stages are defined for the call, each must define its own context schema (or use the generated one).
​
next
string<uri> | null
Example
:
"http://api.example.org/accounts/?cursor=cD00ODY%3D\""
​
previous
string<uri> | null
Example
:
"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3"
​
total
integer
Example
:
123
Previous
Create Agent
Creates a new agent using the specified name and call template
Next
⌘
I
discord
github
x
Powered by Mintlify
```
