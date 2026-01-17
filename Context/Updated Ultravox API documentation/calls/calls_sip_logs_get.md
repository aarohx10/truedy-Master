# Get Sip Logs for a call

**URL:** https://docs.ultravox.ai/api-reference/calls/calls-sip-logs-get

## Description
Redirects to the SIP logs for a call, if available. This is only available for calls with sip medium and only after the call has ended.

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/calls/{call_id}/sip_logs\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/calls/{call_id}/sip_logs\--header'X-API-Key: <api-key>'
```

## Response

### Response Schema

```json
{}
```

```json
{}
```

## Full Content

```
Calls, Messages, Stages
Get Sip Logs for a call
Redirects to the SIP logs for a call, if available. This is only available for calls with sip medium and only after the call has ended.
GET
/
api
/
calls
/
{call_id}
/
sip_logs
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
https://api.ultravox.ai/api/calls/{call_id}/sip_logs
\
--header
'X-API-Key: <api-key>'
302
404
425
Copy
Ask AI
{}
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
302
No response body
Previous
Send Data Message to Call
Sends a data message to a live call
Next
⌘
I
discord
github
x
Powered by Mintlify
```
