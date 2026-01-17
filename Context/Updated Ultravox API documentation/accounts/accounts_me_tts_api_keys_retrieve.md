# Get Account TTS API Keys

**URL:** https://docs.ultravox.ai/api-reference/accounts/accounts-me-tts-api-keys-retrieve

## Description
Returns the TTS provider API keys associated with the active account

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/accounts/me/tts_api_keys\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/accounts/me/tts_api_keys\--header'X-API-Key: <api-key>'
```

## Response

### Response Schema

```json
{"elevenLabs": {"prefix":"<string>"},"cartesia": {"prefix":"<string>"},"lmnt": {"prefix":"<string>"},"google": {"prefix":"<string>"}}
```

```json
{"elevenLabs": {"prefix":"<string>"},"cartesia": {"prefix":"<string>"},"lmnt": {"prefix":"<string>"},"google": {"prefix":"<string>"}}
```

## Full Content

```
Accounts
Get Account TTS API Keys
Returns the TTS provider API keys associated with the active account
GET
/
api
/
accounts
/
me
/
tts_api_keys
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
https://api.ultravox.ai/api/accounts/me/tts_api_keys
\
--header
'X-API-Key: <api-key>'
200
Copy
Ask AI
{
"elevenLabs"
: {
"prefix"
:
"<string>"
},
"cartesia"
: {
"prefix"
:
"<string>"
},
"lmnt"
: {
"prefix"
:
"<string>"
},
"google"
: {
"prefix"
:
"<string>"
}
}
Only key prefixes are included and only for providers for which a key has been added.
Authorizations
​
X-API-Key
string
header
required
API key
Response
200 - application/json
​
elevenLabs
object
The ElevenLabs API key.
Show
child attributes
​
elevenLabs.
prefix
string
required
The prefix of the API key.
​
cartesia
object
The Cartesia API key.
Show
child attributes
​
cartesia.
prefix
string
required
The prefix of the API key.
​
lmnt
object
The LMNT API key.
Show
child attributes
​
lmnt.
prefix
string
required
The prefix of the API key.
​
google
object
The Google service account key.
Show
child attributes
​
google.
prefix
string
required
The prefix of the API key.
Previous
Set Telephony Credentials
Allows adding or updating telephony provider credentials to an account
Next
⌘
I
discord
github
x
Powered by Mintlify
```
