# Update Scheduled Call Batch

**URL:** https://docs.ultravox.ai/api-reference/agents/agents-scheduled-batches-patch

## Description
Updates a scheduled call batch

## Endpoint
```
PATCH 
```

## Request

### cURL Example
```bash
curl--requestPATCH\--urlhttps://api.ultravox.ai/api/agents/{agent_id}/scheduled_batches/{batch_id}\--header'Content-Type: application/json'\--header'X-API-Key: <api-key>'\--data'{"windowStart": "2023-11-07T05:31:56Z","windowEnd": "2023-11-07T05:31:56Z","webhookUrl": "<string>","webhookSecret": "<string>","paused": true,"calls": [{"medium": {"webRtc": {"dataMessages": {"pong": true,"state": true,"transcript": true,"clientToolInvocation": true,"dataConnectionToolInvocation": true,"playbackClearBuffer": true,"callStarted": true,"debug": true,"callEvent": true,"toolUsed": true}},"twilio": {"outgoing": {"to": "<string>","from": "<string>","additionalParams": {}}},"serverWebSocket": {"inputSampleRate": 123,"outputSampleRate": 123,"clientBufferSizeMs": 123,"dataMessages": {"pong": true,"state": true,"transcript": true,"clientToolInvocation": true,"dataConnectionToolInvocation": true,"playbackClearBuffer": true,"callStarted": true,"debug": true,"callEvent": true,"toolUsed": true}},"telnyx": {"outgoing": {"to": "<string>","from": "<string>","additionalParams": {}}},"plivo": {"outgoing": {"to": "<string>","from": "<string>","additionalParams": {}}},"exotel": {},"sip": {"incoming": {},"outgoing": {"to": "<string>","from": "<string>","username": "<string>","password": "<string>"}}},"metadata": "<unknown>","templateContext": "<unknown>","experimentalSettings": "<unknown>"}]}'
```

### cURL Example
```bash
curl--requestPATCH\--urlhttps://api.ultravox.ai/api/agents/{agent_id}/scheduled_batches/{batch_id}\--header'Content-Type: application/json'\--header'X-API-Key: <api-key>'\--data'{"windowStart": "2023-11-07T05:31:56Z","windowEnd": "2023-11-07T05:31:56Z","webhookUrl": "<string>","webhookSecret": "<string>","paused": true,"calls": [{"medium": {"webRtc": {"dataMessages": {"pong": true,"state": true,"transcript": true,"clientToolInvocation": true,"dataConnectionToolInvocation": true,"playbackClearBuffer": true,"callStarted": true,"debug": true,"callEvent": true,"toolUsed": true}},"twilio": {"outgoing": {"to": "<string>","from": "<string>","additionalParams": {}}},"serverWebSocket": {"inputSampleRate": 123,"outputSampleRate": 123,"clientBufferSizeMs": 123,"dataMessages": {"pong": true,"state": true,"transcript": true,"clientToolInvocation": true,"dataConnectionToolInvocation": true,"playbackClearBuffer": true,"callStarted": true,"debug": true,"callEvent": true,"toolUsed": true}},"telnyx": {"outgoing": {"to": "<string>","from": "<string>","additionalParams": {}}},"plivo": {"outgoing": {"to": "<string>","from": "<string>","additionalParams": {}}},"exotel": {},"sip": {"incoming": {},"outgoing": {"to": "<string>","from": "<string>","username": "<string>","password": "<string>"}}},"metadata": "<unknown>","templateContext": "<unknown>","experimentalSettings": "<unknown>"}]}'
```

## Response

### Response Schema

```json
{"batchId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","created":"2023-11-07T05:31:56Z","totalCount":123,"completedCount":123,"endedAt":"2023-11-07T05:31:56Z","windowStart":"2023-11-07T05:31:56Z","windowEnd":"2023-11-07T05:31:56Z","webhookUrl":"<string>","webhookSecret":"<string>","paused":true}
```

