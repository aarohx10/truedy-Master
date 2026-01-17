# Get Scheduled Call Batch

**URL:** https://docs.ultravox.ai/api-reference/agents/agents-scheduled-batches-get

## Description
Returns details for a scheduled call batch

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/agents/{agent_id}/scheduled_batches/{batch_id}\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/agents/{agent_id}/scheduled_batches/{batch_id}\--header'X-API-Key: <api-key>'
```

## Response

### Response Schema

```json
{"batchId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","created":"2023-11-07T05:31:56Z","totalCount":123,"completedCount":123,"endedAt":"2023-11-07T05:31:56Z","windowStart":"2023-11-07T05:31:56Z","windowEnd":"2023-11-07T05:31:56Z","webhookUrl":"<string>","webhookSecret":"<string>","paused":true}
```

```json
{"batchId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","created":"2023-11-07T05:31:56Z","totalCount":123,"completedCount":123,"endedAt":"2023-11-07T05:31:56Z","windowStart":"2023-11-07T05:31:56Z","windowEnd":"2023-11-07T05:31:56Z","webhookUrl":"<string>","webhookSecret":"<string>","paused":true}
```

## Full Content

```
Scheduled Call Batches
Get Scheduled Call Batch
Returns details for a scheduled call batch
GET
/
api
/
agents
/
{agent_id}
/
scheduled_batches
/
{batch_id}
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
https://api.ultravox.ai/api/agents/{agent_id}/scheduled_batches/{batch_id}
\
--header
'X-API-Key: <api-key>'
200
Copy
Ask AI
{
"batchId"
:
"3c90c3cc-0d44-4b50-8888-8dd25736052a"
,
"created"
:
"2023-11-07T05:31:56Z"
,
"totalCount"
:
123
,
"completedCount"
:
123
,
"endedAt"
:
"2023-11-07T05:31:56Z"
,
"windowStart"
:
"2023-11-07T05:31:56Z"
,
"windowEnd"
:
"2023-11-07T05:31:56Z"
,
"webhookUrl"
:
"<string>"
,
"webhookSecret"
:
"<string>"
,
"paused"
:
true
}
Authorizations
​
X-API-Key
string
header
required
API key
Path Parameters
​
agent_id
string<uuid>
required
​
batch_id
string<uuid>
required
Response
200 - application/json
​
batchId
string<uuid>
required
​
created
string<date-time>
required
​
totalCount
integer
required
The total number of calls in this batch.
​
completedCount
integer
required
The number of calls in this batch that have been completed (created or error).
​
endedAt
string<date-time> | null
required
​
windowStart
string<date-time> | null
The start of the time window during which calls can be made.
​
windowEnd
string<date-time> | null
The end of the time window during which calls can be made.
​
webhookUrl
string<uri> | null
The URL to which a request will be made (synchronously) when a call in the batch is created, excluding those with an outgoing medium. Required if any call has a non-outgoing medium and not allowed otherwise.
Maximum string length:
200
​
webhookSecret
string | null
The signing secret for requests made to the webhookUrl. This is used to verify that the request came from Ultravox. If unset, an appropriate secret will be chosen for you (but you'll still need to make your endpoint aware of it to verify requests).
Maximum string length:
120
​
paused
boolean
Previous
Update Scheduled Call Batch
Updates a scheduled call batch
Next
⌘
I
discord
github
x
Powered by Mintlify
```
