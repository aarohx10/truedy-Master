# List Calls

**URL:** https://docs.ultravox.ai/api-reference/calls/calls-list

## Description
Returns details for all calls

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/calls\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/calls\--header'X-API-Key: <api-key>'
```

## Response

### Response Schema

```json
{"results": [{"callId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","clientVersion":"<string>","created":"2023-11-07T05:31:56Z","joined":"2023-11-07T05:31:56Z","ended":"2023-11-07T05:31:56Z","endReason":"unjoined","billedDuration":"<string>","billingStatus":"BILLING_STATUS_PENDING","firstSpeaker":"FIRST_SPEAKER_AGENT","firstSpeakerSettings": {"user": {"fallback": {"delay":"<string>","text":"<string>","prompt":"<string>"}},"agent": {"uninterruptible":true,"text":"<string>","prompt":"<string>","delay":"<string>"}},"initialOutputMedium":"MESSAGE_MEDIUM_VOICE","joinUrl":"<string>","shortSummary":"<string>","summary":"<string>","agent": {"agentId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","name":"<string>"},"agentId":"<string>","experimentalSettings":"<unknown>","metadata": {},"initialState": {},"requestContext":"<unknown>","sipDetails": {"billedDuration":"<string>","terminationReason":"SIP_TERMINATION_NORMAL"},"inactivityMessages": [{"duration":"<string>","message":"<string>","endBehavior":"END_BEHAVIOR_UNSPECIFIED"}],"joinTimeout":"30s","languageHint":"<string>","maxDuration":"3600s","medium": {"webRtc": {"dataMessages": {"pong":true,"state":true,"transcript":true,"clientToolInvocation":true,"dataConnectionToolInvocation":true,"playbackClearBuffer":true,"callStarted":true,"debug":true,"callEvent":true,"toolUsed":true}},"twilio": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"serverWebSocket": {"inputSampleRate":123,"outputSampleRate":123,"clientBufferSizeMs":123,"dataMessages": {"pong":true,"state":true,"transcript":true,"clientToolInvocation":true,"dataConnectionToolInvocation":true,"playbackClearBuffer":true,"callStarted":true,"debug":true,"callEvent":true,"toolUsed":true}},"telnyx": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"plivo": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"exotel": {},"sip": {"incoming": {},"outgoing": {"to":"<string>","from":"<string>","username":"<string>","password":"<string>"}}},"model":"ultravox-v0.6","recordingEnabled":false,"systemPrompt":"<string>","temperature":0,"timeExceededMessage":"<string>","voice":"<string>","externalVoice": {"elevenLabs": {"voiceId":"<string>","model":"<string>","speed":123,"useSpeakerBoost":true,"style":123,"similarityBoost":123,"stability":123,"pronunciationDictionaries": [{"dictionaryId":"<string>","versionId":"<string>"}],"optimizeStreamingLatency":123,"maxSampleRate":123},"cartesia": {"voiceId":"<string>","model":"<string>","speed":123,"emotion":"<string>","emotions": ["<string>"],"generationConfig": {"volume":123,"speed":123,"emotion":"<string>"}},"lmnt": {"voiceId":"<string>","model":"<string>","speed":123,"conversational":true},"google": {"voiceId":"<string>","speakingRate":123},"generic": {"url":"<string>","headers": {},"body": {},"responseSampleRate":123,"responseWordsPerMinute":123,"responseMimeType":"<string>","jsonAudioFieldPath":"<string>","jsonByteEncoding":"JSON_BYTE_ENCODING_UNSPECIFIED"}},"transcriptOptional":true,"vadSettings": {"turnEndpointDelay":"<string>","minimumTurnDuration":"<string>","minimumInterruptionDuration":"<string>","frameActivationThreshold":123},"dataConnectionConfig": {"websocketUrl":"<string>","audioConfig": {"sampleRate":123,"channelMode":"CHANNEL_MODE_UNSPECIFIED"},"dataMessages": {"pong":true,"state":true,"transcript":true,"clientToolInvocation":true,"dataConnectionToolInvocation":true,"playbackClearBuffer":true,"callStarted":true,"debug":true,"callEvent":true,"toolUsed":true}},"callbacks": {"joined": {"url":"<string>","secrets": ["<string>"]},"ended": {"url":"<string>","secrets": ["<string>"]},"billed": {"url":"<string>","secrets": ["<string>"]}}}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

```json
{"results": [{"callId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","clientVersion":"<string>","created":"2023-11-07T05:31:56Z","joined":"2023-11-07T05:31:56Z","ended":"2023-11-07T05:31:56Z","endReason":"unjoined","billedDuration":"<string>","billingStatus":"BILLING_STATUS_PENDING","firstSpeaker":"FIRST_SPEAKER_AGENT","firstSpeakerSettings": {"user": {"fallback": {"delay":"<string>","text":"<string>","prompt":"<string>"}},"agent": {"uninterruptible":true,"text":"<string>","prompt":"<string>","delay":"<string>"}},"initialOutputMedium":"MESSAGE_MEDIUM_VOICE","joinUrl":"<string>","shortSummary":"<string>","summary":"<string>","agent": {"agentId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","name":"<string>"},"agentId":"<string>","experimentalSettings":"<unknown>","metadata": {},"initialState": {},"requestContext":"<unknown>","sipDetails": {"billedDuration":"<string>","terminationReason":"SIP_TERMINATION_NORMAL"},"inactivityMessages": [{"duration":"<string>","message":"<string>","endBehavior":"END_BEHAVIOR_UNSPECIFIED"}],"joinTimeout":"30s","languageHint":"<string>","maxDuration":"3600s","medium": {"webRtc": {"dataMessages": {"pong":true,"state":true,"transcript":true,"clientToolInvocation":true,"dataConnectionToolInvocation":true,"playbackClearBuffer":true,"callStarted":true,"debug":true,"callEvent":true,"toolUsed":true}},"twilio": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"serverWebSocket": {"inputSampleRate":123,"outputSampleRate":123,"clientBufferSizeMs":123,"dataMessages": {"pong":true,"state":true,"transcript":true,"clientToolInvocation":true,"dataConnectionToolInvocation":true,"playbackClearBuffer":true,"callStarted":true,"debug":true,"callEvent":true,"toolUsed":true}},"telnyx": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"plivo": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"exotel": {},"sip": {"incoming": {},"outgoing": {"to":"<string>","from":"<string>","username":"<string>","password":"<string>"}}},"model":"ultravox-v0.6","recordingEnabled":false,"systemPrompt":"<string>","temperature":0,"timeExceededMessage":"<string>","voice":"<string>","externalVoice": {"elevenLabs": {"voiceId":"<string>","model":"<string>","speed":123,"useSpeakerBoost":true,"style":123,"similarityBoost":123,"stability":123,"pronunciationDictionaries": [{"dictionaryId":"<string>","versionId":"<string>"}],"optimizeStreamingLatency":123,"maxSampleRate":123},"cartesia": {"voiceId":"<string>","model":"<string>","speed":123,"emotion":"<string>","emotions": ["<string>"],"generationConfig": {"volume":123,"speed":123,"emotion":"<string>"}},"lmnt": {"voiceId":"<string>","model":"<string>","speed":123,"conversational":true},"google": {"voiceId":"<string>","speakingRate":123},"generic": {"url":"<string>","headers": {},"body": {},"responseSampleRate":123,"responseWordsPerMinute":123,"responseMimeType":"<string>","jsonAudioFieldPath":"<string>","jsonByteEncoding":"JSON_BYTE_ENCODING_UNSPECIFIED"}},"transcriptOptional":true,"vadSettings": {"turnEndpointDelay":"<string>","minimumTurnDuration":"<string>","minimumInterruptionDuration":"<string>","frameActivationThreshold":123},"dataConnectionConfig": {"websocketUrl":"<string>","audioConfig": {"sampleRate":123,"channelMode":"CHANNEL_MODE_UNSPECIFIED"},"dataMessages": {"pong":true,"state":true,"transcript":true,"clientToolInvocation":true,"dataConnectionToolInvocation":true,"playbackClearBuffer":true,"callStarted":true,"debug":true,"callEvent":true,"toolUsed":true}},"callbacks": {"joined": {"url":"<string>","secrets": ["<string>"]},"ended": {"url":"<string>","secrets": ["<string>"]},"billed": {"url":"<string>","secrets": ["<string>"]}}}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

## Full Content

```
Calls, Messages, Stages
List Calls
Returns details for all calls
GET
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
GET
\
--url
https://api.ultravox.ai/api/calls
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
agentIds
string<uuid>[]
Filter calls by the agent IDs.
​
cursor
string
The pagination cursor value.
​
durationMax
string
Maximum duration of calls
​
durationMin
string
Minimum duration of calls
​
fromDate
string<date>
Start date (inclusive) for filtering calls by creation date
​
metadata
object
Filter calls by metadata. Use metadata.key=value to filter by specific key-value pairs.
Show
child attributes
​
metadata.
{key}
string
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
​
toDate
string<date>
End date (inclusive) for filtering calls by creation date
​
voiceId
string<uuid>
Filter calls by the associated voice ID
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
callId
string<uuid>
required
​
results.
clientVersion
string | null
required
The version of the client that joined this call.
​
results.
created
string<date-time>
required
​
results.
joined
string<date-time> | null
required
​
results.
ended
string<date-time> | null
required
​
results.
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
results.
billedDuration
string | null
required
​
results.
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
results.
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
results.
firstSpeakerSettings
object
required
Settings for the initial message to get the call started.
Show
child attributes
​
results.firstSpeakerSettings.
user
object
If set, the user should speak first.
Show
child attributes
​
results.firstSpeakerSettings.user.
fallback
object
If set, the agent will start the conversation itself if the user doesn't start
speaking within the given delay.
Show
child attributes
​
results.firstSpeakerSettings.user.fallback.
delay
string
How long the agent should wait before starting the conversation itself.
​
results.firstSpeakerSettings.user.fallback.
text
string
A specific greeting the agent should say.
​
results.firstSpeakerSettings.user.fallback.
prompt
string
A prompt for the agent to generate a greeting.
​
results.firstSpeakerSettings.
agent
object
If set, the agent should speak first.
Show
child attributes
​
results.firstSpeakerSettings.agent.
uninterruptible
boolean
Whether the user should be prevented from interrupting the agent's first message.
Defaults to false (meaning the agent is interruptible as usual).
​
results.firstSpeakerSettings.agent.
text
string
A specific greeting the agent should say.
​
results.firstSpeakerSettings.agent.
prompt
string
A prompt for the agent to generate a greeting.
​
results.firstSpeakerSettings.agent.
delay
string
If set, the agent will wait this long before starting its greeting. This may be useful
for ensuring the user is ready.
​
results.
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
results.
joinUrl
string | null
required
​
results.
shortSummary
string | null
required
A short summary of the call.
​
results.
summary
string | null
required
A summary of the call.
​
results.
agent
object
required
The agent used for this call.
Show
child attributes
​
results.agent.
agentId
string<uuid>
required
​
results.agent.
name
string
required
​
results.
agentId
string | null
required
The ID of the agent used for this call.
​
results.
experimentalSettings
any
required
Experimental settings for the call.
​
results.
metadata
object
required
Optional metadata key-value pairs to associate with the call. All values must be strings.
Show
child attributes
​
results.metadata.
{key}
string
​
results.
initialState
object
required
The initial state of the call which is readable/writable by tools.
Show
child attributes
​
results.initialState.
{key}
any
​
results.
requestContext
any
required
​
results.
sipDetails
object
required
SIP details for the call, if applicable.
Show
child attributes
​
results.sipDetails.
billedDuration
string | null
required
​
results.sipDetails.
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
results.
inactivityMessages
object[]
Messages spoken by the agent when the user is inactive for the specified duration. Durations are cumulative, so a message m > 1 with duration 30s will be spoken 30 seconds after message m-1.
Show
child attributes
​
results.inactivityMessages.
duration
string
The duration after which the message should be spoken.
​
results.inactivityMessages.
message
string
The message to speak.
​
results.inactivityMessages.
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
results.
joinTimeout
string
default:
30s
​
results.
languageHint
string | null
BCP47 language code that may be used to guide speech recognition.
Maximum string length:
16
​
results.
maxDuration
string
default:
3600s
​
results.
medium
object
Details about a call's protocol. By default, calls occur over WebRTC using
the Ultravox client SDK. Setting a different call medium will prepare the
server for a call using a different protocol.
At most one call medium may be set.
Show
child attributes
​
results.medium.
webRtc
object
The call will use WebRTC with the Ultravox client SDK.
This is the default.
Show
child attributes
​
results.medium.webRtc.
dataMessages
object
Controls which data messages are enabled for the call.
Show
child attributes
​
results.medium.webRtc.dataMessages.
pong
boolean
Responds to a ping message. (Default: enabled)
​
results.medium.webRtc.dataMessages.
state
boolean
Indicates that the agent state has changed. (Default: enabled)
​
results.medium.webRtc.dataMessages.
transcript
boolean
Provides transcripts of the user and agent speech. (Default: enabled)
​
results.medium.webRtc.dataMessages.
clientToolInvocation
boolean
Requests a client-implemented tool invocation. (Default: enabled)
​
results.medium.webRtc.dataMessages.
dataConnectionToolInvocation
boolean
Requests a data-connection-implemented tool invocation. (Default: enabled for data connections, disabled otherwise)
​
results.medium.webRtc.dataMessages.
playbackClearBuffer
boolean
Requests the client-side audio buffer to be cleared. (Default: enabled for websocket connections, disabled otherwise)
​
results.medium.webRtc.dataMessages.
callStarted
boolean
Provides information about the call when it starts. (Default: enabled)
​
results.medium.webRtc.dataMessages.
debug
boolean
Communicates debug information. (Default: disabled)
​
results.medium.webRtc.dataMessages.
callEvent
boolean
Indicates that a call event has been recorded. (Default: disabled)
​
results.medium.webRtc.dataMessages.
toolUsed
boolean
Indicates that a tool was used. (Default: disabled)
​
results.medium.
twilio
object
The call will use Twilio's "Media Streams" protocol.
Once you have a join URL from starting a call, include it in your
TwiML like so:
This works for both inbound and outbound calls.
Show
child attributes
​
results.medium.twilio.
outgoing
object
If set, Ultravox will directly create a call with Twilio. Twilio must be configured
for the requesting account.
Show
child attributes
​
results.medium.twilio.outgoing.
to
string
The phone number, in E.164 format (e.g. +14155552671), (or sip address) to call.
​
results.medium.twilio.outgoing.
from
string
The phone number or client identifier to use as the caller id. If
to
is a phone
number,
from
must be a phone number owned by your Twilio account.
​
results.medium.twilio.outgoing.
additionalParams
object
Additional parameters to include in the Twilio call creation request.
See
https://www.twilio.com/docs/voice/api/call-resource#request-body-parameters
​
results.medium.
serverWebSocket
object
The call will use a plain websocket connection. This is unlikely to yield an acceptable user
experience if used from a browser or mobile client, but may be suitable for a
server-to-server connection. This option provides a simple way to connect your own server to
an Ultravox inference instance.
Show
child attributes
​
results.medium.serverWebSocket.
inputSampleRate
integer<int32>
The sample rate for input (user) audio. Required.
​
results.medium.serverWebSocket.
outputSampleRate
integer<int32>
The desired sample rate for output (agent) audio. If unset, defaults to the input_sample_rate.
​
results.medium.serverWebSocket.
clientBufferSizeMs
integer<int32>
The size of the client-side audio buffer in milliseconds. Smaller buffers allow for faster
interruptions but may cause audio underflow if network latency fluctuates too greatly. For
the best of both worlds, set this to some large value (e.g. 30000) and implement support for
playback_clear_buffer messages. Defaults to 60.
​
results.medium.serverWebSocket.
dataMessages
object
Controls which data messages are enabled for the call.
Show
child attributes
​
results.medium.serverWebSocket.dataMessages.
pong
boolean
Responds to a ping message. (Default: enabled)
​
results.medium.serverWebSocket.dataMessages.
state
boolean
Indicates that the agent state has changed. (Default: enabled)
​
results.medium.serverWebSocket.dataMessages.
transcript
boolean
Provides transcripts of the user and agent speech. (Default: enabled)
​
results.medium.serverWebSocket.dataMessages.
clientToolInvocation
boolean
Requests a client-implemented tool invocation. (Default: enabled)
​
results.medium.serverWebSocket.dataMessages.
dataConnectionToolInvocation
boolean
Requests a data-connection-implemented tool invocation. (Default: enabled for data connections, disabled otherwise)
​
results.medium.serverWebSocket.dataMessages.
playbackClearBuffer
boolean
Requests the client-side audio buffer to be cleared. (Default: enabled for websocket connections, disabled otherwise)
​
results.medium.serverWebSocket.dataMessages.
callStarted
boolean
Provides information about the call when it starts. (Default: enabled)
​
results.medium.serverWebSocket.dataMessages.
debug
boolean
Communicates debug information. (Default: disabled)
​
results.medium.serverWebSocket.dataMessages.
callEvent
boolean
Indicates that a call event has been recorded. (Default: disabled)
​
results.medium.serverWebSocket.dataMessages.
toolUsed
boolean
Indicates that a tool was used. (Default: disabled)
​
results.medium.
telnyx
object
The call will use Telnyx's media streaming protocol.
Once you have a join URL from starting a call, include it in your
TexML like so:
This works for both inbound and outbound calls.
Show
child attributes
​
results.medium.telnyx.
outgoing
object
If set, Ultravox will directly create a call with Telnyx. Telnyx must be configured
for the requesting account.
Show
child attributes
​
results.medium.telnyx.outgoing.
to
string
The phone number to call in E.164 format (e.g. +14155552671).
​
results.medium.telnyx.outgoing.
from
string
The phone number initiating the call.
​
results.medium.telnyx.outgoing.
additionalParams
object
Additional parameters to include in the Telnyx call creation request.
See
https://developers.telnyx.com/api/call-scripting/initiate-texml-call
​
results.medium.
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
results.medium.plivo.
outgoing
object
If set, Ultravox will directly create a call with Plivo. Plivo must be configured
for the requesting account.
Show
child attributes
​
results.medium.plivo.outgoing.
to
string
The phone number(s) or sip URI(s) to call, separated by
<
if multiple.
​
results.medium.plivo.outgoing.
from
string
The phone number initiating the call, in E.164 format (e.g. +14155552671).
​
results.medium.plivo.outgoing.
additionalParams
object
Additional parameters to include in the Plivo call creation request.
See
https://www.plivo.com/docs/voice/api/call/make-a-call
​
results.medium.
exotel
object
The call will use Exotel's "Voicebot" protocol.
Once you have a join URL from starting a call, provide it to Exotel as the wss target URL
for your Voicebot (either directly or more likely dynamically from your own server).
​
results.medium.
sip
object
The call will be connected using Session Initiation Protocol (SIP). Note that SIP incurs
additional charges and must be enabled for your account.
Show
child attributes
​
results.medium.sip.
incoming
object
Details for an incoming SIP call.
​
results.medium.sip.
outgoing
object
Details for an outgoing SIP call. Ultravox will initiate this call (and there will be no joinUrl).
Show
child attributes
​
results.medium.sip.outgoing.
to
string
The SIP URI to connect to. (Phone numbers are not allowed.)
​
results.medium.sip.outgoing.
from
string
The SIP URI to connect from. This is the "from" field in the SIP INVITE.
​
results.medium.sip.outgoing.
username
string
The SIP username to use for authentication.
​
results.medium.sip.outgoing.
password
string
The password for the specified username.
​
results.
model
string
default:
ultravox-v0.6
​
results.
recordingEnabled
boolean
default:
false
​
results.
systemPrompt
string | null
​
results.
temperature
number<double>
default:
0
Required range
:
0 <= x <= 1
​
results.
timeExceededMessage
string | null
​
results.
voice
string | null
​
results.
externalVoice
object
A voice not known to Ultravox Realtime that can nonetheless be used for a call.
Such voices are significantly less validated than normal voices and you'll be
responsible for your own TTS-related errors.
Exactly one field must be set.
Show
child attributes
​
results.externalVoice.
elevenLabs
object
A voice served by ElevenLabs.
Show
child attributes
​
results.externalVoice.elevenLabs.
voiceId
string
The ID of the voice in ElevenLabs.
​
results.externalVoice.elevenLabs.
model
string
The ElevenLabs model to use.
​
results.externalVoice.elevenLabs.
speed
number<float>
The speaking rate. Must be between 0.7 and 1.2. Defaults to 1.
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.speed
​
results.externalVoice.elevenLabs.
useSpeakerBoost
boolean
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.use_speaker_boost
​
results.externalVoice.elevenLabs.
style
number<float>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.style
​
results.externalVoice.elevenLabs.
similarityBoost
number<float>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.similarity_boost
​
results.externalVoice.elevenLabs.
stability
number<float>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.stability
​
results.externalVoice.elevenLabs.
pronunciationDictionaries
object[]
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.pronunciation_dictionary_locators
Show
child attributes
​
results.externalVoice.elevenLabs.pronunciationDictionaries.
dictionaryId
string
The dictionary's ID.
​
results.externalVoice.elevenLabs.pronunciationDictionaries.
versionId
string
The dictionary's version.
​
results.externalVoice.elevenLabs.
optimizeStreamingLatency
integer<int32>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.query.optimize_streaming_latency.optimize_streaming_latency
​
results.externalVoice.elevenLabs.
maxSampleRate
integer<int32>
The maximum sample rate Ultravox will try to use. ElevenLabs limits your allowed sample rate
based on your tier. See
https://elevenlabs.io/pricing#pricing-table
(and click "Show API details")
​
results.externalVoice.
cartesia
object
A voice served by Cartesia.
Show
child attributes
​
results.externalVoice.cartesia.
voiceId
string
The ID of the voice in Cartesia.
​
results.externalVoice.cartesia.
model
string
The Cartesia model to use.
​
results.externalVoice.cartesia.
speed
number<float>
(Deprecated) The speaking rate. Must be between -1 and 1. Defaults to 0.
​
results.externalVoice.cartesia.
emotion
string
(Deprecated) Use generation_config.emotion instead.
​
results.externalVoice.cartesia.
emotions
string[]
(Deprecated) Use generation_config.emotion instead.
​
results.externalVoice.cartesia.
generationConfig
object
Configure the various attributes of the generated speech.
Show
child attributes
​
results.externalVoice.cartesia.generationConfig.
volume
number<float>
Adjust the volume of the generated speech between 0.5x and 2.0x the original volume (default is 1.0x). Valid values are between [0.5, 2.0] inclusive.
​
results.externalVoice.cartesia.generationConfig.
speed
number<float>
Adjust the speed of the generated speech between 0.6x and 2.0x the original speed (default is 1.0x). Valid values are between [0.6, 1.5] inclusive.
​
results.externalVoice.cartesia.generationConfig.
emotion
string
The primary emotions are neutral, calm, angry, content, sad, scared. For more options, see Prompting Sonic-3.
​
results.externalVoice.
lmnt
object
A voice served by LMNT.
Show
child attributes
​
results.externalVoice.lmnt.
voiceId
string
The ID of the voice in LMNT.
​
results.externalVoice.lmnt.
model
string
The LMNT model to use.
​
results.externalVoice.lmnt.
speed
number<float>
The speaking rate. Must be between 0.25 and 2. Defaults to 1.
See
https://docs.lmnt.com/api-reference/speech/synthesize-speech-bytes#body-speed
​
results.externalVoice.lmnt.
conversational
boolean
See
https://docs.lmnt.com/api-reference/speech/synthesize-speech-bytes#body-conversational
​
results.externalVoice.
google
object
A voice served by Google, using bidirectional streaming.
(For non-streaming or output-only streaming, use generic.)
Show
child attributes
​
results.externalVoice.google.
voiceId
string
The ID (name) of the voice in Google, e.g. "en-US-Chirp3-HD-Charon".
​
results.externalVoice.google.
speakingRate
number<float>
The speaking rate. Must be between 0.25 and 2. Defaults to 1.
See
https://cloud.google.com/python/docs/reference/texttospeech/latest/google.cloud.texttospeech_v1.types.StreamingAudioConfig
​
results.externalVoice.
generic
object
A voice served by a generic REST-based TTS API.
Show
child attributes
​
results.externalVoice.generic.
url
string
The endpoint to which requests are sent.
​
results.externalVoice.generic.
headers
object
Headers to include in the request.
Show
child attributes
​
results.externalVoice.generic.headers.
{key}
string
​
results.externalVoice.generic.
body
object
The request body to send. Some field should include a placeholder for text
represented as {text}. The placeholder will be replaced with the text to synthesize.
​
results.externalVoice.generic.
responseSampleRate
integer<int32>
The sample rate of the audio returned by the API.
​
results.externalVoice.generic.
responseWordsPerMinute
integer<int32>
An estimate of the speaking rate of the returned audio in words per minute. This is
used for transcript timing while audio is streamed in the response. (Once the response
is complete, Ultravox Realtime uses the real audio duration to adjust the timing.)
Defaults to 150 and is unused for non-streaming responses.
​
results.externalVoice.generic.
responseMimeType
string
The real mime type of the content returned by the API. If unset, the Content-Type response header
will be used. This is useful for APIs whose response bodies don't strictly adhere to what the
API claims via header. For example, if your API claims to return audio/wav but omits the WAV
header (thus really returning raw PCM), set this to audio/l16. Similarly, if your API claims to
return JSON but actually streams JSON Lines, set this to application/jsonl.
​
results.externalVoice.generic.
jsonAudioFieldPath
string
For JSON responses, the path to the field containing base64-encoded audio data. The data must
be PCM audio, optionally with a WAV header.
​
results.externalVoice.generic.
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
results.
transcriptOptional
boolean
default:
true
deprecated
Indicates whether a transcript is optional for the call.
​
results.
vadSettings
object
VAD settings for the call.
Show
child attributes
​
results.vadSettings.
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
results.vadSettings.
minimumTurnDuration
string
The minimum duration of user speech required to be considered a user turn.
Increasing this value will cause the agent to ignore short user audio. This may be useful in
particularly noisy environments, but it comes at the cost of possibly ignoring very short
user responses such as "yes" or "no".
Defaults to "0s" meaning the agent considers all user audio inputs (that make it through
built-in noise cancellation).
​
results.vadSettings.
minimumInterruptionDuration
string
The minimum duration of user speech required to interrupt the agent. This works the same way
as minimumTurnDuration, but allows for a higher threshold for interrupting the agent. (This
value will be ignored if it is less than minimumTurnDuration.)
Defaults to "0.09s" (90ms) as a starting point, but there's nothing special about this value.
​
results.vadSettings.
frameActivationThreshold
number<float>
The threshold for the VAD to consider a frame as speech. This is a value between 0.1 and 1.
Miniumum value is 0.1, which is the default value.
​
results.
dataConnectionConfig
object
Settings for exchanging data messages with an additional participant.
Show
child attributes
​
results.dataConnectionConfig.
websocketUrl
string
The websocket URL to which the session will connect to stream data messages.
​
results.dataConnectionConfig.
audioConfig
object
Audio configuration for the data connection. If not set, no audio will be sent.
Show
child attributes
​
results.dataConnectionConfig.audioConfig.
sampleRate
integer<int32>
The sample rate of the audio stream. If not set, will default to 16000.
​
results.dataConnectionConfig.audioConfig.
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
results.dataConnectionConfig.
dataMessages
object
Controls which data messages are enabled for the data connection.
Show
child attributes
​
results.dataConnectionConfig.dataMessages.
pong
boolean
Responds to a ping message. (Default: enabled)
​
results.dataConnectionConfig.dataMessages.
state
boolean
Indicates that the agent state has changed. (Default: enabled)
​
results.dataConnectionConfig.dataMessages.
transcript
boolean
Provides transcripts of the user and agent speech. (Default: enabled)
​
results.dataConnectionConfig.dataMessages.
clientToolInvocation
boolean
Requests a client-implemented tool invocation. (Default: enabled)
​
results.dataConnectionConfig.dataMessages.
dataConnectionToolInvocation
boolean
Requests a data-connection-implemented tool invocation. (Default: enabled for data connections, disabled otherwise)
​
results.dataConnectionConfig.dataMessages.
playbackClearBuffer
boolean
Requests the client-side audio buffer to be cleared. (Default: enabled for websocket connections, disabled otherwise)
​
results.dataConnectionConfig.dataMessages.
callStarted
boolean
Provides information about the call when it starts. (Default: enabled)
​
results.dataConnectionConfig.dataMessages.
debug
boolean
Communicates debug information. (Default: disabled)
​
results.dataConnectionConfig.dataMessages.
callEvent
boolean
Indicates that a call event has been recorded. (Default: disabled)
​
results.dataConnectionConfig.dataMessages.
toolUsed
boolean
Indicates that a tool was used. (Default: disabled)
​
results.
callbacks
object
Callbacks configuration for the call.
Show
child attributes
​
results.callbacks.
joined
object
Callback invoked when the call is joined.
Show
child attributes
​
results.callbacks.joined.
url
string
The URL to invoke.
​
results.callbacks.joined.
secrets
string[]
Secrets to use to signing the callback request.
​
results.callbacks.
ended
object
Callback invoked when the call has ended.
Show
child attributes
​
results.callbacks.ended.
url
string
The URL to invoke.
​
results.callbacks.ended.
secrets
string[]
Secrets to use to signing the callback request.
​
results.callbacks.
billed
object
Callback invoked when the call is billed.
Show
child attributes
​
results.callbacks.billed.
url
string
The URL to invoke.
​
results.callbacks.billed.
secrets
string[]
Secrets to use to signing the callback request.
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
Get Call
Gets details for the specified call
Next
⌘
I
discord
github
x
Powered by Mintlify
```
