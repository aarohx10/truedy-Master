# Preview Voice

**URL:** https://docs.ultravox.ai/api-reference/voices/voice-preview-post

## Description
Performs a test generation of a voice, returning the resulting audio or error.

## Endpoint
```
POST 
```

## Request

### cURL Example
```bash
curl--requestPOST\--urlhttps://api.ultravox.ai/api/voice_preview\--header'Content-Type: application/json'\--header'X-API-Key: <api-key>'\--data'{"name": "<string>","definition": {"elevenLabs": {"voiceId": "<string>","model": "<string>","speed": 123,"useSpeakerBoost": true,"style": 123,"similarityBoost": 123,"stability": 123,"pronunciationDictionaries": [{"dictionaryId": "<string>","versionId": "<string>"}],"optimizeStreamingLatency": 123,"maxSampleRate": 123},"cartesia": {"voiceId": "<string>","model": "<string>","speed": 123,"emotion": "<string>","emotions": ["<string>"],"generationConfig": {"volume": 123,"speed": 123,"emotion": "<string>"}},"lmnt": {"voiceId": "<string>","model": "<string>","speed": 123,"conversational": true},"google": {"voiceId": "<string>","speakingRate": 123},"generic": {"url": "<string>","headers": {},"body": {},"responseSampleRate": 123,"responseWordsPerMinute": 123,"responseMimeType": "<string>","jsonAudioFieldPath": "<string>","jsonByteEncoding": "JSON_BYTE_ENCODING_UNSPECIFIED"}},"description": "<string>","primaryLanguage": "<string>"}'
```

### cURL Example
```bash
curl--requestPOST\--urlhttps://api.ultravox.ai/api/voice_preview\--header'Content-Type: application/json'\--header'X-API-Key: <api-key>'\--data'{"name": "<string>","definition": {"elevenLabs": {"voiceId": "<string>","model": "<string>","speed": 123,"useSpeakerBoost": true,"style": 123,"similarityBoost": 123,"stability": 123,"pronunciationDictionaries": [{"dictionaryId": "<string>","versionId": "<string>"}],"optimizeStreamingLatency": 123,"maxSampleRate": 123},"cartesia": {"voiceId": "<string>","model": "<string>","speed": 123,"emotion": "<string>","emotions": ["<string>"],"generationConfig": {"volume": 123,"speed": 123,"emotion": "<string>"}},"lmnt": {"voiceId": "<string>","model": "<string>","speed": 123,"conversational": true},"google": {"voiceId": "<string>","speakingRate": 123},"generic": {"url": "<string>","headers": {},"body": {},"responseSampleRate": 123,"responseWordsPerMinute": 123,"responseMimeType": "<string>","jsonAudioFieldPath": "<string>","jsonByteEncoding": "JSON_BYTE_ENCODING_UNSPECIFIED"}},"description": "<string>","primaryLanguage": "<string>"}'
```

## Full Content

