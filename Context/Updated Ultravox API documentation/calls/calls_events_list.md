# List Call Events

**URL:** https://docs.ultravox.ai/api-reference/calls/calls-events-list

## Description
Returns any events logged during the call

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/calls/{call_id}/events\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/calls/{call_id}/events\--header'X-API-Key: <api-key>'
```

## Response

### Response Schema

```json
{"results": [{"callId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","callStageId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","callTimestamp":"<string>","severity":"debug","type":"<string>","text":"<string>","extras":"<unknown>"}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

```json
{"results": [{"callId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","callStageId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","callTimestamp":"<string>","severity":"debug","type":"<string>","text":"<string>","extras":"<unknown>"}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

## Full Content

```
Calls, Messages, Stages
List Call Events
Returns any events logged during the call
GET
/
api
/
calls
/
{call_id}
/
events
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
https://api.ultravox.ai/api/calls/{call_id}/events
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
"callStageId"
:
"3c90c3cc-0d44-4b50-8888-8dd25736052a"
,
"callTimestamp"
:
"<string>"
,
"severity"
:
"debug"
,
"type"
:
"<string>"
,
"text"
:
"<string>"
,
"extras"
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
call_id
string<uuid>
required
Query Parameters
​
cursor
string
The pagination cursor value.
​
minimum_severity
enum<string>
default:
info
The minimum severity of events to include.
Available options
:
debug
,
error
,
info
,
warning
​
pageSize
integer
Number of results to return per page.
​
type
string
If set, restricts returned events to those of the given type.
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
callStageId
string<uuid>
required
​
results.
callTimestamp
string
required
The timestamp of the event, relative to call start.
​
results.
severity
enum<string>
required
Available options
:
debug
,
info
,
warning
,
error
​
results.
type
string
required
The type of the event.
Maximum string length:
50
​
results.
text
string
required
​
results.
extras
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
Get Sip Logs for a call
Redirects to the SIP logs for a call, if available. This is only available for calls with sip medium and only after the call has ended.
Next
⌘
I
discord
github
x
Powered by Mintlify
```
