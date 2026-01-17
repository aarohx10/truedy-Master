# Get Tool

**URL:** https://docs.ultravox.ai/api-reference/tools/tools-get

## Description
Gets details for the specified tool

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/tools/{tool_id}\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/tools/{tool_id}\--header'X-API-Key: <api-key>'
```

## Response

### Response Schema

```json
{"toolId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","name":"<string>","created":"2023-11-07T05:31:56Z","definition": {"modelToolName":"<string>","description":"<string>","dynamicParameters": [{"name":"<string>","location":"PARAMETER_LOCATION_UNSPECIFIED","schema": {},"required":true}],"staticParameters": [{"name":"<string>","location":"PARAMETER_LOCATION_UNSPECIFIED","value":"<unknown>"}],"automaticParameters": [{"name":"<string>","location":"PARAMETER_LOCATION_UNSPECIFIED","knownValue":"KNOWN_PARAM_UNSPECIFIED"}],"requirements": {"httpSecurityOptions": {"options": [{"requirements": {},"ultravoxCallTokenRequirement": {"scopes": ["<string>"]}}]},"requiredParameterOverrides": ["<string>"]},"timeout":"<string>","precomputable":true,"http": {"baseUrlPattern":"<string>","httpMethod":"<string>"},"client": {},"dataConnection": {},"defaultReaction":"AGENT_REACTION_UNSPECIFIED","staticResponse": {"responseText":"<string>"}},"ownership":"public"}
```

```json
{"toolId":"3c90c3cc-0d44-4b50-8888-8dd25736052a","name":"<string>","created":"2023-11-07T05:31:56Z","definition": {"modelToolName":"<string>","description":"<string>","dynamicParameters": [{"name":"<string>","location":"PARAMETER_LOCATION_UNSPECIFIED","schema": {},"required":true}],"staticParameters": [{"name":"<string>","location":"PARAMETER_LOCATION_UNSPECIFIED","value":"<unknown>"}],"automaticParameters": [{"name":"<string>","location":"PARAMETER_LOCATION_UNSPECIFIED","knownValue":"KNOWN_PARAM_UNSPECIFIED"}],"requirements": {"httpSecurityOptions": {"options": [{"requirements": {},"ultravoxCallTokenRequirement": {"scopes": ["<string>"]}}]},"requiredParameterOverrides": ["<string>"]},"timeout":"<string>","precomputable":true,"http": {"baseUrlPattern":"<string>","httpMethod":"<string>"},"client": {},"dataConnection": {},"defaultReaction":"AGENT_REACTION_UNSPECIFIED","staticResponse": {"responseText":"<string>"}},"ownership":"public"}
```

## Full Content

```
Tools
Get Tool
Gets details for the specified tool
GET
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
GET
\
--url
https://api.ultravox.ai/api/tools/{tool_id}
\
--header
'X-API-Key: <api-key>'
200
Copy
Ask AI
{
"toolId"
:
"3c90c3cc-0d44-4b50-8888-8dd25736052a"
,
"name"
:
"<string>"
,
"created"
:
"2023-11-07T05:31:56Z"
,
"definition"
: {
"modelToolName"
:
"<string>"
,
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
"requirements"
: {
"httpSecurityOptions"
: {
"options"
: [
{
"requirements"
: {},
"ultravoxCallTokenRequirement"
: {
"scopes"
: [
"<string>"
]
}
}
]
},
"requiredParameterOverrides"
: [
"<string>"
]
},
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
},
"ownership"
:
"public"
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
tool_id
string<uuid>
required
Response
200 - application/json
​
toolId
string<uuid>
required
​
name
string
required
Maximum string length:
40
​
created
string<date-time>
required
​
definition
object
required
The base definition of a tool that can be used during a call. Exactly one
implementation (http or client) should be set.
Show
child attributes
​
definition.
modelToolName
string
The name of the tool, as presented to the model. Must match ^[a-zA-Z0-9_-]{1,64}$.
​
definition.
description
string
The description of the tool.
​
definition.
dynamicParameters
object[]
The parameters that the tool accepts.
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
The static parameters added when the tool is invoked.
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
Additional parameters that are automatically set by the system when the tool is invoked.
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
requirements
object
Requirements that must be fulfilled when creating a call for the tool to be used.
Show
child attributes
​
definition.requirements.
httpSecurityOptions
object
Security requirements for an HTTP tool.
Show
child attributes
​
definition.requirements.httpSecurityOptions.
options
object[]
The options for security. Only one must be met. The first one that can be
satisfied will be used in general. The single exception to this rule is
that we always prefer a non-empty set of requirements over an empty set
unless no non-empty set can be satisfied.
Show
child attributes
​
definition.requirements.httpSecurityOptions.options.
requirements
object
Requirements keyed by name.
Show
child attributes
​
definition.requirements.httpSecurityOptions.options.requirements.
{key}
object
A single security requirement that must be met for a tool to be available. Exactly one
of query_api_key, header_api_key, or http_auth should be set.
Show
child attributes
​
definition.requirements.httpSecurityOptions.options.requirements.{key}.
queryApiKey
object
An API key must be added to the query string.
Show
child attributes
​
definition.requirements.httpSecurityOptions.options.requirements.{key}.queryApiKey.
name
string
The name of the query parameter.
​
definition.requirements.httpSecurityOptions.options.requirements.{key}.
headerApiKey
object
An API key must be added to a custom header.
Show
child attributes
​
definition.requirements.httpSecurityOptions.options.requirements.{key}.headerApiKey.
name
string
The name of the header.
​
definition.requirements.httpSecurityOptions.options.requirements.{key}.
httpAuth
object
The HTTP authentication header must be added.
Show
child attributes
​
definition.requirements.httpSecurityOptions.options.requirements.{key}.httpAuth.
scheme
string
The scheme of the HTTP authentication, e.g. "Bearer".
​
definition.requirements.httpSecurityOptions.options.
ultravoxCallTokenRequirement
object
An additional special security requirement that can be automatically fulfilled
during call creation. If a tool has this requirement set, a token identifying
the call and relevant scopes will be created during call creation and set as
an X-Ultravox-Call-Token header when the tool is invoked.
Such tokens are only verifiable by the Ultravox service and primarily exist
for built-in tools (though it's possible for third-party tools that wrap a
built-in tool to make use of them as well).
Show
child attributes
​
definition.requirements.httpSecurityOptions.options.ultravoxCallTokenRequirement.
scopes
string[]
The scopes that must be present in the token.
​
definition.requirements.
requiredParameterOverrides
string[]
Dynamic parameters that must be overridden with an explicit (static) value.
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
definition.
client
object
Details for a client-implemented tool. Only body parameters are allowed
for client tools.
​
definition.
dataConnection
object
Details for a tool implemented via a data connection websocket. Only body
parameters are allowed for data connection tools.
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
​
ownership
enum<string>
required
Available options
:
public
,
private
Previous
Create Tool
Creates a new tool
Next
⌘
I
discord
github
x
Powered by Mintlify
```