```
Voices
Preview Voice
Performs a test generation of a voice, returning the resulting audio or error.
POST
/
api
/
voice_preview
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
https://api.ultravox.ai/api/voice_preview
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
"name": "<string>",
"definition": {
"elevenLabs": {
"voiceId": "<string>",
"model": "<string>",
"speed": 123,
"useSpeakerBoost": true,
"style": 123,
"similarityBoost": 123,
"stability": 123,
"pronunciationDictionaries": [
{
"dictionaryId": "<string>",
"versionId": "<string>"
}
],
"optimizeStreamingLatency": 123,
"maxSampleRate": 123
},
"cartesia": {
"voiceId": "<string>",
"model": "<string>",
"speed": 123,
"emotion": "<string>",
"emotions": [
"<string>"
],
"generationConfig": {
"volume": 123,
"speed": 123,
"emotion": "<string>"
}
},
"lmnt": {
"voiceId": "<string>",
"model": "<string>",
"speed": 123,
"conversational": true
},
"google": {
"voiceId": "<string>",
"speakingRate": 123
},
"generic": {
"url": "<string>",
"headers": {},
"body": {},
"responseSampleRate": 123,
"responseWordsPerMinute": 123,
"responseMimeType": "<string>",
"jsonAudioFieldPath": "<string>",
"jsonByteEncoding": "JSON_BYTE_ENCODING_UNSPECIFIED"
}
},
"description": "<string>",
"primaryLanguage": "<string>"
}
'
200
400
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
Body
application/json
​
name
string
required
Maximum string length:
40
​
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
definition.
elevenLabs
object
A voice served by ElevenLabs.
Show
child attributes
​
definition.elevenLabs.
voiceId
string
The ID of the voice in ElevenLabs.
​
definition.elevenLabs.
model
string
The ElevenLabs model to use.
​
definition.elevenLabs.
speed
number<float>
The speaking rate. Must be between 0.7 and 1.2. Defaults to 1.
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.speed
​
definition.elevenLabs.
useSpeakerBoost
boolean
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.use_speaker_boost
​
definition.elevenLabs.
style
number<float>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.style
​
definition.elevenLabs.
similarityBoost
number<float>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.similarity_boost
​
definition.elevenLabs.
stability
number<float>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.stability
​
definition.elevenLabs.
pronunciationDictionaries
object[]
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.pronunciation_dictionary_locators
Show
child attributes
​
definition.elevenLabs.pronunciationDictionaries.
dictionaryId
string
The dictionary's ID.
​
definition.elevenLabs.pronunciationDictionaries.
versionId
string
The dictionary's version.
​
definition.elevenLabs.
optimizeStreamingLatency
integer<int32>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.query.optimize_streaming_latency.optimize_streaming_latency
​
definition.elevenLabs.
maxSampleRate
integer<int32>
The maximum sample rate Ultravox will try to use. ElevenLabs limits your allowed sample rate
based on your tier. See
https://elevenlabs.io/pricing#pricing-table
(and click "Show API details")
​
definition.
cartesia
object
A voice served by Cartesia.
Show
child attributes
​
definition.cartesia.
voiceId
string
The ID of the voice in Cartesia.
​
definition.cartesia.
model
string
The Cartesia model to use.
​
definition.cartesia.
speed
number<float>
(Deprecated) The speaking rate. Must be between -1 and 1. Defaults to 0.
​
definition.cartesia.
emotion
string
(Deprecated) Use generation_config.emotion instead.
​
definition.cartesia.
emotions
string[]
(Deprecated) Use generation_config.emotion instead.
​
definition.cartesia.
generationConfig
object
Configure the various attributes of the generated speech.
Show
child attributes
​
definition.cartesia.generationConfig.
volume
number<float>
Adjust the volume of the generated speech between 0.5x and 2.0x the original volume (default is 1.0x). Valid values are between [0.5, 2.0] inclusive.
​
definition.cartesia.generationConfig.
speed
number<float>
Adjust the speed of the generated speech between 0.6x and 2.0x the original speed (default is 1.0x). Valid values are between [0.6, 1.5] inclusive.
​
definition.cartesia.generationConfig.
emotion
string
The primary emotions are neutral, calm, angry, content, sad, scared. For more options, see Prompting Sonic-3.
​
definition.
lmnt
object
A voice served by LMNT.
Show
child attributes
​
definition.lmnt.
voiceId
string
The ID of the voice in LMNT.
​
definition.lmnt.
model
string
The LMNT model to use.
​
definition.lmnt.
speed
number<float>
The speaking rate. Must be between 0.25 and 2. Defaults to 1.
See
https://docs.lmnt.com/api-reference/speech/synthesize-speech-bytes#body-speed
​
definition.lmnt.
conversational
boolean
See
https://docs.lmnt.com/api-reference/speech/synthesize-speech-bytes#body-conversational
​
definition.
google
object
A voice served by Google, using bidirectional streaming.
(For non-streaming or output-only streaming, use generic.)
Show
child attributes
​
definition.google.
voiceId
string
The ID (name) of the voice in Google, e.g. "en-US-Chirp3-HD-Charon".
​
definition.google.
speakingRate
number<float>
The speaking rate. Must be between 0.25 and 2. Defaults to 1.
See
https://cloud.google.com/python/docs/reference/texttospeech/latest/google.cloud.texttospeech_v1.types.StreamingAudioConfig
​
definition.
generic
object
A voice served by a generic REST-based TTS API.
Show
child attributes
​
definition.generic.
url
string
The endpoint to which requests are sent.
​
definition.generic.
headers
object
Headers to include in the request.
Show
child attributes
​
definition.generic.headers.
{key}
string
​
definition.generic.
body
object
The request body to send. Some field should include a placeholder for text
represented as {text}. The placeholder will be replaced with the text to synthesize.
​
definition.generic.
responseSampleRate
integer<int32>
The sample rate of the audio returned by the API.
​
definition.generic.
responseWordsPerMinute
integer<int32>
An estimate of the speaking rate of the returned audio in words per minute. This is
used for transcript timing while audio is streamed in the response. (Once the response
is complete, Ultravox Realtime uses the real audio duration to adjust the timing.)
Defaults to 150 and is unused for non-streaming responses.
​
definition.generic.
responseMimeType
string
The real mime type of the content returned by the API. If unset, the Content-Type response header
will be used. This is useful for APIs whose response bodies don't strictly adhere to what the
API claims via header. For example, if your API claims to return audio/wav but omits the WAV
header (thus really returning raw PCM), set this to audio/l16. Similarly, if your API claims to
return JSON but actually streams JSON Lines, set this to application/jsonl.
​
definition.generic.
jsonAudioFieldPath
string
For JSON responses, the path to the field containing base64-encoded audio data. The data must
be PCM audio, optionally with a WAV header.
​
definition.generic.
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
description
string | null
Maximum string length:
240
​
primaryLanguage
string | null
BCP47 language code for the primary language supported by this voice.
Maximum string length:
10
Response
200
audio/wav
The response is of type
file
.
Previous
Get Voice Sample
Provides an audio sample for a voice, or the error caused by using it.
Next
⌘
I
discord
github
x
Powered by Mintlify
```
