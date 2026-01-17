# List Call Stages

**URL:** https://docs.ultravox.ai/api-reference/calls/calls-stages-list

## Description
Lists all stages that occurred during the specified call

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/calls/{call_id}/stages\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/calls/{call_id}/stages\--header'X-API-Key: <api-key>'
```

## Response

### Response Schema

```json
{"results": [{"callId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","callStageId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","created":"2023-11-07T05:31:56Z","temperature":123,"errorCount":123,"experimentalSettings":"<unknown>","initialState": {},"inactivityMessages": [{"duration":"<string>","message":"<string>","endBehavior":"END_BEHAVIOR_UNSPECIFIED"}],"languageHint":"<string>","model":"ultravox-v0.6","systemPrompt":"<string>","timeExceededMessage":"<string>","voice":"<string>","externalVoice": {"elevenLabs": {"voiceId":"<string>","model":"<string>","speed":123,"useSpeakerBoost":true,"style":123,"similarityBoost":123,"stability":123,"pronunciationDictionaries": [{"dictionaryId":"<string>","versionId":"<string>"}],"optimizeStreamingLatency":123,"maxSampleRate":123},"cartesia": {"voiceId":"<string>","model":"<string>","speed":123,"emotion":"<string>","emotions": ["<string>"],"generationConfig": {"volume":123,"speed":123,"emotion":"<string>"}},"lmnt": {"voiceId":"<string>","model":"<string>","speed":123,"conversational":true},"google": {"voiceId":"<string>","speakingRate":123},"generic": {"url":"<string>","headers": {},"body": {},"responseSampleRate":123,"responseWordsPerMinute":123,"responseMimeType":"<string>","jsonAudioFieldPath":"<string>","jsonByteEncoding":"JSON_BYTE_ENCODING_UNSPECIFIED"}}}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

```json
{"results": [{"callId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","callStageId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","created":"2023-11-07T05:31:56Z","temperature":123,"errorCount":123,"experimentalSettings":"<unknown>","initialState": {},"inactivityMessages": [{"duration":"<string>","message":"<string>","endBehavior":"END_BEHAVIOR_UNSPECIFIED"}],"languageHint":"<string>","model":"ultravox-v0.6","systemPrompt":"<string>","timeExceededMessage":"<string>","voice":"<string>","externalVoice": {"elevenLabs": {"voiceId":"<string>","model":"<string>","speed":123,"useSpeakerBoost":true,"style":123,"similarityBoost":123,"stability":123,"pronunciationDictionaries": [{"dictionaryId":"<string>","versionId":"<string>"}],"optimizeStreamingLatency":123,"maxSampleRate":123},"cartesia": {"voiceId":"<string>","model":"<string>","speed":123,"emotion":"<string>","emotions": ["<string>"],"generationConfig": {"volume":123,"speed":123,"emotion":"<string>"}},"lmnt": {"voiceId":"<string>","model":"<string>","speed":123,"conversational":true},"google": {"voiceId":"<string>","speakingRate":123},"generic": {"url":"<string>","headers": {},"body": {},"responseSampleRate":123,"responseWordsPerMinute":123,"responseMimeType":"<string>","jsonAudioFieldPath":"<string>","jsonByteEncoding":"JSON_BYTE_ENCODING_UNSPECIFIED"}}}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

## Full Content

```
Calls, Messages, Stages
List Call Stages
Lists all stages that occurred during the specified call
GET
/
api
/
calls
/
{call_id}
/
stages
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
https://api.ultravox.ai/api/calls/{call_id}/stages
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
"callId"
:
"3c90c3cc-0d44-4b50-8888-8dd25736052a"
,
"callStageId"
:
"3c90c3cc-0d44-4b50-8888-8dd25736052a"
,
"created"
:
"2023-11-07T05:31:56Z"
,
"temperature"
:
123
,
"errorCount"
:
123
,
"experimentalSettings"
:
"<unknown>"
,
"initialState"
: {},
"inactivityMessages"
: [
{
"duration"
:
"<string>"
,
"message"
:
"<string>"
,
"endBehavior"
:
"END_BEHAVIOR_UNSPECIFIED"
}
],
"languageHint"
:
"<string>"
,
"model"
:
"ultravox-v0.6"
,
"systemPrompt"
:
"<string>"
,
"timeExceededMessage"
:
"<string>"
,
"voice"
:
"<string>"
,
"externalVoice"
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
}
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
Stages represent distinct segments of the conversation where different parameters (e.g. system prompt or tools) may have been used.
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
Query Parameters
​
cursor
string
The pagination cursor value.
​
pageSize
integer
Number of results to return per page.
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
callId
string<uuid>
required
​
results.
callStageId
string<uuid>
required
​
results.
created
string<date-time>
required
​
results.
temperature
number<double>
required
​
results.
errorCount
integer
required
The number of errors in this call stage.
​
results.
experimentalSettings
any | null
required
Experimental settings for this call stage.
​
results.
initialState
object
required
The initial state of the call stage which is readable/writable by tools.
Show
child attributes
​
results.initialState.
{key}
any
​
results.
inactivityMessages
object[]
Messages spoken by the agent when the user is inactive for the specified duration. Durations are cumulative, so a message m > 1 with duration 30s will be spoken 30 seconds after message m-1.
Show
child attributes
​
results.inactivityMessages.
duration
string
The duration after which the message should be spoken.
​
results.inactivityMessages.
message
string
The message to speak.
​
results.inactivityMessages.
endBehavior
enum<string>
The behavior to exhibit when the message is finished being spoken.
Available options
:
END_BEHAVIOR_UNSPECIFIED
,
END_BEHAVIOR_HANG_UP_SOFT
,
END_BEHAVIOR_HANG_UP_STRICT
​
results.
languageHint
string | null
BCP47 language code that may be used to guide speech recognition.
Maximum string length:
16
​
results.
model
string
default:
ultravox-v0.6
​
results.
systemPrompt
string | null
​
results.
timeExceededMessage
string | null
​
results.
voice
string | null
​
results.
externalVoice
object
A voice not known to Ultravox Realtime that can nonetheless be used for a call.
Such voices are significantly less validated than normal voices and you'll be
responsible for your own TTS-related errors.
Exactly one field must be set.
Show
child attributes
​
results.externalVoice.
elevenLabs
object
A voice served by ElevenLabs.
Show
child attributes
​
results.externalVoice.elevenLabs.
voiceId
string
The ID of the voice in ElevenLabs.
​
results.externalVoice.elevenLabs.
model
string
The ElevenLabs model to use.
​
results.externalVoice.elevenLabs.
speed
number<float>
The speaking rate. Must be between 0.7 and 1.2. Defaults to 1.
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.speed
​
results.externalVoice.elevenLabs.
useSpeakerBoost
boolean
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.use_speaker_boost
​
results.externalVoice.elevenLabs.
style
number<float>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.style
​
results.externalVoice.elevenLabs.
similarityBoost
number<float>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.similarity_boost
​
results.externalVoice.elevenLabs.
stability
number<float>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.voice_settings.stability
​
results.externalVoice.elevenLabs.
pronunciationDictionaries
object[]
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.body.pronunciation_dictionary_locators
Show
child attributes
​
results.externalVoice.elevenLabs.pronunciationDictionaries.
dictionaryId
string
The dictionary's ID.
​
results.externalVoice.elevenLabs.pronunciationDictionaries.
versionId
string
The dictionary's version.
​
results.externalVoice.elevenLabs.
optimizeStreamingLatency
integer<int32>
See
https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request.query.optimize_streaming_latency.optimize_streaming_latency
​
results.externalVoice.elevenLabs.
maxSampleRate
integer<int32>
The maximum sample rate Ultravox will try to use. ElevenLabs limits your allowed sample rate
based on your tier. See
https://elevenlabs.io/pricing#pricing-table
(and click "Show API details")
​
results.externalVoice.
cartesia
object
A voice served by Cartesia.
Show
child attributes
​
results.externalVoice.cartesia.
voiceId
string
The ID of the voice in Cartesia.
​
results.externalVoice.cartesia.
model
string
The Cartesia model to use.
​
results.externalVoice.cartesia.
speed
number<float>
(Deprecated) The speaking rate. Must be between -1 and 1. Defaults to 0.
​
results.externalVoice.cartesia.
emotion
string
(Deprecated) Use generation_config.emotion instead.
​
results.externalVoice.cartesia.
emotions
string[]
(Deprecated) Use generation_config.emotion instead.
​
results.externalVoice.cartesia.
generationConfig
object
Configure the various attributes of the generated speech.
Show
child attributes
​
results.externalVoice.cartesia.generationConfig.
volume
number<float>
Adjust the volume of the generated speech between 0.5x and 2.0x the original volume (default is 1.0x). Valid values are between [0.5, 2.0] inclusive.
​
results.externalVoice.cartesia.generationConfig.
speed
number<float>
Adjust the speed of the generated speech between 0.6x and 2.0x the original speed (default is 1.0x). Valid values are between [0.6, 1.5] inclusive.
​
results.externalVoice.cartesia.generationConfig.
emotion
string
The primary emotions are neutral, calm, angry, content, sad, scared. For more options, see Prompting Sonic-3.
​
results.externalVoice.
lmnt
object
A voice served by LMNT.
Show
child attributes
​
results.externalVoice.lmnt.
voiceId
string
The ID of the voice in LMNT.
​
results.externalVoice.lmnt.
model
string
The LMNT model to use.
​
results.externalVoice.lmnt.
speed
number<float>
The speaking rate. Must be between 0.25 and 2. Defaults to 1.
See
https://docs.lmnt.com/api-reference/speech/synthesize-speech-bytes#body-speed
​
results.externalVoice.lmnt.
conversational
boolean
See
https://docs.lmnt.com/api-reference/speech/synthesize-speech-bytes#body-conversational
​
results.externalVoice.
google
object
A voice served by Google, using bidirectional streaming.
(For non-streaming or output-only streaming, use generic.)
Show
child attributes
​
results.externalVoice.google.
voiceId
string
The ID (name) of the voice in Google, e.g. "en-US-Chirp3-HD-Charon".
​
results.externalVoice.google.
speakingRate
number<float>
The speaking rate. Must be between 0.25 and 2. Defaults to 1.
See
https://cloud.google.com/python/docs/reference/texttospeech/latest/google.cloud.texttospeech_v1.types.StreamingAudioConfig
​
results.externalVoice.
generic
object
A voice served by a generic REST-based TTS API.
Show
child attributes
​
results.externalVoice.generic.
url
string
The endpoint to which requests are sent.
​
results.externalVoice.generic.
headers
object
Headers to include in the request.
Show
child attributes
​
results.externalVoice.generic.headers.
{key}
string
​
results.externalVoice.generic.
body
object
The request body to send. Some field should include a placeholder for text
represented as {text}. The placeholder will be replaced with the text to synthesize.
​
results.externalVoice.generic.
responseSampleRate
integer<int32>
The sample rate of the audio returned by the API.
​
results.externalVoice.generic.
responseWordsPerMinute
integer<int32>
An estimate of the speaking rate of the returned audio in words per minute. This is
used for transcript timing while audio is streamed in the response. (Once the response
is complete, Ultravox Realtime uses the real audio duration to adjust the timing.)
Defaults to 150 and is unused for non-streaming responses.
​
results.externalVoice.generic.
responseMimeType
string
The real mime type of the content returned by the API. If unset, the Content-Type response header
will be used. This is useful for APIs whose response bodies don't strictly adhere to what the
API claims via header. For example, if your API claims to return audio/wav but omits the WAV
header (thus really returning raw PCM), set this to audio/l16. Similarly, if your API claims to
return JSON but actually streams JSON Lines, set this to application/jsonl.
​
results.externalVoice.generic.
jsonAudioFieldPath
string
For JSON responses, the path to the field containing base64-encoded audio data. The data must
be PCM audio, optionally with a WAV header.
​
results.externalVoice.generic.
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
Get Call Stage
Retrieves details for a specific stage of a call
Next
⌘
I
discord
github
x
Powered by Mintlify
```
