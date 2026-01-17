# Query Corpus

**URL:** https://docs.ultravox.ai/api-reference/corpora/corpus-query

## Description
Queries the specified corpus and returns the specified number of results

## Endpoint
```
POST 
```

## Request

### cURL Example
```bash
curl--requestPOST\--urlhttps://api.ultravox.ai/api/corpora/{corpus_id}/query\--header'Content-Type: application/json'\--header'X-API-Key: <api-key>'\--data'{"query": "<string>","maxResults": 123}'
```

### cURL Example
```bash
curl--requestPOST\--urlhttps://api.ultravox.ai/api/corpora/{corpus_id}/query\--header'Content-Type: application/json'\--header'X-API-Key: <api-key>'\--data'{"query": "<string>","maxResults": 123}'
```

### cURL Example
```bash
[{"content":"<string>","score":123,"citation": {"sourceId":"<string>","documentId":"<string>","publicUrl":"<string>","title":"<string>"}}]
```

### cURL Example
```bash
[{"content":"<string>","score":123,"citation": {"sourceId":"<string>","documentId":"<string>","publicUrl":"<string>","title":"<string>"}}]
```

## Full Content

```
Corpora, Query, Sources
Query Corpus
Queries the specified corpus and returns the specified number of results
POST
/
api
/
corpora
/
{corpus_id}
/
query
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
https://api.ultravox.ai/api/corpora/{corpus_id}/query
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
"query": "<string>",
"maxResults": 123
}
'
200
Copy
Ask AI
[
{
"content"
:
"<string>"
,
"score"
:
123
,
"citation"
: {
"sourceId"
:
"<string>"
,
"documentId"
:
"<string>"
,
"publicUrl"
:
"<string>"
,
"title"
:
"<string>"
}
}
]
Use the queryCorpus Tool
Any agents that you deploy should use the
built-in queryCorpus tool
.
This endpoint should be use for testing.
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
A request to query a corpus.
​
query
string
The query to run.
​
maxResults
integer<int32>
The maximum number of results to return.
Response
200 - application/json
​
content
string
The content of the retrieved chunk.
​
score
number<double>
The score of this chunk, with higher scores indicating better matches.
​
citation
object
A citation for this chunk.
Show
child attributes
​
citation.
sourceId
string
The source that provided the document from which this chunk was retrieved.
​
citation.
documentId
string
The document from which this chunk was retrieved.
​
citation.
publicUrl
string
The public URL of the document, if any.
​
citation.
title
string
The title of the document, if known.
Previous
List Corpus Sources
Lists all sources that are part of the specified corpus
Next
⌘
I
discord
github
x
Powered by Mintlify
```
