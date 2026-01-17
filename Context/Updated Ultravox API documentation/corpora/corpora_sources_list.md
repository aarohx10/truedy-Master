# List Corpus Sources

**URL:** https://docs.ultravox.ai/api-reference/corpora/corpora-sources-list

## Description
Lists all sources that are part of the specified corpus

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/corpora/{corpus_id}/sources\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/corpora/{corpus_id}/sources\--header'X-API-Key: <api-key>'
```

## Response

### Response Schema

```json
{"results": [{"corpusId":"<string>","sourceId":"<string>","created":"2023-11-07T05:31:56Z","name":"<string>","description":"<string>","stats": {"status":"SOURCE_STATUS_UNSPECIFIED","lastUpdated":"2023-11-07T05:31:56Z","numDocs":123},"loadSpec": {"maxDocuments":123,"maxDocumentBytes":123,"relevantDocumentTypes": {"include": {"mimeTypes": ["<string>"]},"exclude": {"mimeTypes": ["<string>"]}},"startUrls": ["<string>"],"maxDepth":123},"crawl": {"maxDocuments":123,"maxDocumentBytes":123,"relevantDocumentTypes": {"include": {"mimeTypes": ["<string>"]},"exclude": {"mimeTypes": ["<string>"]}},"startUrls": ["<string>"],"maxDepth":123},"upload": {"documentIds": ["<string>"]}}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

```json
{"results": [{"corpusId":"<string>","sourceId":"<string>","created":"2023-11-07T05:31:56Z","name":"<string>","description":"<string>","stats": {"status":"SOURCE_STATUS_UNSPECIFIED","lastUpdated":"2023-11-07T05:31:56Z","numDocs":123},"loadSpec": {"maxDocuments":123,"maxDocumentBytes":123,"relevantDocumentTypes": {"include": {"mimeTypes": ["<string>"]},"exclude": {"mimeTypes": ["<string>"]}},"startUrls": ["<string>"],"maxDepth":123},"crawl": {"maxDocuments":123,"maxDocumentBytes":123,"relevantDocumentTypes": {"include": {"mimeTypes": ["<string>"]},"exclude": {"mimeTypes": ["<string>"]}},"startUrls": ["<string>"],"maxDepth":123},"upload": {"documentIds": ["<string>"]}}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

## Full Content

```
Corpora, Query, Sources
List Corpus Sources
Lists all sources that are part of the specified corpus
GET
/
api
/
corpora
/
{corpus_id}
/
sources
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
https://api.ultravox.ai/api/corpora/{corpus_id}/sources
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
"sourceId"
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
"SOURCE_STATUS_UNSPECIFIED"
,
"lastUpdated"
:
"2023-11-07T05:31:56Z"
,
"numDocs"
:
123
},
"loadSpec"
: {
"maxDocuments"
:
123
,
"maxDocumentBytes"
:
123
,
"relevantDocumentTypes"
: {
"include"
: {
"mimeTypes"
: [
"<string>"
]
},
"exclude"
: {
"mimeTypes"
: [
"<string>"
]
}
},
"startUrls"
: [
"<string>"
],
"maxDepth"
:
123
},
"crawl"
: {
"maxDocuments"
:
123
,
"maxDocumentBytes"
:
123
,
"relevantDocumentTypes"
: {
"include"
: {
"mimeTypes"
: [
"<string>"
]
},
"exclude"
: {
"mimeTypes"
: [
"<string>"
]
}
},
"startUrls"
: [
"<string>"
],
"maxDepth"
:
123
},
"upload"
: {
"documentIds"
: [
"<string>"
]
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
Path Parameters
​
corpus_id
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
corpusId
string
The id of this source's corpus.
​
results.
sourceId
string
The unique ID of this source.
​
results.
created
string<date-time>
When this source was created.
​
results.
name
string
The name of this source.
​
results.
description
string
A description of this source.
​
results.
stats
object
The current stats for this source.
Show
child attributes
​
results.stats.
status
enum<string>
The current status of this source, indicating whether it affects queries.
Available options
:
SOURCE_STATUS_UNSPECIFIED
,
SOURCE_STATUS_INITIALIZING
,
SOURCE_STATUS_READY
,
SOURCE_STATUS_UPDATING
​
results.stats.
lastUpdated
string<date-time>
When this source last finished contributing contents to its corpus.
​
results.stats.
numDocs
integer<int32>
The number of documents in this source. This includes both loaded documents
and derived documents.
​
results.
loadSpec
object
DEPRECATED. Prefer setting crawl instead. If either crawl or upload is set, this field will be ignored.
Show
child attributes
​
results.loadSpec.
maxDocuments
integer<int32>
The maximum number of documents to ingest.
​
results.loadSpec.
maxDocumentBytes
integer<int32>
The maximum size of an individual document in bytes.
​
results.loadSpec.
relevantDocumentTypes
object
The types of documents to keep. Any documents surfaced during loading
that don't match this filter will be discarded. If not set, Ultravox will
choose a default that includes types known to provide real value.
Show
child attributes
​
results.loadSpec.relevantDocumentTypes.
include
object
Mime types must be in this set to be kept.
Show
child attributes
​
results.loadSpec.relevantDocumentTypes.include.
mimeTypes
string[]
The mime types in this set.
​
results.loadSpec.relevantDocumentTypes.
exclude
object
Mime types must not be in this set to be kept.
Show
child attributes
​
results.loadSpec.relevantDocumentTypes.exclude.
mimeTypes
string[]
The mime types in this set.
​
results.loadSpec.
startUrls
string[]
The list of start URLs for crawling. If max_depth is 1, only these URLs will
be fetched. Otherwise, links from these urls will be followed up to the
max_depth.
​
results.loadSpec.
maxDepth
integer<int32>
The maximum depth of links to traverse. Use 1 to only fetch the startUrls,
2 to fetch the startUrls and documents directly linked from them, 3 to
additionally fetch documents linked from those (excluding anything already
seen), etc.
​
results.
crawl
object
Allows loading documents by crawling the web.
Show
child attributes
​
results.crawl.
maxDocuments
integer<int32>
The maximum number of documents to ingest.
​
results.crawl.
maxDocumentBytes
integer<int32>
The maximum size of an individual document in bytes.
​
results.crawl.
relevantDocumentTypes
object
The types of documents to keep. Any documents surfaced during loading
that don't match this filter will be discarded. If not set, Ultravox will
choose a default that includes types known to provide real value.
Show
child attributes
​
results.crawl.relevantDocumentTypes.
include
object
Mime types must be in this set to be kept.
Show
child attributes
​
results.crawl.relevantDocumentTypes.include.
mimeTypes
string[]
The mime types in this set.
​
results.crawl.relevantDocumentTypes.
exclude
object
Mime types must not be in this set to be kept.
Show
child attributes
​
results.crawl.relevantDocumentTypes.exclude.
mimeTypes
string[]
The mime types in this set.
​
results.crawl.
startUrls
string[]
The list of start URLs for crawling. If max_depth is 1, only these URLs will
be fetched. Otherwise, links from these urls will be followed up to the
max_depth.
​
results.crawl.
maxDepth
integer<int32>
The maximum depth of links to traverse. Use 1 to only fetch the startUrls,
2 to fetch the startUrls and documents directly linked from them, 3 to
additionally fetch documents linked from those (excluding anything already
seen), etc.
​
results.
upload
object
Allows loading from a uploaded document.
Show
child attributes
​
results.upload.
documentIds
string[]
The IDs of uploaded documents. These documents must
have been previously uploaded using the document upload API.
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
Create Corpus Source
Creates a new source for the specified corpus
Next
⌘
I
discord
github
x
Powered by Mintlify
```
