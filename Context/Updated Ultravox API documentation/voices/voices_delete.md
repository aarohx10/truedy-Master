# Delete Voice

**URL:** https://docs.ultravox.ai/api-reference/voices/voices-delete

## Description
Deletes the specified voice

## Endpoint
```
DELETE 
```

## Request

### cURL Example
```bash
curl--requestDELETE\--urlhttps://api.ultravox.ai/api/voices/{voice_id}\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestDELETE\--urlhttps://api.ultravox.ai/api/voices/{voice_id}\--header'X-API-Key: <api-key>'
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
Voices
Delete Voice
Deletes the specified voice
DELETE
/
api
/
voices
/
{voice_id}
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
https://api.ultravox.ai/api/voices/{voice_id}
\
--header
'X-API-Key: <api-key>'
204
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
voice_id
string<uuid>
required
Response
204
No response body
Previous
Replace Voice
Replaces the specified voice
Next
⌘
I
discord
github
x
Powered by Mintlify
```
