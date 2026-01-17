# Update Corpus

**URL:** https://docs.ultravox.ai/api-reference/corpora/corpora-patch

## Description
Updates the specified corpus

## Endpoint
```
PATCH 
```

## Request

### cURL Example
```bash
curl--requestPATCH\--urlhttps://api.ultravox.ai/api/corpora/{corpus_id}\--header'Content-Type: application/json'\--header'X-API-Key: <api-key>'\--data'{"corpusId": "<string>","created": "2023-11-07T05:31:56Z","name": "<string>","description": "<string>","stats": {"status": "CORPUS_STATUS_UNSPECIFIED","lastUpdated": "2023-11-07T05:31:56Z","numChunks": 123,"numDocs": 123,"numVectors": 123}}'
```

### cURL Example
```bash
curl--requestPATCH\--urlhttps://api.ultravox.ai/api/corpora/{corpus_id}\--header'Content-Type: application/json'\--header'X-API-Key: <api-key>'\--data'{"corpusId": "<string>","created": "2023-11-07T05:31:56Z","name": "<string>","description": "<string>","stats": {"status": "CORPUS_STATUS_UNSPECIFIED","lastUpdated": "2023-11-07T05:31:56Z","numChunks": 123,"numDocs": 123,"numVectors": 123}}'
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
Update Corpus
Updates the specified corpus
PATCH
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
PATCH
\
--url
https://api.ultravox.ai/api/corpora/{corpus_id}
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
"corpusId": "<string>",
"created": "2023-11-07T05:31:56Z",
"name": "<string>",
"description": "<string>",
"stats": {
"status": "CORPUS_STATUS_UNSPECIFIED",
"lastUpdated": "2023-11-07T05:31:56Z",
"numChunks": 123,
"numDocs": 123,
"numVectors": 123
}
}
'
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
Allows partial modifications to the corpus.
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
Body
application/json
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
Delete Corpus
Deletes the specified corpus
Next
⌘
I
discord
github
x
Powered by Mintlify
```
