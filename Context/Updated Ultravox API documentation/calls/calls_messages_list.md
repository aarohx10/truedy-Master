# List Call Messages

**URL:** https://docs.ultravox.ai/api-reference/calls/calls-messages-list

## Description
Returns all messages generated during the given call

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/calls/{call_id}/messages\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/calls/{call_id}/messages\--header'X-API-Key: <api-key>'
```

## Response

### Response Schema

```json
{"results": [{"role":"MESSAGE_ROLE_UNSPECIFIED","text":"<string>","invocationId":"<string>","toolName":"<string>","errorDetails":"<string>","medium":"MESSAGE_MEDIUM_UNSPECIFIED","callStageMessageIndex":123,"callStageId":"<string>","callState": {},"timespan": {"start":"<string>","end":"<string>"},"wallClockTimespan": {"start":"<string>","end":"<string>"}}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

```json
{"results": [{"role":"MESSAGE_ROLE_UNSPECIFIED","text":"<string>","invocationId":"<string>","toolName":"<string>","errorDetails":"<string>","medium":"MESSAGE_MEDIUM_UNSPECIFIED","callStageMessageIndex":123,"callStageId":"<string>","callState": {},"timespan": {"start":"<string>","end":"<string>"},"wallClockTimespan": {"start":"<string>","end":"<string>"}}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

## Full Content

```
Calls, Messages, Stages
List Call Messages
Returns all messages generated during the given call
GET
/
api
/
calls
/
{call_id}
/
messages
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
https://api.ultravox.ai/api/calls/{call_id}/messages
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
"role"
:
"MESSAGE_ROLE_UNSPECIFIED"
,
"text"
:
"<string>"
,
"invocationId"
:
"<string>"
,
"toolName"
:
"<string>"
,
"errorDetails"
:
"<string>"
,
"medium"
:
"MESSAGE_MEDIUM_UNSPECIFIED"
,
"callStageMessageIndex"
:
123
,
"callStageId"
:
"<string>"
,
"callState"
: {},
"timespan"
: {
"start"
:
"<string>"
,
"end"
:
"<string>"
},
"wallClockTimespan"
: {
"start"
:
"<string>"
,
"end"
:
"<string>"
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
Path Parameters
​
call_id
string<uuid>
required
Query Parameters
​
cursor
string
The pagination cursor value.
​
mode
enum<string>
default:
last_stage
last_stage
- Returns all messages for the call's last stage, similar to most call fields
in_call
- Returns messages from all stages, excluding initialMessages
Available options
:
last_stage
,
in_call
Minimum string length:
1
​
pageSize
integer
Number of results to return per page.
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
results.
text
string
The message text for user and agent messages, tool arguments for tool_call messages, tool results for tool_result messages.
​
results.
invocationId
string
The invocation ID for tool messages. Used to pair tool calls with their results.
​
results.
toolName
string
The tool name for tool messages.
​
results.
errorDetails
string
For failed tool calls, additional debugging information. While the text field is
presented to the model so it can respond to failures gracefully, the full details
are only exposed via the Ultravox REST API.
​
results.
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
results.
callStageMessageIndex
integer<int32>
The index of the message within the call stage.
​
results.
callStageId
string
The call stage this message appeared in.
​
results.
callState
object
If the message updated the call state, the new call state.
​
results.
timespan
object
The timespan during the call when this message occurred, according
to the input audio stream.
This is only set for messages that occurred during the call (stage)
and not for messages in the call's (call stage's) initial messages.
Show
child attributes
​
results.timespan.
start
string
The offset relative to the start of the call.
​
results.timespan.
end
string
The offset relative to the start of the call.
​
results.
wallClockTimespan
object
The timespan during the call when this message occurred, according
the wall clock, relative to the call's joined time.
This is only set for messages that occurred during the call (stage)
and not for messages in the call's (call stage's) initial messages.
Show
child attributes
​
results.wallClockTimespan.
start
string
The offset relative to the start of the call.
​
results.wallClockTimespan.
end
string
The offset relative to the start of the call.
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
List Call Tools
Returns all tools that were available at any point during the call
Next
⌘
I
discord
github
x
Powered by Mintlify
```
