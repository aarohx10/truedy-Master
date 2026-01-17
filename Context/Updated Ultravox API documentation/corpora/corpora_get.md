# Get Corpus

**URL:** https://docs.ultravox.ai/api-reference/corpora/corpora-get

## Description
Gets details for the specified corpus

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/corpora/{corpus_id}\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/corpora/{corpus_id}\--header'X-API-Key: <api-key>'
```

## Response

### Response Schema

```json
{"corpusId":"<string>","created":"2023-11-07T05:31:56Z","name":"<string>","description":"<string>","stats": {"status":"CORPUS_STATUS_UNSPECIFIED","lastUpdated":"2023-11-07T05:31:56Z","numChunks":123,"numDocs":123,"numVectors":123}}
```

```json
{"corpusId":"<string>","created":"2023-11-07T05:31:56Z","name":"<string>","description":"<string>","stats": {"status":"CORPUS_STATUS_UNSPECIFIED","lastUpdated":"2023-11-07T05:31:56Z","numChunks":123,"numDocs":123,"numVectors":123}}
```

## Full Content

```
Corpora, Query, Sources
Get Corpus
Gets details for the specified corpus
GET
/
api
/
corpora
/
{corpus_id}
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
https://api.ultravox.ai/api/corpora/{corpus_id}
\
--header
'X-API-Key: <api-key>'
200
Copy
Ask AI
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
Authorizations
​
X-API-Key
string
header
required
API key
Path Parameters
​
corpus_id
string<uuid>
required
Response
200 - application/json
A queryable collection of documents. A corpus can be used to ground Ultravox
with factual content for a particular domain.
​
corpusId
string
The unique ID of this corpus.
​
created
string<date-time>
When this corpus was created.
​
name
string
The name of this corpus.
​
description
string
A description of this corpus.
​
stats
object
The current stats for this corpus.
Show
child attributes
​
stats.
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
stats.
lastUpdated
string<date-time>
The last time the contents of this corpus were updated.
​
stats.
numChunks
integer<int32>
The number of chunks in this corpus. Chunks are subsets of documents.
​
stats.
numDocs
integer<int32>
The number of documents in this corpus.
​
stats.
numVectors
integer<int32>
The number of vectors in this corpus. Vectors are used for semantic search.
Multiple vectors may correspond to a single chunk.
Previous
Update Corpus
Updates the specified corpus
Next
⌘
I
discord
github
x
Powered by Mintlify
```
