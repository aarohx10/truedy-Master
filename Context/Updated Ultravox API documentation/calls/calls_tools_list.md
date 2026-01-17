# List Call Tools

**URL:** https://docs.ultravox.ai/api-reference/calls/calls-tools-list

## Description
Returns all tools that were available at any point during the call

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/calls/{call_id}/tools\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/calls/{call_id}/tools\--header'X-API-Key: <api-key>'
```

## Response

### Response Schema

```json
[{"callToolId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","toolId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","name":"<string>","definition": {"description":"<string>","dynamicParameters": [{"name":"<string>","location":"PARAMETER_LOCATION_UNSPECIFIED","schema": {},"required":true}],"staticParameters": [{"name":"<string>","location":"PARAMETER_LOCATION_UNSPECIFIED","value":"<unknown>"}],"automaticParameters": [{"name":"<string>","location":"PARAMETER_LOCATION_UNSPECIFIED","knownValue":"KNOWN_PARAM_UNSPECIFIED"}],"timeout":"<string>","precomputable":true,"http": {"baseUrlPattern":"<string>","httpMethod":"<string>","authHeaders": ["<string>"],"authQueryParams": ["<string>"],"callTokenScopes": ["<string>"]},"client": {},"dataConnection": {},"defaultReaction":"AGENT_REACTION_UNSPECIFIED","staticResponse": {"responseText":"<string>"}}}]
```

```json
[{"callToolId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","toolId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","name":"<string>","definition": {"description":"<string>","dynamicParameters": [{"name":"<string>","location":"PARAMETER_LOCATION_UNSPECIFIED","schema": {},"required":true}],"staticParameters": [{"name":"<string>","location":"PARAMETER_LOCATION_UNSPECIFIED","value":"<unknown>"}],"automaticParameters": [{"name":"<string>","location":"PARAMETER_LOCATION_UNSPECIFIED","knownValue":"KNOWN_PARAM_UNSPECIFIED"}],"timeout":"<string>","precomputable":true,"http": {"baseUrlPattern":"<string>","httpMethod":"<string>","authHeaders": ["<string>"],"authQueryParams": ["<string>"],"callTokenScopes": ["<string>"]},"client": {},"dataConnection": {},"defaultReaction":"AGENT_REACTION_UNSPECIFIED","staticResponse": {"responseText":"<string>"}}}]
```

## Full Content

```
Calls, Messages, Stages
List Call Tools
Returns all tools that were available at any point during the call
GET
/
api
/
calls
/
{call_id}
/
tools
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
https://api.ultravox.ai/api/calls/{call_id}/tools
\
--header
'X-API-Key: <api-key>'
200
Copy
Ask AI
[
{
"callToolId"
:
"3c90c3cc-0d44-4b50-8888-8dd25736052a"
,
"toolId"
:
"3c90c3cc-0d44-4b50-8888-8dd25736052a"
,
"name"
:
"<string>"
,
"definition"
: {
"description"
:
"<string>"
,
"dynamicParameters"
: [
{
"name"
:
"<string>"
,
"location"
:
"PARAMETER_LOCATION_UNSPECIFIED"
,
"schema"
: {},
"required"
:
true
}
],
"staticParameters"
: [
{
"name"
:
"<string>"
,
"location"
:
"PARAMETER_LOCATION_UNSPECIFIED"
,
"value"
:
"<unknown>"
}
],
"automaticParameters"
: [
{
"name"
:
"<string>"
,
"location"
:
"PARAMETER_LOCATION_UNSPECIFIED"
,
"knownValue"
:
"KNOWN_PARAM_UNSPECIFIED"
}
],
"timeout"
:
"<string>"
,
"precomputable"
:
true
,
"http"
: {
"baseUrlPattern"
:
"<string>"
,
"httpMethod"
:
"<string>"
,
"authHeaders"
: [
"<string>"
],
"authQueryParams"
: [
"<string>"
],
"callTokenScopes"
: [
"<string>"
]
},
"client"
: {},
"dataConnection"
: {},
"defaultReaction"
:
"AGENT_REACTION_UNSPECIFIED"
,
"staticResponse"
: {
"responseText"
:
"<string>"
}
}
}
]
Authorizations
​
X-API-Key
string
header
required
API key
Path Parameters
​
call_id
string<uuid>
required
Response
200 - application/json
​
callToolId
string<uuid>
required
​
toolId
string<uuid> | null
required
​
name
string
required
The possibly overridden name of the tool.
​
definition
object
required
A tool as used for a particular call (omitting auth details).
Show
child attributes
​
definition.
description
string
The description of the tool.
​
definition.
dynamicParameters
object[]
The parameters presented to the model.
Show
child attributes
​
definition.dynamicParameters.
name
string
The name of the parameter.
​
definition.dynamicParameters.
location
enum<string>
Where the parameter is used.
Available options
:
PARAMETER_LOCATION_UNSPECIFIED
,
PARAMETER_LOCATION_QUERY
,
PARAMETER_LOCATION_PATH
,
PARAMETER_LOCATION_HEADER
,
PARAMETER_LOCATION_BODY
​
definition.dynamicParameters.
schema
object
The JsonSchema definition of the parameter. This typically
includes things like type, description, enum values, format,
other restrictions, etc.
​
definition.dynamicParameters.
required
boolean
Whether the parameter is required.
​
definition.
staticParameters
object[]
Parameters added unconditionally when the tool is invoked.
Show
child attributes
​
definition.staticParameters.
name
string
The name of the parameter.
​
definition.staticParameters.
location
enum<string>
Where the parameter is used.
Available options
:
PARAMETER_LOCATION_UNSPECIFIED
,
PARAMETER_LOCATION_QUERY
,
PARAMETER_LOCATION_PATH
,
PARAMETER_LOCATION_HEADER
,
PARAMETER_LOCATION_BODY
​
definition.staticParameters.
value
any
The value of the parameter.
​
definition.
automaticParameters
object[]
Parameters automatically set by the system.
Show
child attributes
​
definition.automaticParameters.
name
string
The name of the parameter.
​
definition.automaticParameters.
location
enum<string>
Where the parameter is used.
Available options
:
PARAMETER_LOCATION_UNSPECIFIED
,
PARAMETER_LOCATION_QUERY
,
PARAMETER_LOCATION_PATH
,
PARAMETER_LOCATION_HEADER
,
PARAMETER_LOCATION_BODY
​
definition.automaticParameters.
knownValue
enum<string>
The value to set for the parameter.
Available options
:
KNOWN_PARAM_UNSPECIFIED
,
KNOWN_PARAM_CALL_ID
,
KNOWN_PARAM_CONVERSATION_HISTORY
,
KNOWN_PARAM_OUTPUT_SAMPLE_RATE
,
KNOWN_PARAM_CALL_STATE
,
KNOWN_PARAM_CALL_STAGE_ID
​
definition.
timeout
string
The maximum amount of time the tool is allowed for execution. The conversation is frozen
while tools run, so prefer sticking to the default unless you're comfortable with that
consequence. If your tool is too slow for the default and can't be made faster, still try to
keep this timeout as low as possible.
​
definition.
precomputable
boolean
The tool is guaranteed to be non-mutating, repeatable, and free of side-effects. Such tools
can safely be executed speculatively, reducing their effective latency. However, the fact they
were called may not be reflected in the call history if their result ends up unused.
​
definition.
http
object
Details for an HTTP tool.
Show
child attributes
​
definition.http.
baseUrlPattern
string
The base URL pattern for the tool, possibly with placeholders for path parameters.
​
definition.http.
httpMethod
string
The HTTP method for the tool.
​
definition.http.
authHeaders
string[]
Auth headers added when the tool is invoked.
​
definition.http.
authQueryParams
string[]
Auth query parameters added when the tool is invoked.
​
definition.http.
callTokenScopes
string[]
If the tool requires a call token, the scopes that must be present in the token.
If this is empty, no call token will be created.
​
definition.
client
object
Details for a client-implemented tool. Only body parameters are allowed
for client tools.
​
definition.
dataConnection
object
Details for invoking a tool via a data connection.
​
definition.
defaultReaction
enum<string>
Indicates the default for how the agent should proceed after the tool is invoked.
Can be overridden by the tool implementation via the X-Ultravox-Agent-Reaction
header.
Available options
:
AGENT_REACTION_UNSPECIFIED
,
AGENT_REACTION_SPEAKS
,
AGENT_REACTION_LISTENS
,
AGENT_REACTION_SPEAKS_ONCE
​
definition.
staticResponse
object
Static response to a tool. When this is used, this response will be returned
without waiting for the tool's response.
Show
child attributes
​
definition.staticResponse.
responseText
string
The predefined text response to be returned immediately
Previous
Get Call Recording
Returns a link to the recording of the call
Next
⌘
I
discord
github
x
Powered by Mintlify
```
