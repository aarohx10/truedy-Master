# Create Corpus File Upload

**URL:** https://docs.ultravox.ai/api-reference/corpora/corpora-uploads-post

## Description
Creates a new URL and document ID to use for uploading a static file

## Endpoint
```
POST 
```

## Request

### cURL Example
```bash
curl--requestPOST\--urlhttps://api.ultravox.ai/api/corpora/{corpus_id}/uploads\--header'Content-Type: application/json'\--header'X-API-Key: <api-key>'\--data'{"mimeType": "<string>","fileName": ""}'
```

### cURL Example
```bash
curl--requestPOST\--urlhttps://api.ultravox.ai/api/corpora/{corpus_id}/uploads\--header'Content-Type: application/json'\--header'X-API-Key: <api-key>'\--data'{"mimeType": "<string>","fileName": ""}'
```

## Response

### Response Schema

```json
{"documentId":"<string>","presignedUrl":"<string>"}
```

```json
{"documentId":"<string>","presignedUrl":"<string>"}
```

## Full Content

```
Corpora, Query, Sources
Create Corpus File Upload
Creates a new URL and document ID to use for uploading a static file
POST
/
api
/
corpora
/
{corpus_id}
/
uploads
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
https://api.ultravox.ai/api/corpora/{corpus_id}/uploads
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
"mimeType": "<string>",
"fileName": ""
}
'
201
Copy
Ask AI
{
"documentId"
:
"<string>"
,
"presignedUrl"
:
"<string>"
}
Upload URLs expire after 5 minutes. You can request a new URL if needed.
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
​
mimeType
string
required
The MIME type of the file to be uploaded.
Minimum string length:
1
​
fileName
string
default:
""
The name of the file to be uploaded.
Response
201 - application/json
​
documentId
string
required
​
presignedUrl
string<uri>
required
Previous
List Tools
Retrieves all available tools
Next
⌘
I
discord
github
x
Powered by Mintlify
```
