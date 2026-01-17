# Send Data Message to Call

**URL:** https://docs.ultravox.ai/api-reference/calls/calls-send-data-message-post

## Description
Sends a data message to a live call

## Endpoint
```
POST 
```

## Request

### cURL Example
```bash
curl--requestPOST\--urlhttps://api.ultravox.ai/api/calls/{call_id}/send_data_message\--header'Content-Type: application/json'\--header'X-API-Key: <api-key>'\--data'{"type": "<string>"}'
```

### cURL Example
```bash
curl--requestPOST\--urlhttps://api.ultravox.ai/api/calls/{call_id}/send_data_message\--header'Content-Type: application/json'\--header'X-API-Key: <api-key>'\--data'{"type": "<string>"}'
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
Send Data Message to Call
Sends a data message to a live call
POST
/
api
/
calls
/
{call_id}
/
send_data_message
Try it
cURL
cURL
Copy
Ask AI
curl
--request
POST
\
--url
https://api.ultravox.ai/api/calls/{call_id}/send_data_message
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
"type": "<string>"
}
'
204
Copy
Ask AI
{}
The request body for this API is determined by the type of message being sent. See
Data Messages
for details.
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
Body
application/json
A data message to send to a call.
​
type
string
required
The type of the data message.
Response
204
No response body
Previous
Corpus Service (RAG) Overview
Understanding Retrieval Augmented Generation in Ultravox
Next
⌘
I
discord
github
x
Powered by Mintlify
```
