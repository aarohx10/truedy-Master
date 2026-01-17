# Update Corpus Source

**URL:** https://docs.ultravox.ai/api-reference/corpora/corpora-sources-patch

## Description
Updates the specified source

## Endpoint
```
PATCH 
```

## Request

### cURL Example
```bash
curl--requestPATCH\--urlhttps://api.ultravox.ai/api/corpora/{corpus_id}/sources/{source_id}\--header'Content-Type: application/json'\--header'X-API-Key: <api-key>'\--data'{"corpusId": "<string>","sourceId": "<string>","created": "2023-11-07T05:31:56Z","name": "<string>","description": "<string>","stats": {"status": "SOURCE_STATUS_UNSPECIFIED","lastUpdated": "2023-11-07T05:31:56Z","numDocs": 123},"loadSpec": {"maxDocuments": 123,"maxDocumentBytes": 123,"relevantDocumentTypes": {"include": {"mimeTypes": ["<string>"]},"exclude": {"mimeTypes": ["<string>"]}},"startUrls": ["<string>"],"maxDepth": 123},"crawl": {"maxDocuments": 123,"maxDocumentBytes": 123,"relevantDocumentTypes": {"include": {"mimeTypes": ["<string>"]},"exclude": {"mimeTypes": ["<string>"]}},"startUrls": ["<string>"],"maxDepth": 123},"upload": {"documentIds": ["<string>"]}}'
```

### cURL Example
```bash
curl--requestPATCH\--urlhttps://api.ultravox.ai/api/corpora/{corpus_id}/sources/{source_id}\--header'Content-Type: application/json'\--header'X-API-Key: <api-key>'\--data'{"corpusId": "<string>","sourceId": "<string>","created": "2023-11-07T05:31:56Z","name": "<string>","description": "<string>","stats": {"status": "SOURCE_STATUS_UNSPECIFIED","lastUpdated": "2023-11-07T05:31:56Z","numDocs": 123},"loadSpec": {"maxDocuments": 123,"maxDocumentBytes": 123,"relevantDocumentTypes": {"include": {"mimeTypes": ["<string>"]},"exclude": {"mimeTypes": ["<string>"]}},"startUrls": ["<string>"],"maxDepth": 123},"crawl": {"maxDocuments": 123,"maxDocumentBytes": 123,"relevantDocumentTypes": {"include": {"mimeTypes": ["<string>"]},"exclude": {"mimeTypes": ["<string>"]}},"startUrls": ["<string>"],"maxDepth": 123},"upload": {"documentIds": ["<string>"]}}'
```

## Response

### Response Schema

```json
{"corpusId":"<string>","sourceId":"<string>","created":"2023-11-07T05:31:56Z","name":"<string>","description":"<string>","stats": {"status":"SOURCE_STATUS_UNSPECIFIED","lastUpdated":"2023-11-07T05:31:56Z","numDocs":123},"loadSpec": {"maxDocuments":123,"maxDocumentBytes":123,"relevantDocumentTypes": {"include": {"mimeTypes": ["<string>"]},"exclude": {"mimeTypes": ["<string>"]}},"startUrls": ["<string>"],"maxDepth":123},"crawl": {"maxDocuments":123,"maxDocumentBytes":123,"relevantDocumentTypes": {"include": {"mimeTypes": ["<string>"]},"exclude": {"mimeTypes": ["<string>"]}},"startUrls": ["<string>"],"maxDepth":123},"upload": {"documentIds": ["<string>"]}}
```

```json
{"corpusId":"<string>","sourceId":"<string>","created":"2023-11-07T05:31:56Z","name":"<string>","description":"<string>","stats": {"status":"SOURCE_STATUS_UNSPECIFIED","lastUpdated":"2023-11-07T05:31:56Z","numDocs":123},"loadSpec": {"maxDocuments":123,"maxDocumentBytes":123,"relevantDocumentTypes": {"include": {"mimeTypes": ["<string>"]},"exclude": {"mimeTypes": ["<string>"]}},"startUrls": ["<string>"],"maxDepth":123},"crawl": {"maxDocuments":123,"maxDocumentBytes":123,"relevantDocumentTypes": {"include": {"mimeTypes": ["<string>"]},"exclude": {"mimeTypes": ["<string>"]}},"startUrls": ["<string>"],"maxDepth":123},"upload": {"documentIds": ["<string>"]}}
```

## Full Content