```json
{"batchId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","created":"2023-11-07T05:31:56Z","totalCount":123,"completedCount":123,"endedAt":"2023-11-07T05:31:56Z","windowStart":"2023-11-07T05:31:56Z","windowEnd":"2023-11-07T05:31:56Z","webhookUrl":"<string>","webhookSecret":"<string>","paused":true}
```

## Full Content

```
Scheduled Call Batches
Update Scheduled Call Batch
Updates a scheduled call batch
PATCH
/
api
/
agents
/
{agent_id}
/
scheduled_batches
/
{batch_id}
Try it
cURL
cURL
Copy
Ask AI
curl
--request
PATCH
\
--url
https://api.ultravox.ai/api/agents/{agent_id}/scheduled_batches/{batch_id}
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
"windowStart": "2023-11-07T05:31:56Z",
"windowEnd": "2023-11-07T05:31:56Z",
"webhookUrl": "<string>",
"webhookSecret": "<string>",
"paused": true,
"calls": [
{
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
"metadata": "<unknown>",
"templateContext": "<unknown>",
"experimentalSettings": "<unknown>"
}
]
}
'
200
Copy
Ask AI
{
"batchId"
:
"3c90c3cc-0d44-4b50-8888-8dd25736052a"
,
"created"
:
"2023-11-07T05:31:56Z"
,
"totalCount"
:
123
,
"completedCount"
:
123
,
"endedAt"
:
"2023-11-07T05:31:56Z"
,
"windowStart"
:
"2023-11-07T05:31:56Z"
,
"windowEnd"
:
"2023-11-07T05:31:56Z"
,
"webhookUrl"
:
"<string>"
,
"webhookSecret"
:
"<string>"
,
"paused"
:
true
}
Allows partial modifications to the scheduled call batch.
Authorizations
​
X-API-Key
string
header
required
API key
Path Parameters
​
agent_id
string<uuid>
required
​
batch_id
string<uuid>
required
Body
application/json
​
windowStart
string<date-time> | null
The start of the time window during which calls can be made.
​
windowEnd
string<date-time> | null
The end of the time window during which calls can be made.
​
webhookUrl
string<uri> | null
The URL to which a request will be made (synchronously) when a call in the batch is created, excluding those with an outgoing medium. Required if any call has a non-outgoing medium and not allowed otherwise.
Maximum string length:
200
​
webhookSecret
string | null
The signing secret for requests made to the webhookUrl. This is used to verify that the request came from Ultravox. If unset, an appropriate secret will be chosen for you (but you'll still need to make your endpoint aware of it to verify requests).
Maximum string length:
120
​
paused
boolean
​
calls
object[]
Minimum array length:
1
Show
child attributes
​
calls.
medium
object
The call medium to use for the call. In particular, allows for specifying per-call recipients for outgoing media.
Show
child attributes
​
calls.medium.
webRtc
object
The call will use WebRTC with the Ultravox client SDK.
This is the default.
Show
child attributes
​
calls.medium.webRtc.
dataMessages
object
Controls which data messages are enabled for the call.
Show
child attributes
​
calls.medium.webRtc.dataMessages.
pong
boolean
Responds to a ping message. (Default: enabled)
​
calls.medium.webRtc.dataMessages.
state
boolean
Indicates that the agent state has changed. (Default: enabled)
​
calls.medium.webRtc.dataMessages.
transcript
boolean
Provides transcripts of the user and agent speech. (Default: enabled)
​
calls.medium.webRtc.dataMessages.
clientToolInvocation
boolean
Requests a client-implemented tool invocation. (Default: enabled)
​
calls.medium.webRtc.dataMessages.
dataConnectionToolInvocation
boolean
Requests a data-connection-implemented tool invocation. (Default: enabled for data connections, disabled otherwise)
​
calls.medium.webRtc.dataMessages.
playbackClearBuffer
boolean
Requests the client-side audio buffer to be cleared. (Default: enabled for websocket connections, disabled otherwise)
​
calls.medium.webRtc.dataMessages.
callStarted
boolean
Provides information about the call when it starts. (Default: enabled)
​
calls.medium.webRtc.dataMessages.
debug
boolean
Communicates debug information. (Default: disabled)
​
calls.medium.webRtc.dataMessages.
callEvent
boolean
Indicates that a call event has been recorded. (Default: disabled)
​
calls.medium.webRtc.dataMessages.
toolUsed
boolean
Indicates that a tool was used. (Default: disabled)
​
calls.medium.
twilio
object
The call will use Twilio's "Media Streams" protocol.
Once you have a join URL from starting a call, include it in your
TwiML like so:
This works for both inbound and outbound calls.
Show
child attributes
​
calls.medium.twilio.
outgoing
object
If set, Ultravox will directly create a call with Twilio. Twilio must be configured
for the requesting account.
Show
child attributes
​
calls.medium.twilio.outgoing.
to
string
The phone number, in E.164 format (e.g. +14155552671), (or sip address) to call.
​
calls.medium.twilio.outgoing.
from
string
The phone number or client identifier to use as the caller id. If
to
is a phone
number,
from
must be a phone number owned by your Twilio account.
​
calls.medium.twilio.outgoing.
additionalParams
object
Additional parameters to include in the Twilio call creation request.
See
https://www.twilio.com/docs/voice/api/call-resource#request-body-parameters
​
calls.medium.
serverWebSocket
object
The call will use a plain websocket connection. This is unlikely to yield an acceptable user
experience if used from a browser or mobile client, but may be suitable for a
server-to-server connection. This option provides a simple way to connect your own server to
an Ultravox inference instance.
Show
child attributes
​
calls.medium.serverWebSocket.
inputSampleRate
integer<int32>
The sample rate for input (user) audio. Required.
​
calls.medium.serverWebSocket.
outputSampleRate
integer<int32>
The desired sample rate for output (agent) audio. If unset, defaults to the input_sample_rate.
​
calls.medium.serverWebSocket.
clientBufferSizeMs
integer<int32>
The size of the client-side audio buffer in milliseconds. Smaller buffers allow for faster
interruptions but may cause audio underflow if network latency fluctuates too greatly. For
the best of both worlds, set this to some large value (e.g. 30000) and implement support for
playback_clear_buffer messages. Defaults to 60.
​
calls.medium.serverWebSocket.
dataMessages
object
Controls which data messages are enabled for the call.
Show
child attributes
​
calls.medium.serverWebSocket.dataMessages.
pong
boolean
Responds to a ping message. (Default: enabled)
​
calls.medium.serverWebSocket.dataMessages.
state
boolean
Indicates that the agent state has changed. (Default: enabled)
​
calls.medium.serverWebSocket.dataMessages.
transcript
boolean
Provides transcripts of the user and agent speech. (Default: enabled)
​
calls.medium.serverWebSocket.dataMessages.
clientToolInvocation
boolean
Requests a client-implemented tool invocation. (Default: enabled)
​
calls.medium.serverWebSocket.dataMessages.
dataConnectionToolInvocation
boolean
Requests a data-connection-implemented tool invocation. (Default: enabled for data connections, disabled otherwise)
​
calls.medium.serverWebSocket.dataMessages.
playbackClearBuffer
boolean
Requests the client-side audio buffer to be cleared. (Default: enabled for websocket connections, disabled otherwise)
​
calls.medium.serverWebSocket.dataMessages.
callStarted
boolean
Provides information about the call when it starts. (Default: enabled)
​
calls.medium.serverWebSocket.dataMessages.
debug
boolean
Communicates debug information. (Default: disabled)
​
calls.medium.serverWebSocket.dataMessages.
callEvent
boolean
Indicates that a call event has been recorded. (Default: disabled)
​
calls.medium.serverWebSocket.dataMessages.
toolUsed
boolean
Indicates that a tool was used. (Default: disabled)
​
calls.medium.
telnyx
object
The call will use Telnyx's media streaming protocol.
Once you have a join URL from starting a call, include it in your
TexML like so:
This works for both inbound and outbound calls.
Show
child attributes
​
calls.medium.telnyx.
outgoing
object
If set, Ultravox will directly create a call with Telnyx. Telnyx must be configured
for the requesting account.
Show
child attributes
​
calls.medium.telnyx.outgoing.
to
string
The phone number to call in E.164 format (e.g. +14155552671).
​
calls.medium.telnyx.outgoing.
from
string
The phone number initiating the call.
​
calls.medium.telnyx.outgoing.
additionalParams
object
Additional parameters to include in the Telnyx call creation request.
See
https://developers.telnyx.com/api/call-scripting/initiate-texml-call
​
calls.medium.
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
calls.medium.plivo.
outgoing
object
If set, Ultravox will directly create a call with Plivo. Plivo must be configured
for the requesting account.
Show
child attributes
​
calls.medium.plivo.outgoing.
to
string
The phone number(s) or sip URI(s) to call, separated by
<
if multiple.
​
calls.medium.plivo.outgoing.
from
string
The phone number initiating the call, in E.164 format (e.g. +14155552671).
​
calls.medium.plivo.outgoing.
additionalParams
object
Additional parameters to include in the Plivo call creation request.
See
https://www.plivo.com/docs/voice/api/call/make-a-call
​
calls.medium.
exotel
object
The call will use Exotel's "Voicebot" protocol.
Once you have a join URL from starting a call, provide it to Exotel as the wss target URL
for your Voicebot (either directly or more likely dynamically from your own server).
​
calls.medium.
sip
object
The call will be connected using Session Initiation Protocol (SIP). Note that SIP incurs
additional charges and must be enabled for your account.
Show
child attributes
​
calls.medium.sip.
incoming
object
Details for an incoming SIP call.
​
calls.medium.sip.
outgoing
object
Details for an outgoing SIP call. Ultravox will initiate this call (and there will be no joinUrl).
Show
child attributes
​
calls.medium.sip.outgoing.
to
string
The SIP URI to connect to. (Phone numbers are not allowed.)
​
calls.medium.sip.outgoing.
from
string
The SIP URI to connect from. This is the "from" field in the SIP INVITE.
​
calls.medium.sip.outgoing.
username
string
The SIP username to use for authentication.
​
calls.medium.sip.outgoing.
password
string
The password for the specified username.
​
calls.
metadata
any | null
Optional metadata key-value pairs to associate with the call. All values must be strings.
​
calls.
templateContext
any | null
The context used to render the agent's template.
​
calls.
experimentalSettings
unknown
Response
200 - application/json
​
batchId
string<uuid>
required
​
created
string<date-time>
required
​
totalCount
integer
required
The total number of calls in this batch.
​
completedCount
integer
required
The number of calls in this batch that have been completed (created or error).
​
endedAt
string<date-time> | null
required
​
windowStart
string<date-time> | null
The start of the time window during which calls can be made.
​
windowEnd
string<date-time> | null
The end of the time window during which calls can be made.
​
webhookUrl
string<uri> | null
The URL to which a request will be made (synchronously) when a call in the batch is created, excluding those with an outgoing medium. Required if any call has a non-outgoing medium and not allowed otherwise.
Maximum string length:
200
​
webhookSecret
string | null
The signing secret for requests made to the webhookUrl. This is used to verify that the request came from Ultravox. If unset, an appropriate secret will be chosen for you (but you'll still need to make your endpoint aware of it to verify requests).
Maximum string length:
120
​
paused
boolean
Previous
Delete Scheduled Call Batch
Deletes a scheduled call batch
Next
⌘
I
discord
github
x
Powered by Mintlify
```
