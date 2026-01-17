# List Corpora

**URL:** https://docs.ultravox.ai/api-reference/corpora/corpora-list

## Description
Returns details for all corpora

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/corpora\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/corpora\--header'X-API-Key: <api-key>'
```

## Response

### Response Schema

```json
{"results": [{"corpusId":"<string>","created":"2023-11-07T05:31:56Z","name":"<string>","description":"<string>","stats": {"status":"CORPUS_STATUS_UNSPECIFIED","lastUpdated":"2023-11-07T05:31:56Z","numChunks":123,"numDocs":123,"numVectors":123}}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

```json
{"results": [{"corpusId":"<string>","created":"2023-11-07T05:31:56Z","name":"<string>","description":"<string>","stats": {"status":"CORPUS_STATUS_UNSPECIFIED","lastUpdated":"2023-11-07T05:31:56Z","numChunks":123,"numDocs":123,"numVectors":123}}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

## Full Content

```
Corpora, Query, Sources
List Corpora
Returns details for all corpora
GET
/
api
/
corpora
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
https://api.ultravox.ai/api/corpora
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
"corpusId"
:
"<string>"
,
"created"
:
"2023-11-07T05:31:56Z"
,
"name"
:
"<string>"
,
"description"
:
"<string>"
,
"stats"
: {
"status"
:
"CORPUS_STATUS_UNSPECIFIED"
,
"lastUpdated"
:
"2023-11-07T05:31:56Z"
,
"numChunks"
:
123
,
"numDocs"
:
123
,
"numVectors"
:
123
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
Authorizations
​
X-API-Key
string
header
required
API key
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
corpusId
string
The unique ID of this corpus.
​
results.
created
string<date-time>
When this corpus was created.
​
results.
name
string
The name of this corpus.
​
results.
description
string
A description of this corpus.
​
results.
stats
object
The current stats for this corpus.
Show
child attributes
​
results.stats.
status
enum<string>
The current status of this corpus, indicating whether it is queryable.
Available options
:
CORPUS_STATUS_UNSPECIFIED
,
CORPUS_STATUS_EMPTY
,
CORPUS_STATUS_INITIALIZING
,
CORPUS_STATUS_READY
,
CORPUS_STATUS_UPDATING
​
results.stats.
lastUpdated
string<date-time>
The last time the contents of this corpus were updated.
​
results.stats.
numChunks
integer<int32>
The number of chunks in this corpus. Chunks are subsets of documents.
​
results.stats.
numDocs
integer<int32>
The number of documents in this corpus.
​
results.stats.
numVectors
integer<int32>
The number of vectors in this corpus. Vectors are used for semantic search.
Multiple vectors may correspond to a single chunk.
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
Create Corpus
Creates a new corpus using the specified name and description
Next
⌘
I
discord
github
x
Powered by Mintlify
```
