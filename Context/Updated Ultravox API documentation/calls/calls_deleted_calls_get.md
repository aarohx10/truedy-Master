# Get Deleted Call

**URL:** https://docs.ultravox.ai/api-reference/calls/calls-deleted-calls-get

## Description
Gets details for the specified deleted call

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/deleted_calls/{call_id}\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/deleted_calls/{call_id}\--header'X-API-Key: <api-key>'
```

## Response

### Response Schema

```json
{"callId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","accountId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","created":"2023-11-07T05:31:56Z","deletionTime":"2023-11-07T05:31:56Z","endReason":"unjoined","recordingEnabled":true,"hadSummary":true,"joined":"2023-11-07T05:31:56Z","ended":"2023-11-07T05:31:56Z","maxDuration":"3600s"}
```

```json
{"callId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","accountId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","created":"2023-11-07T05:31:56Z","deletionTime":"2023-11-07T05:31:56Z","endReason":"unjoined","recordingEnabled":true,"hadSummary":true,"joined":"2023-11-07T05:31:56Z","ended":"2023-11-07T05:31:56Z","maxDuration":"3600s"}
```

## Full Content

```
Calls, Messages, Stages
Get Deleted Call
Gets details for the specified deleted call
GET
/
api
/
deleted_calls
/
{call_id}
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
https://api.ultravox.ai/api/deleted_calls/{call_id}
\
--header
'X-API-Key: <api-key>'
200
Copy
Ask AI
{
"callId"
:
"3c90c3cc-0d44-4b50-8888-8dd25736052a"
,
"accountId"
:
"3c90c3cc-0d44-4b50-8888-8dd25736052a"
,
"created"
:
"2023-11-07T05:31:56Z"
,
"deletionTime"
:
"2023-11-07T05:31:56Z"
,
"endReason"
:
"unjoined"
,
"recordingEnabled"
:
true
,
"hadSummary"
:
true
,
"joined"
:
"2023-11-07T05:31:56Z"
,
"ended"
:
"2023-11-07T05:31:56Z"
,
"maxDuration"
:
"3600s"
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
Response
200 - application/json
​
callId
string<uuid>
required
​
accountId
string<uuid>
required
​
created
string<date-time>
required
​
deletionTime
string<date-time>
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
recordingEnabled
boolean
required
​
hadSummary
boolean
required
​
joined
string<date-time> | null
​
ended
string<date-time> | null
​
maxDuration
string
default:
3600s
Previous
List Call Events
Returns any events logged during the call
Next
⌘
I
discord
github
x
Powered by Mintlify
```
