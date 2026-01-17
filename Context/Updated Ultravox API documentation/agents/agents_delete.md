# Delete Agent

**URL:** https://docs.ultravox.ai/api-reference/agents/agents-delete

## Description
Deletes the specified agent

## Endpoint
```
DELETE 
```

## Request

### cURL Example
```bash
curl--requestDELETE\--urlhttps://api.ultravox.ai/api/agents/{agent_id}\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestDELETE\--urlhttps://api.ultravox.ai/api/agents/{agent_id}\--header'X-API-Key: <api-key>'
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
Agents
Delete Agent
Deletes the specified agent
DELETE
/
api
/
agents
/
{agent_id}
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
https://api.ultravox.ai/api/agents/{agent_id}
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
Response
204
No response body
Previous
List Agent Calls
Lists all calls that were created using the specified agent
Next
⌘
I
discord
github
x
Powered by Mintlify
```
