# Set TTS API keys

**URL:** https://docs.ultravox.ai/api-reference/accounts/accounts-me-tts-api-keys-partial-update

## Description
Allows adding or updating TTS provider API keys to an account, enabling ExternalVoices

## Endpoint
```
PATCH 
```

## Request

### cURL Example
```bash
curl--requestPATCH\--urlhttps://api.ultravox.ai/api/accounts/me/tts_api_keys\--header'Content-Type: application/json'\--header'X-API-Key: <api-key>'\--data'{"elevenLabs": "<string>","cartesia": "<string>","lmnt": "<string>","google": "<string>"}'
```

### cURL Example
```bash
curl--requestPATCH\--urlhttps://api.ultravox.ai/api/accounts/me/tts_api_keys\--header'Content-Type: application/json'\--header'X-API-Key: <api-key>'\--data'{"elevenLabs": "<string>","cartesia": "<string>","lmnt": "<string>","google": "<string>"}'
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
Set TTS API keys
Allows adding or updating TTS provider API keys to an account, enabling ExternalVoices
PATCH
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
PATCH
\
--url
https://api.ultravox.ai/api/accounts/me/tts_api_keys
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
"elevenLabs": "<string>",
"cartesia": "<string>",
"lmnt": "<string>",
"google": "<string>"
}
'
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
This is not necessary for using the service’s included voices or your own voice clones added to the service.
Authorizations
​
X-API-Key
string
header
required
API key
Body
application/json
​
elevenLabs
string | null
Your ElevenLabs API key.
https://elevenlabs.io/app/settings/api-keys
​
cartesia
string | null
Your Cartesia API key.
https://play.cartesia.ai/keys
​
lmnt
string | null
Your LMNT API key.
https://app.lmnt.com/account#api-keys
​
google
string | null
A service account JSON key for your Google Cloud project with the Text-to-Speech API enabled.
https://cloud.google.com/text-to-speech/docs/quickstart-client-libraries#before-you-begin
https://cloud.google.com/iam/docs/keys-create-delete#creating
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
Get Account TTS API Keys
Returns the TTS provider API keys associated with the active account
Next
⌘
I
discord
github
x
Powered by Mintlify
```
