# Get Call Recording

**URL:** https://docs.ultravox.ai/api-reference/calls/calls-recording-get

## Description
Returns a link to the recording of the call

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/calls/{call_id}/recording\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/calls/{call_id}/recording\--header'X-API-Key: <api-key>'
```

## Full Content

```
Calls, Messages, Stages
Get Call Recording
Returns a link to the recording of the call
GET
/
api
/
calls
/
{call_id}
/
recording
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
https://api.ultravox.ai/api/calls/{call_id}/recording
\
--header
'X-API-Key: <api-key>'
200
302
Copy
Ask AI
"<string>"
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
200
audio/wav
The response is of type
file
.
Previous
List Call Stages
Lists all stages that occurred during the specified call
Next
⌘
I
discord
github
x
Powered by Mintlify
```
