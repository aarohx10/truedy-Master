# Delete Corpus

**URL:** https://docs.ultravox.ai/api-reference/corpora/corpora-delete

## Description
Deletes the specified corpus

## Endpoint
```
DELETE 
```

## Request

### cURL Example
```bash
curl--requestDELETE\--urlhttps://api.ultravox.ai/api/corpora/{corpus_id}\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestDELETE\--urlhttps://api.ultravox.ai/api/corpora/{corpus_id}\--header'X-API-Key: <api-key>'
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
Delete Corpus
Deletes the specified corpus
DELETE
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
DELETE
\
--url
https://api.ultravox.ai/api/corpora/{corpus_id}
\
--header
'X-API-Key: <api-key>'
204
Copy
Ask AI
{}
Also deletes all associated corpus sources.
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
204
No response body
Previous
Query Corpus
Queries the specified corpus and returns the specified number of results
Next
⌘
I
discord
github
x
Powered by Mintlify
```
