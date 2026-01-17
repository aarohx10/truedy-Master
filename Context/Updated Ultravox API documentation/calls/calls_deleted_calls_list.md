# List Deleted Calls

**URL:** https://docs.ultravox.ai/api-reference/calls/calls-deleted-calls-list

## Description
Returns details for all deleted calls

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/deleted_calls\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/deleted_calls\--header'X-API-Key: <api-key>'
```

## Response

### Response Schema

```json
{"results": [{"callId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","accountId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","created":"2023-11-07T05:31:56Z","deletionTime":"2023-11-07T05:31:56Z","endReason":"unjoined","recordingEnabled":true,"hadSummary":true,"joined":"2023-11-07T05:31:56Z","ended":"2023-11-07T05:31:56Z","maxDuration":"3600s"}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

```json
{"results": [{"callId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","accountId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","created":"2023-11-07T05:31:56Z","deletionTime":"2023-11-07T05:31:56Z","endReason":"unjoined","recordingEnabled":true,"hadSummary":true,"joined":"2023-11-07T05:31:56Z","ended":"2023-11-07T05:31:56Z","maxDuration":"3600s"}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

## Full Content

```
Calls, Messages, Stages
List Deleted Calls
Returns details for all deleted calls
GET
/
api
/
deleted_calls
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
https://api.ultravox.ai/api/deleted_calls
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
accountId
string<uuid>
required
​
results.
created
string<date-time>
required
​
results.
deletionTime
string<date-time>
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
recordingEnabled
boolean
required
​
results.
hadSummary
boolean
required
​
results.
joined
string<date-time> | null
​
results.
ended
string<date-time> | null
​
results.
maxDuration
string
default:
3600s
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
Get Deleted Call
Gets details for the specified deleted call
Next
⌘
I
discord
github
x
Powered by Mintlify
```
