# Get Call Usage

**URL:** https://docs.ultravox.ai/api-reference/accounts/accounts-me-usage-calls-get

## Description
Returns aggregated and per-day call usage data

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/accounts/me/usage/calls\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/accounts/me/usage/calls\--header'X-API-Key: <api-key>'
```

## Response

### Response Schema

```json
{"allTime": {"totalCount":123,"duration":"<string>","joinedCount":123,"billedMinutes":123},"daily": [{"totalCount":123,"duration":"<string>","joinedCount":123,"billedMinutes":123,"date":"2023-12-25"}]}
```

```json
{"allTime": {"totalCount":123,"duration":"<string>","joinedCount":123,"billedMinutes":123},"daily": [{"totalCount":123,"duration":"<string>","joinedCount":123,"billedMinutes":123,"date":"2023-12-25"}]}
```

## Full Content

```
Accounts
Get Call Usage
Returns aggregated and per-day call usage data
GET
/
api
/
accounts
/
me
/
usage
/
calls
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
https://api.ultravox.ai/api/accounts/me/usage/calls
\
--header
'X-API-Key: <api-key>'
200
Copy
Ask AI
{
"allTime"
: {
"totalCount"
:
123
,
"duration"
:
"<string>"
,
"joinedCount"
:
123
,
"billedMinutes"
:
123
},
"daily"
: [
{
"totalCount"
:
123
,
"duration"
:
"<string>"
,
"joinedCount"
:
123
,
"billedMinutes"
:
123
,
"date"
:
"2023-12-25"
}
]
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
agentIds
string<uuid>[]
Filter calls by the agent IDs.
​
durationMax
string
Maximum duration of calls
​
durationMin
string
Minimum duration of calls
​
fromDate
string<date>
Start date (inclusive) for filtering calls by creation date
​
metadata
object
Filter calls by metadata. Use metadata.key=value to filter by specific key-value pairs.
Show
child attributes
​
metadata.
{key}
string
​
search
string
The search string used to filter results
Minimum string length:
1
​
toDate
string<date>
End date (inclusive) for filtering calls by creation date
​
voiceId
string<uuid>
Filter calls by the associated voice ID
Response
200 - application/json
​
allTime
object
required
All-time call usage
Show
child attributes
​
allTime.
totalCount
integer
required
Total number of calls
​
allTime.
duration
string
required
Total duration of all calls
​
allTime.
joinedCount
integer
required
Number of calls that were joined
​
allTime.
billedMinutes
number<double>
required
Total billed minutes.
​
daily
object[]
required
Call usage per day
Show
child attributes
​
daily.
totalCount
integer
required
Total number of calls
​
daily.
duration
string
required
Total duration of all calls
​
daily.
joinedCount
integer
required
Number of calls that were joined
​
daily.
billedMinutes
number<double>
required
Total billed minutes.
​
daily.
date
string<date>
required
Date of usage
Previous
Set TTS API keys
Allows adding or updating TTS provider API keys to an account, enabling ExternalVoices
Next
⌘
I
discord
github
x
Powered by Mintlify
```
