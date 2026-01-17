# Get Call Stage Message Audio

**URL:** https://docs.ultravox.ai/api-reference/calls/calls-stages-message-audio-get

## Description
Gets the audio for the specified message

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/calls/{call_id}/stages/{call_stage_id}/messages/{call_stage_message_index}/audio\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/calls/{call_id}/stages/{call_stage_id}/messages/{call_stage_message_index}/audio\--header'X-API-Key: <api-key>'
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
Get Call Stage Message Audio
Gets the audio for the specified message
GET
/
api
/
calls
/
{call_id}
/
stages
/
{call_stage_id}
/
messages
/
{call_stage_message_index}
/
audio
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
https://api.ultravox.ai/api/calls/{call_id}/stages/{call_stage_id}/messages/{call_stage_message_index}/audio
\
--header
'X-API-Key: <api-key>'
200
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
​
call_stage_id
string<uuid>
required
​
call_stage_message_index
integer
required
Response
200
No response body
Previous
List Deleted Calls
Returns details for all deleted calls
Next
⌘
I
discord
github
x
Powered by Mintlify
```
