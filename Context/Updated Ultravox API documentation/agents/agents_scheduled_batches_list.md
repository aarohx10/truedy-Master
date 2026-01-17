# List Scheduled Call Batches

**URL:** https://docs.ultravox.ai/api-reference/agents/agents-scheduled-batches-list

## Description
Returns details for all an agent’s scheduled call batches

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/agents/{agent_id}/scheduled_batches\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/agents/{agent_id}/scheduled_batches\--header'X-API-Key: <api-key>'
```

## Response

### Response Schema

```json
{"results": [{"batchId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","created":"2023-11-07T05:31:56Z","totalCount":123,"completedCount":123,"endedAt":"2023-11-07T05:31:56Z","windowStart":"2023-11-07T05:31:56Z","windowEnd":"2023-11-07T05:31:56Z","webhookUrl":"<string>","webhookSecret":"<string>","paused":true}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

```json
{"results": [{"batchId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","created":"2023-11-07T05:31:56Z","totalCount":123,"completedCount":123,"endedAt":"2023-11-07T05:31:56Z","windowStart":"2023-11-07T05:31:56Z","windowEnd":"2023-11-07T05:31:56Z","webhookUrl":"<string>","webhookSecret":"<string>","paused":true}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

## Full Content

```
Scheduled Call Batches
List Scheduled Call Batches
Returns details for all an agent’s scheduled call batches
GET
/
api
/
agents
/
{agent_id}
/
scheduled_batches
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
https://api.ultravox.ai/api/agents/{agent_id}/scheduled_batches
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
Path Parameters
​
agent_id
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
batchId
string<uuid>
required
​
results.
created
string<date-time>
required
​
results.
totalCount
integer
required
The total number of calls in this batch.
​
results.
completedCount
integer
required
The number of calls in this batch that have been completed (created or error).
​
results.
endedAt
string<date-time> | null
required
​
results.
windowStart
string<date-time> | null
The start of the time window during which calls can be made.
​
results.
windowEnd
string<date-time> | null
The end of the time window during which calls can be made.
​
results.
webhookUrl
string<uri> | null
The URL to which a request will be made (synchronously) when a call in the batch is created, excluding those with an outgoing medium. Required if any call has a non-outgoing medium and not allowed otherwise.
Maximum string length:
200
​
results.
webhookSecret
string | null
The signing secret for requests made to the webhookUrl. This is used to verify that the request came from Ultravox. If unset, an appropriate secret will be chosen for you (but you'll still need to make your endpoint aware of it to verify requests).
Maximum string length:
120
​
results.
paused
boolean
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
Create Scheduled Call Batch
Creates a new scheduled call batch using the the specified agent
Next
⌘
I
discord
github
x
Powered by Mintlify
```
