# Delete Scheduled Call Batch

**URL:** https://docs.ultravox.ai/api-reference/agents/agents-scheduled-batches-delete

## Description
Deletes a scheduled call batch

## Endpoint
```
DELETE 
```

## Request

### cURL Example
```bash
curl--requestDELETE\--urlhttps://api.ultravox.ai/api/agents/{agent_id}/scheduled_batches/{batch_id}\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestDELETE\--urlhttps://api.ultravox.ai/api/agents/{agent_id}/scheduled_batches/{batch_id}\--header'X-API-Key: <api-key>'
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
Scheduled Call Batches
Delete Scheduled Call Batch
Deletes a scheduled call batch
DELETE
/
api
/
agents
/
{agent_id}
/
scheduled_batches
/
{batch_id}
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
https://api.ultravox.ai/api/agents/{agent_id}/scheduled_batches/{batch_id}
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
agent_id
string<uuid>
required
​
batch_id
string<uuid>
required
Response
204
No response body
Previous
List Scheduled Call Batch Created Calls
Returns details for all created calls in a scheduled call batch
Next
⌘
I
discord
github
x
Powered by Mintlify
```
