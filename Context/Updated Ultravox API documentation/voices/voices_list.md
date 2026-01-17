# List Voices

**URL:** https://docs.ultravox.ai/api-reference/voices/voices-list

## Description
Retrieves all available voices

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/voices\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/voices\--header'X-API-Key: <api-key>'
```

## Response

### Response Schema

```json
{"results": [{"voiceId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","name":"<string>","previewUrl":"<string>","ownership":"public","billingStyle":"VOICE_BILLING_STYLE_INCLUDED","provider":"<string>","definition": {"elevenLabs": {"voiceId":"<string>","model":"<string>","speed":123,"useSpeakerBoost":true,"style":123,"similarityBoost":123,"stability":123,"pronunciationDictionaries": [{"dictionaryId":"<string>","versionId":"<string>"}],"optimizeStreamingLatency":123,"maxSampleRate":123},"cartesia": {"voiceId":"<string>","model":"<string>","speed":123,"emotion":"<string>","emotions": ["<string>"],"generationConfig": {"volume":123,"speed":123,"emotion":"<string>"}},"lmnt": {"voiceId":"<string>","model":"<string>","speed":123,"conversational":true},"google": {"voiceId":"<string>","speakingRate":123},"generic": {"url":"<string>","headers": {},"body": {},"responseSampleRate":123,"responseWordsPerMinute":123,"responseMimeType":"<string>","jsonAudioFieldPath":"<string>","jsonByteEncoding":"JSON_BYTE_ENCODING_UNSPECIFIED"}},"description":"<string>","primaryLanguage":"<string>"}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

```json
{"results": [{"voiceId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","name":"<string>","previewUrl":"<string>","ownership":"public","billingStyle":"VOICE_BILLING_STYLE_INCLUDED","provider":"<string>","definition": {"elevenLabs": {"voiceId":"<string>","model":"<string>","speed":123,"useSpeakerBoost":true,"style":123,"similarityBoost":123,"stability":123,"pronunciationDictionaries": [{"dictionaryId":"<string>","versionId":"<string>"}],"optimizeStreamingLatency":123,"maxSampleRate":123},"cartesia": {"voiceId":"<string>","model":"<string>","speed":123,"emotion":"<string>","emotions": ["<string>"],"generationConfig": {"volume":123,"speed":123,"emotion":"<string>"}},"lmnt": {"voiceId":"<string>","model":"<string>","speed":123,"conversational":true},"google": {"voiceId":"<string>","speakingRate":123},"generic": {"url":"<string>","headers": {},"body": {},"responseSampleRate":123,"responseWordsPerMinute":123,"responseMimeType":"<string>","jsonAudioFieldPath":"<string>","jsonByteEncoding":"JSON_BYTE_ENCODING_UNSPECIFIED"}},"description":"<string>","primaryLanguage":"<string>"}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

## Full Content

```
Voices
List Voices
Retrieves all available voices
GET
/
api
/
voices
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
https://api.ultravox.ai/api/voices
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
"voiceId"
:
"3c90c3cc-0d44-4b50-8888-8dd25736052a"
,
"name"
:
"<string>"
,
"previewUrl"
:
"<string>"
,
"ownership"
:
"public"
,
"billingStyle"
:
"VOICE_BILLING_STYLE_INCLUDED"
,
"provider"
:
"<string>"
,
"definition"
: {
"elevenLabs"
: {
"voiceId"
:
"<string>"
,
"model"
:
"<string>"
,
"speed"
:
123
,
"useSpeakerBoost"
:
true
,
"style"
:
123
,
"similarityBoost"
:
123
,
"stability"
:
123
,
"pronunciationDictionaries"
: [
{
"dictionaryId"
:
"<string>"
,
"versionId"
:
"<string>"
}
],
"optimizeStreamingLatency"
:
123
,
"maxSampleRate"
:
123
},
"cartesia"
: {
"voiceId"
:
"<string>"
,
"model"
:
"<string>"
,
"speed"
:
123
,
"emotion"
:
"<string>"
,
"emotions"
: [
"<string>"
],
"generationConfig"
: {
"volume"
:
123
,
"speed"
:
123
,
"emotion"
:
"<string>"
}
},
"lmnt"
: {
"voiceId"
:
"<string>"
,
"model"
:
"<string>"
,
"speed"
:
123
,
"conversational"
:
true
},
"google"
: {
"voiceId"
:
"<string>"
,
"speakingRate"
:
123
},
"generic"
: {
"url"
:
"<string>"
,
"headers"
: {},
"body"
: {},
"responseSampleRate"
:
123
,
"responseWordsPerMinute"
:
123
,
"responseMimeType"
:
"<string>"
,
"jsonAudioFieldPath"
:
"<string>"
,
"jsonByteEncoding"
:
"JSON_BYTE_ENCODING_UNSPECIFIED"
}
},
"description"
:
"<string>"
,
"primaryLanguage"
:
"<string>"
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
billingStyle
enum<string>
The billing style used to filter results.
VOICE_BILLING_STYLE_INCLUDED
- Voices with no additional charges beyond the cost of the call
VOICE_BILLING_STYLE_EXTERNAL
- Voices with costs billed directly by the TTS provider
Available options
:
VOICE_BILLING_STYLE_INCLUDED
,
VOICE_BILLING_STYLE_EXTERNAL
Minimum string length:
1
​
cursor
string
The pagination cursor value.
​
ownership
enum<string>
The ownership used to filter results.
private
- Only private voices
public
- Only public voices
Available options
:
private
,
public
Minimum string length:
1
​
pageSize
integer
Number of results to return per page.
​
primaryLanguage
string
The desired primary language for voice results using BCP47. Voices with different regions/scripts/variants but the same language tag may also be included but will be further down the results. If not provided, all languages are included.
Minimum string length:
1
​
provider
enum<string>[]
The providers used to filter results.
lmnt
- LMNT
cartesia
- Cartesia
google
- Google
eleven_labs
- Eleven Labs
inworld
- Inworld
Available options
:
lmnt
,
cartesia
,
google
,
eleven_labs
,
inworld
​
search
string
The search string used to filter results.
Minimum string length:
1
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
voiceId
string<uuid>
required
​
results.
name
string
required
Maximum string length:
40
​
results.
previewUrl
string<uri>
required
​
results.
ownership
enum<string>
required
Available options
:
public
,
private
​
results.
billingStyle
enum<string>
required
How billing works for this voice.
VOICE_BILLING_STYLE_INCLUDED - The cost of this voice is included in the call cost. There are no additional charges for it.
VOICE_BILLING_STYLE_EXTERNAL - This voice requires an API key for its provider, who will bill for usage separately.
Available options
:
VOICE_BILLING_STYLE_INCLUDED
,
VOICE_BILLING_STYLE_EXTERNAL
​
results.
provider
string | null
required
​
results.
definition
object
required
A voice not known to Ultravox Realtime that can nonetheless be used for a call.
Such voices are significantly less validated than normal voices and you'll be
responsible for your own TTS-related errors.
Exactly one field must be set.
Show
child attributes
​
results.definition.
elevenLabs
object
A voice served by ElevenLabs.
Show
child attributes
​
results.definition.elevenLabs.
voiceId
string
The ID of the voice in ElevenLabs.
​
results.definition.elevenLabs.
model
string
The ElevenLabs model to use.
​
results.definition.elevenLabs.
speed
number<float>
The speaking rate. Must be between 0.7 and 1.2. Defaults to 1.
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.speed
​
results.definition.elevenLabs.
useSpeakerBoost
boolean
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.use_speaker_boost
​
results.definition.elevenLabs.
style
number<float>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.style
​
results.definition.elevenLabs.
similarityBoost
number<float>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.similarity_boost
​
results.definition.elevenLabs.
stability
number<float>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.stability
​
results.definition.elevenLabs.
pronunciationDictionaries
object[]
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.pronunciation_dictionary_locators
Show
child attributes
​
results.definition.elevenLabs.pronunciationDictionaries.
dictionaryId
string
The dictionary's ID.
​
results.definition.elevenLabs.pronunciationDictionaries.
versionId
string
The dictionary's version.
​
results.definition.elevenLabs.
optimizeStreamingLatency
integer<int32>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.query.optimize_streaming_latency.optimize_streaming_latency
​
results.definition.elevenLabs.
maxSampleRate
integer<int32>
The maximum sample rate Ultravox will try to use. ElevenLabs limits your allowed sample rate
based on your tier. See
https://elevenlabs.io/pricing#pricing-table
(and click "Show API details")
​
results.definition.
cartesia
object
A voice served by Cartesia.
Show
child attributes
​
results.definition.cartesia.
voiceId
string
The ID of the voice in Cartesia.
​
results.definition.cartesia.
model
string
The Cartesia model to use.
​
results.definition.cartesia.
speed
number<float>
(Deprecated) The speaking rate. Must be between -1 and 1. Defaults to 0.
​
results.definition.cartesia.
emotion
string
(Deprecated) Use generation_config.emotion instead.
​
results.definition.cartesia.
emotions
string[]
(Deprecated) Use generation_config.emotion instead.
​
results.definition.cartesia.
generationConfig
object
Configure the various attributes of the generated speech.
Show
child attributes
​
results.definition.cartesia.generationConfig.
volume
number<float>
Adjust the volume of the generated speech between 0.5x and 2.0x the original volume (default is 1.0x). Valid values are between [0.5, 2.0] inclusive.
​
results.definition.cartesia.generationConfig.
speed
number<float>
Adjust the speed of the generated speech between 0.6x and 2.0x the original speed (default is 1.0x). Valid values are between [0.6, 1.5] inclusive.
​
results.definition.cartesia.generationConfig.
emotion
string
The primary emotions are neutral, calm, angry, content, sad, scared. For more options, see Prompting Sonic-3.
​
results.definition.
lmnt
object
A voice served by LMNT.
Show
child attributes
​
results.definition.lmnt.
voiceId
string
The ID of the voice in LMNT.
​
results.definition.lmnt.
model
string
The LMNT model to use.
​
results.definition.lmnt.
speed
number<float>
The speaking rate. Must be between 0.25 and 2. Defaults to 1.
See
https://docs.lmnt.com/api-reference/speech/synthesize-speech-bytes#body-speed
​
results.definition.lmnt.
conversational
boolean
See
https://docs.lmnt.com/api-reference/speech/synthesize-speech-bytes#body-conversational
​
results.definition.
google
object
A voice served by Google, using bidirectional streaming.
(For non-streaming or output-only streaming, use generic.)
Show
child attributes
​
results.definition.google.
voiceId
string
The ID (name) of the voice in Google, e.g. "en-US-Chirp3-HD-Charon".
​
results.definition.google.
speakingRate
number<float>
The speaking rate. Must be between 0.25 and 2. Defaults to 1.
See
https://cloud.google.com/python/docs/reference/texttospeech/latest/google.cloud.texttospeech_v1.types.StreamingAudioConfig
​
results.definition.
generic
object
A voice served by a generic REST-based TTS API.
Show
child attributes
​
results.definition.generic.
url
string
The endpoint to which requests are sent.
​
results.definition.generic.
headers
object
Headers to include in the request.
Show
child attributes
​
results.definition.generic.headers.
{key}
string
​
results.definition.generic.
body
object
The request body to send. Some field should include a placeholder for text
represented as {text}. The placeholder will be replaced with the text to synthesize.
​
results.definition.generic.
responseSampleRate
integer<int32>
The sample rate of the audio returned by the API.
​
results.definition.generic.
responseWordsPerMinute
integer<int32>
An estimate of the speaking rate of the returned audio in words per minute. This is
used for transcript timing while audio is streamed in the response. (Once the response
is complete, Ultravox Realtime uses the real audio duration to adjust the timing.)
Defaults to 150 and is unused for non-streaming responses.
​
results.definition.generic.
responseMimeType
string
The real mime type of the content returned by the API. If unset, the Content-Type response header
will be used. This is useful for APIs whose response bodies don't strictly adhere to what the
API claims via header. For example, if your API claims to return audio/wav but omits the WAV
header (thus really returning raw PCM), set this to audio/l16. Similarly, if your API claims to
return JSON but actually streams JSON Lines, set this to application/jsonl.
​
results.definition.generic.
jsonAudioFieldPath
string
For JSON responses, the path to the field containing base64-encoded audio data. The data must
be PCM audio, optionally with a WAV header.
​
results.definition.generic.
jsonByteEncoding
enum<string>
For JSON responses, how audio bytes are encoded into the json_audio_field_path string.
Defaults to base64. Also supports hex.
Available options
:
JSON_BYTE_ENCODING_UNSPECIFIED
,
JSON_BYTE_ENCODING_BASE64
,
JSON_BYTE_ENCODING_HEX
​
results.
description
string | null
Maximum string length:
240
​
results.
primaryLanguage
string | null
BCP47 language code for the primary language supported by this voice.
Maximum string length:
10
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
Get Voice
Gets details for the specified voice
Next
⌘
I
discord
github
x
Powered by Mintlify
```
