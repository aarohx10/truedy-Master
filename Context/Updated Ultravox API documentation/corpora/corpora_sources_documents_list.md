# List Corpus Source Documents

**URL:** https://docs.ultravox.ai/api-reference/corpora/corpora-sources-documents-list

## Description
Returns details for all documents contained in the source

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/corpora/{corpus_id}/sources/{source_id}/documents\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/corpora/{corpus_id}/sources/{source_id}/documents\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
{"results": [{"corpusId":"<string>","sourceId":"<string>","documentId":"<string>","created":"2023-11-07T05:31:56Z","mimeType":"<string>","metadata": {"publicUrl":"<string>","language":"<string>","title":"<string>","description":"<string>","published":"2023-11-07T05:31:56Z"},"sizeBytes":"<string>"}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

### cURL Example
```bash
{"results": [{"corpusId":"<string>","sourceId":"<string>","documentId":"<string>","created":"2023-11-07T05:31:56Z","mimeType":"<string>","metadata": {"publicUrl":"<string>","language":"<string>","title":"<string>","description":"<string>","published":"2023-11-07T05:31:56Z"},"sizeBytes":"<string>"}],"next":"http://api.example.org/accounts/?cursor=cD00ODY%3D\"","previous":"http://api.example.org/accounts/?cursor=cj0xJnA9NDg3","total":123}
```

## Full Content

```
Corpora, Query, Sources
List Corpus Source Documents
Returns details for all documents contained in the source
GET
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
/
documents
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
https://api.ultravox.ai/api/corpora/{corpus_id}/sources/{source_id}/documents
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
"documentId"
:
"<string>"
,
"created"
:
"2023-11-07T05:31:56Z"
,
"mimeType"
:
"<string>"
,
"metadata"
: {
"publicUrl"
:
"<string>"
,
"language"
:
"<string>"
,
"title"
:
"<string>"
,
"description"
:
"<string>"
,
"published"
:
"2023-11-07T05:31:56Z"
},
"sizeBytes"
:
"<string>"
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
​
source_id
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
The id of the corpus in which this document is included.
​
results.
sourceId
string
The id of the source that provides this document.
​
results.
documentId
string
The unique ID of this document.
​
results.
created
string<date-time>
When this document was created.
​
results.
mimeType
string
The MIME type of the document.
https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types
​
results.
metadata
object
Metadata about the document.
Show
child attributes
​
results.metadata.
publicUrl
string
The public URL of the document, if any.
​
results.metadata.
language
string
The BCP47 language code of the document, if known.
​
results.metadata.
title
string
The title of the document, if known.
​
results.metadata.
description
string
A description of the document, if known.
​
results.metadata.
published
string<date-time>
The timestamp that the document was published, if known.
​
results.
sizeBytes
string
The size of the document contents, in bytes.
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
Get Corpus Source Document
Retrieves details for the specified source document
Next
⌘
I
discord
github
x
Powered by Mintlify
```
