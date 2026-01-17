# Delete Call

**URL:** https://docs.ultravox.ai/api-reference/calls/calls-delete

## Description
Deletes the specified call

## Endpoint
```
DELETE 
```

## Request

### cURL Example
```bash
curl--requestDELETE\--urlhttps://api.ultravox.ai/api/calls/{call_id}\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestDELETE\--urlhttps://api.ultravox.ai/api/calls/{call_id}\--header'X-API-Key: <api-key>'
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
Delete Call
Deletes the specified call
DELETE
/
api
/
calls
/
{call_id}
Try it
cURL
cURL
Copy
Ask AI
curl
--request
DELETE
\
--url
https://api.ultravox.ai/api/calls/{call_id}
\
--header
'X-API-Key: <api-key>'
204
Copy
Ask AI
{}
Also deletes all associated messages, recordings, and stages.
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
204
No response body
Previous
List Call Messages
Returns all messages generated during the given call
Next
⌘
I
discord
github
x
Powered by Mintlify
```
