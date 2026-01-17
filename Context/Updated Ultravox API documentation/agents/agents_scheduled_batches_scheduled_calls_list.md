# List Scheduled Call Batch Scheduled Calls

**URL:** https://docs.ultravox.ai/api-reference/agents/agents-scheduled-batches-scheduled-calls-list

## Description
Returns details for all scheduled calls in a scheduled call batch

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/agents/{agent_id}/scheduled_batches/{batch_id}/scheduled_calls\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/agents/{agent_id}/scheduled_batches/{batch_id}/scheduled_calls\--header'X-API-Key: <api-key>'
```

## Response

### Response Schema

```json
{"results": [{"status":"FUTURE","batchId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","callId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","error":"<string>","medium": {"webRtc": {"dataMessages": {"pong":true,"state":true,"transcript":true,"clientToolInvocation":true,"dataConnectionToolInvocation":true,"playbackClearBuffer":true,"callStarted":true,"debug":true,"callEvent":true,"toolUsed":true}},"twilio": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"serverWebSocket": {"inputSampleRate":123,"outputSampleRate":123,"clientBufferSizeMs":123,"dataMessages": {"pong":true,"state":true,"transcript":true,"clientToolInvocation":true,"dataConnectionToolInvocation":true,"playbackClearBuffer":true,"callStarted":true,"debug":true,"callEvent":true,"toolUsed":true}},"telnyx": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"plivo": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"exotel": {},"sip": {"incoming": {},"outgoing": {"to":"<string>","from":"<string>","username":"<string>","password":"<string>"}}},"metadata":"<unknown>","templateContext":"<unknown>","experimentalSettings":"<unknown>"}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

```json
{"results": [{"status":"FUTURE","batchId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","callId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","error":"<string>","medium": {"webRtc": {"dataMessages": {"pong":true,"state":true,"transcript":true,"clientToolInvocation":true,"dataConnectionToolInvocation":true,"playbackClearBuffer":true,"callStarted":true,"debug":true,"callEvent":true,"toolUsed":true}},"twilio": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"serverWebSocket": {"inputSampleRate":123,"outputSampleRate":123,"clientBufferSizeMs":123,"dataMessages": {"pong":true,"state":true,"transcript":true,"clientToolInvocation":true,"dataConnectionToolInvocation":true,"playbackClearBuffer":true,"callStarted":true,"debug":true,"callEvent":true,"toolUsed":true}},"telnyx": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"plivo": {"outgoing": {"to":"<string>","from":"<string>","additionalParams": {}}},"exotel": {},"sip": {"incoming": {},"outgoing": {"to":"<string>","from":"<string>","username":"<string>","password":"<string>"}}},"metadata":"<unknown>","templateContext":"<unknown>","experimentalSettings":"<unknown>"}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

## Full Content

```
Scheduled Call Batches
List Scheduled Call Batch Scheduled Calls
Returns details for all scheduled calls in a scheduled call batch
GET
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
/
scheduled_calls
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
https://api.ultravox.ai/api/agents/{agent_id}/scheduled_batches/{batch_id}/scheduled_calls
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
"status"
:
"FUTURE"
,
"batchId"
:
"3c90c3cc-0d44-4b50-8888-8dd25736052a"
,
"callId"
:
"3c90c3cc-0d44-4b50-8888-8dd25736052a"
,
"error"
:
"<string>"
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
"metadata"
:
"<unknown>"
,
"templateContext"
:
"<unknown>"
,
"experimentalSettings"
:
"<unknown>"
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
Path Parameters
​
agent_id
string<uuid>
required
​
batch_id
string<uuid>
required
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
status
enum<string>
FUTURE
- FUTURE
PENDING
- PENDING
SUCCESS
- SUCCESS
EXPIRED
- EXPIRED
ERROR
- ERROR
Available options
:
FUTURE
,
PENDING
,
SUCCESS
,
EXPIRED
,
ERROR
Minimum string length:
1
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
status
enum<string>
required
Available options
:
FUTURE
,
PENDING
,
SUCCESS
,
EXPIRED
,
ERROR
​
results.
batchId
string<uuid>
required
​
results.
callId
string<uuid> | null
required
​
results.
error
string | null
required
​
results.
medium
object
The call medium to use for the call. In particular, allows for specifying per-call recipients for outgoing media.
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
metadata
any | null
Optional metadata key-value pairs to associate with the call. All values must be strings.
​
results.
templateContext
any | null
The context used to render the agent's template.
​
results.
experimentalSettings
unknown
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
Calls Overview
Understanding Calls in Ultravox
Next
⌘
I
discord
github
x
Powered by Mintlify
```