```
Corpora, Query, Sources
Update Corpus Source
Updates the specified source
PATCH
/
api
/
corpora
/
{corpus_id}
/
sources
/
{source_id}
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
https://api.ultravox.ai/api/corpora/{corpus_id}/sources/{source_id}
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
"sourceId": "<string>",
"created": "2023-11-07T05:31:56Z",
"name": "<string>",
"description": "<string>",
"stats": {
"status": "SOURCE_STATUS_UNSPECIFIED",
"lastUpdated": "2023-11-07T05:31:56Z",
"numDocs": 123
},
"loadSpec": {
"maxDocuments": 123,
"maxDocumentBytes": 123,
"relevantDocumentTypes": {
"include": {
"mimeTypes": [
"<string>"
]
},
"exclude": {
"mimeTypes": [
"<string>"
]
}
},
"startUrls": [
"<string>"
],
"maxDepth": 123
},
"crawl": {
"maxDocuments": 123,
"maxDocumentBytes": 123,
"relevantDocumentTypes": {
"include": {
"mimeTypes": [
"<string>"
]
},
"exclude": {
"mimeTypes": [
"<string>"
]
}
},
"startUrls": [
"<string>"
],
"maxDepth": 123
},
"upload": {
"documentIds": [
"<string>"
]
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
Allows partial updates to the source.
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
​
source_id
string<uuid>
required
Body
application/json
A source of documents for building a corpus. A source defines where documents
are pulled from.
​
corpusId
string
The id of this source's corpus.
​
sourceId
string
The unique ID of this source.
​
created
string<date-time>
When this source was created.
​
name
string
The name of this source.
​
description
string
A description of this source.
​
stats
object
The current stats for this source.
Show
child attributes
​
stats.
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
stats.
lastUpdated
string<date-time>
When this source last finished contributing contents to its corpus.
​
stats.
numDocs
integer<int32>
The number of documents in this source. This includes both loaded documents
and derived documents.
​
loadSpec
object
DEPRECATED. Prefer setting crawl instead. If either crawl or upload is set, this field will be ignored.
Show
child attributes
​
loadSpec.
maxDocuments
integer<int32>
The maximum number of documents to ingest.
​
loadSpec.
maxDocumentBytes
integer<int32>
The maximum size of an individual document in bytes.
​
loadSpec.
relevantDocumentTypes
object
The types of documents to keep. Any documents surfaced during loading
that don't match this filter will be discarded. If not set, Ultravox will
choose a default that includes types known to provide real value.
Show
child attributes
​
loadSpec.relevantDocumentTypes.
include
object
Mime types must be in this set to be kept.
Show
child attributes
​
loadSpec.relevantDocumentTypes.include.
mimeTypes
string[]
The mime types in this set.
​
loadSpec.relevantDocumentTypes.
exclude
object
Mime types must not be in this set to be kept.
Show
child attributes
​
loadSpec.relevantDocumentTypes.exclude.
mimeTypes
string[]
The mime types in this set.
​
loadSpec.
startUrls
string[]
The list of start URLs for crawling. If max_depth is 1, only these URLs will
be fetched. Otherwise, links from these urls will be followed up to the
max_depth.
​
loadSpec.
maxDepth
integer<int32>
The maximum depth of links to traverse. Use 1 to only fetch the startUrls,
2 to fetch the startUrls and documents directly linked from them, 3 to
additionally fetch documents linked from those (excluding anything already
seen), etc.
​
crawl
object
Allows loading documents by crawling the web.
Show
child attributes
​
crawl.
maxDocuments
integer<int32>
The maximum number of documents to ingest.
​
crawl.
maxDocumentBytes
integer<int32>
The maximum size of an individual document in bytes.
​
crawl.
relevantDocumentTypes
object
The types of documents to keep. Any documents surfaced during loading
that don't match this filter will be discarded. If not set, Ultravox will
choose a default that includes types known to provide real value.
Show
child attributes
​
crawl.relevantDocumentTypes.
include
object
Mime types must be in this set to be kept.
Show
child attributes
​
crawl.relevantDocumentTypes.include.
mimeTypes
string[]
The mime types in this set.
​
crawl.relevantDocumentTypes.
exclude
object
Mime types must not be in this set to be kept.
Show
child attributes
​
crawl.relevantDocumentTypes.exclude.
mimeTypes
string[]
The mime types in this set.
​
crawl.
startUrls
string[]
The list of start URLs for crawling. If max_depth is 1, only these URLs will
be fetched. Otherwise, links from these urls will be followed up to the
max_depth.
​
crawl.
maxDepth
integer<int32>
The maximum depth of links to traverse. Use 1 to only fetch the startUrls,
2 to fetch the startUrls and documents directly linked from them, 3 to
additionally fetch documents linked from those (excluding anything already
seen), etc.
​
upload
object
Allows loading from a uploaded document.
Show
child attributes
​
upload.
documentIds
string[]
The IDs of uploaded documents. These documents must
have been previously uploaded using the document upload API.
Response
200 - application/json
A source of documents for building a corpus. A source defines where documents
are pulled from.
​
corpusId
string
The id of this source's corpus.
​
sourceId
string
The unique ID of this source.
​
created
string<date-time>
When this source was created.
​
name
string
The name of this source.
​
description
string
A description of this source.
​
stats
object
The current stats for this source.
Show
child attributes
​
stats.
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
stats.
lastUpdated
string<date-time>
When this source last finished contributing contents to its corpus.
​
stats.
numDocs
integer<int32>
The number of documents in this source. This includes both loaded documents
and derived documents.
​
loadSpec
object
DEPRECATED. Prefer setting crawl instead. If either crawl or upload is set, this field will be ignored.
Show
child attributes
​
loadSpec.
maxDocuments
integer<int32>
The maximum number of documents to ingest.
​
loadSpec.
maxDocumentBytes
integer<int32>
The maximum size of an individual document in bytes.
​
loadSpec.
relevantDocumentTypes
object
The types of documents to keep. Any documents surfaced during loading
that don't match this filter will be discarded. If not set, Ultravox will
choose a default that includes types known to provide real value.
Show
child attributes
​
loadSpec.relevantDocumentTypes.
include
object
Mime types must be in this set to be kept.
Show
child attributes
​
loadSpec.relevantDocumentTypes.include.
mimeTypes
string[]
The mime types in this set.
​
loadSpec.relevantDocumentTypes.
exclude
object
Mime types must not be in this set to be kept.
Show
child attributes
​
loadSpec.relevantDocumentTypes.exclude.
mimeTypes
string[]
The mime types in this set.
​
loadSpec.
startUrls
string[]
The list of start URLs for crawling. If max_depth is 1, only these URLs will
be fetched. Otherwise, links from these urls will be followed up to the
max_depth.
​
loadSpec.
maxDepth
integer<int32>
The maximum depth of links to traverse. Use 1 to only fetch the startUrls,
2 to fetch the startUrls and documents directly linked from them, 3 to
additionally fetch documents linked from those (excluding anything already
seen), etc.
​
crawl
object
Allows loading documents by crawling the web.
Show
child attributes
​
crawl.
maxDocuments
integer<int32>
The maximum number of documents to ingest.
​
crawl.
maxDocumentBytes
integer<int32>
The maximum size of an individual document in bytes.
​
crawl.
relevantDocumentTypes
object
The types of documents to keep. Any documents surfaced during loading
that don't match this filter will be discarded. If not set, Ultravox will
choose a default that includes types known to provide real value.
Show
child attributes
​
crawl.relevantDocumentTypes.
include
object
Mime types must be in this set to be kept.
Show
child attributes
​
crawl.relevantDocumentTypes.include.
mimeTypes
string[]
The mime types in this set.
​
crawl.relevantDocumentTypes.
exclude
object
Mime types must not be in this set to be kept.
Show
child attributes
​
crawl.relevantDocumentTypes.exclude.
mimeTypes
string[]
The mime types in this set.
​
crawl.
startUrls
string[]
The list of start URLs for crawling. If max_depth is 1, only these URLs will
be fetched. Otherwise, links from these urls will be followed up to the
max_depth.
​
crawl.
maxDepth
integer<int32>
The maximum depth of links to traverse. Use 1 to only fetch the startUrls,
2 to fetch the startUrls and documents directly linked from them, 3 to
additionally fetch documents linked from those (excluding anything already
seen), etc.
​
upload
object
Allows loading from a uploaded document.
Show
child attributes
​
upload.
documentIds
string[]
The IDs of uploaded documents. These documents must
have been previously uploaded using the document upload API.
Previous
Delete Corpus Source
Deletes the specified source
Next
⌘
I
discord
github
x
Powered by Mintlify
```
