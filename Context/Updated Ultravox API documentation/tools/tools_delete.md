# Delete Tool

**URL:** https://docs.ultravox.ai/api-reference/tools/tools-delete

## Description
Deletes the specified tool

## Endpoint
```
DELETE 
```

## Request

### cURL Example
```bash
curl--requestDELETE\--urlhttps://api.ultravox.ai/api/tools/{tool_id}\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestDELETE\--urlhttps://api.ultravox.ai/api/tools/{tool_id}\--header'X-API-Key: <api-key>'
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
Tools
Delete Tool
Deletes the specified tool
DELETE
/
api
/
tools
/
{tool_id}
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
https://api.ultravox.ai/api/tools/{tool_id}
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
tool_id
string<uuid>
required
Response
204
No response body
Previous
Get Tool History
Gets all calls that have used the specified tool
Next
⌘
I
discord
github
x
Powered by Mintlify
```
