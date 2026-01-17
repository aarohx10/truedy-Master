# Get Corpus Source Document

**URL:** https://docs.ultravox.ai/api-reference/corpora/corpora-sources-documents-get

## Description
Retrieves details for the specified source document

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/corpora/{corpus_id}/sources/{source_id}/documents/{document_id}\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/corpora/{corpus_id}/sources/{source_id}/documents/{document_id}\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
{"corpusId":"<string>","sourceId":"<string>","documentId":"<string>","created":"2023-11-07T05:31:56Z","mimeType":"<string>","metadata": {"publicUrl":"<string>","language":"<string>","title":"<string>","description":"<string>","published":"2023-11-07T05:31:56Z"},"sizeBytes":"<string>"}
```

### cURL Example
```bash
{"corpusId":"<string>","sourceId":"<string>","documentId":"<string>","created":"2023-11-07T05:31:56Z","mimeType":"<string>","metadata": {"publicUrl":"<string>","language":"<string>","title":"<string>","description":"<string>","published":"2023-11-07T05:31:56Z"},"sizeBytes":"<string>"}
```

## Full Content

```
Corpora, Query, Sources
Get Corpus Source Document
Retrieves details for the specified source document
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
/
{document_id}
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
https://api.ultravox.ai/api/corpora/{corpus_id}/sources/{source_id}/documents/{document_id}
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
document_id
string<uuid>
required
​
source_id
string<uuid>
required
Response
200 - application/json
A single complete source of information included in a corpus. In the most
straight-forward case, this could be an uploaded PDF or a single webpage.
However, documents can also be created from other documents during processing,
for example turning an HTML page into a markdown document.
​
corpusId
string
The id of the corpus in which this document is included.
​
sourceId
string
The id of the source that provides this document.
​
documentId
string
The unique ID of this document.
​
created
string<date-time>
When this document was created.
​
mimeType
string
The MIME type of the document.
https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types
​
metadata
object
Metadata about the document.
Show
child attributes
​
metadata.
publicUrl
string
The public URL of the document, if any.
​
metadata.
language
string
The BCP47 language code of the document, if known.
​
metadata.
title
string
The title of the document, if known.
​
metadata.
description
string
A description of the document, if known.
​
metadata.
published
string<date-time>
The timestamp that the document was published, if known.
​
sizeBytes
string
The size of the document contents, in bytes.
Previous
Create Corpus File Upload
Creates a new URL and document ID to use for uploading a static file
Next
⌘
I
discord
github
x
Powered by Mintlify
```
