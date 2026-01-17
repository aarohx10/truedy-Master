# Delete Corpus Source

**URL:** https://docs.ultravox.ai/api-reference/corpora/corpora-sources-delete

## Description
Deletes the specified source

## Endpoint
```
DELETE 
```

## Request

### cURL Example
```bash
curl--requestDELETE\--urlhttps://api.ultravox.ai/api/corpora/{corpus_id}/sources/{source_id}\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestDELETE\--urlhttps://api.ultravox.ai/api/corpora/{corpus_id}/sources/{source_id}\--header'X-API-Key: <api-key>'
```

## Response

### Response Schema

```json
{}
```

```json
{}
```

## Full Content

```
Corpora, Query, Sources
Delete Corpus Source
Deletes the specified source
DELETE
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
DELETE
\
--url
https://api.ultravox.ai/api/corpora/{corpus_id}/sources/{source_id}
\
--header
'X-API-Key: <api-key>'
204
Copy
Ask AI
{}
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
Response
204
No response body
Previous
List Corpus Source Documents
Returns details for all documents contained in the source
Next
⌘
I
discord
github
x
Powered by Mintlify
```
