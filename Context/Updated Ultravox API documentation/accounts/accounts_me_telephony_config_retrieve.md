# Get Telephony Credentials

**URL:** https://docs.ultravox.ai/api-reference/accounts/accounts-me-telephony-config-retrieve

## Description
Returns the telephony credentials associated with the active account

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/accounts/me/telephony_config\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/accounts/me/telephony_config\--header'X-API-Key: <api-key>'
```

## Response

### Response Schema

```json
{"twilio": {"accountSid":"<string>","authTokenPrefix": {"prefix":"<string>"},"callCreationAllowedAgentIds": ["3c90c3cc-0d44-4b50-8888-8dd25736052a"],"callCreationAllowAllAgents":false,"requestContextMapping": {}},"telnyx": {"accountSid":"<string>","apiKeyPrefix": {"prefix":"<string>"},"publicKeyPrefix": {"prefix":"<string>"},"applicationSid":"<string>","callCreationAllowedAgentIds": ["3c90c3cc-0d44-4b50-8888-8dd25736052a"],"callCreationAllowAllAgents":false,"requestContextMapping": {}},"plivo": {"authId":"<string>","authTokenPrefix": {"prefix":"<string>"},"callCreationAllowedAgentIds": ["3c90c3cc-0d44-4b50-8888-8dd25736052a"],"callCreationAllowAllAgents":false,"requestContextMapping": {}}}
```

```json
{"twilio": {"accountSid":"<string>","authTokenPrefix": {"prefix":"<string>"},"callCreationAllowedAgentIds": ["3c90c3cc-0d44-4b50-8888-8dd25736052a"],"callCreationAllowAllAgents":false,"requestContextMapping": {}},"telnyx": {"accountSid":"<string>","apiKeyPrefix": {"prefix":"<string>"},"publicKeyPrefix": {"prefix":"<string>"},"applicationSid":"<string>","callCreationAllowedAgentIds": ["3c90c3cc-0d44-4b50-8888-8dd25736052a"],"callCreationAllowAllAgents":false,"requestContextMapping": {}},"plivo": {"authId":"<string>","authTokenPrefix": {"prefix":"<string>"},"callCreationAllowedAgentIds": ["3c90c3cc-0d44-4b50-8888-8dd25736052a"],"callCreationAllowAllAgents":false,"requestContextMapping": {}}}
```

## Full Content

```
Accounts
Get Telephony Credentials
Returns the telephony credentials associated with the active account
GET
/
api
/
accounts
/
me
/
telephony_config
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
https://api.ultravox.ai/api/accounts/me/telephony_config
\
--header
'X-API-Key: <api-key>'
200
Copy
Ask AI
{
"twilio"
: {
"accountSid"
:
"<string>"
,
"authTokenPrefix"
: {
"prefix"
:
"<string>"
},
"callCreationAllowedAgentIds"
: [
"3c90c3cc-0d44-4b50-8888-8dd25736052a"
],
"callCreationAllowAllAgents"
:
false
,
"requestContextMapping"
: {}
},
"telnyx"
: {
"accountSid"
:
"<string>"
,
"apiKeyPrefix"
: {
"prefix"
:
"<string>"
},
"publicKeyPrefix"
: {
"prefix"
:
"<string>"
},
"applicationSid"
:
"<string>"
,
"callCreationAllowedAgentIds"
: [
"3c90c3cc-0d44-4b50-8888-8dd25736052a"
],
"callCreationAllowAllAgents"
:
false
,
"requestContextMapping"
: {}
},
"plivo"
: {
"authId"
:
"<string>"
,
"authTokenPrefix"
: {
"prefix"
:
"<string>"
},
"callCreationAllowedAgentIds"
: [
"3c90c3cc-0d44-4b50-8888-8dd25736052a"
],
"callCreationAllowAllAgents"
:
false
,
"requestContextMapping"
: {}
}
}
Authorizations
​
X-API-Key
string
header
required
API key
Response
200 - application/json
​
twilio
object
Your Twilio configuration.
Show
child attributes
​
twilio.
accountSid
string
required
Your Twilio Account SID.
​
twilio.
authTokenPrefix
object
required
The prefix of your Twilio Auth Token.
Show
child attributes
​
twilio.authTokenPrefix.
prefix
string
required
The prefix of the API key.
​
twilio.
callCreationAllowedAgentIds
string<uuid>[]
List of agents for whom calls may be directly created by this telephony provider to facilitate incoming calls. May not be set if callCreationAllowAllAgents is true.
Maximum array length:
100
​
twilio.
callCreationAllowAllAgents
boolean
default:
false
If true, calls may be directly created by this telephony provider for all agents. If false, only agents listed in callCreationAllowedAgentIds are allowed.
​
twilio.
requestContextMapping
object
Maps (dot separated) request fields to (dot separated) context fields for incoming call creation.
Show
child attributes
​
twilio.requestContextMapping.
{key}
string
​
telnyx
object
Your Telnyx configuration.
Show
child attributes
​
telnyx.
accountSid
string
required
Your Telnyx Account SID.
​
telnyx.
apiKeyPrefix
object
required
The prefix of your Telnyx API Key.
Show
child attributes
​
telnyx.apiKeyPrefix.
prefix
string
required
The prefix of the API key.
​
telnyx.
publicKeyPrefix
object
required
The prefix of your Telnyx Public Key.
Show
child attributes
​
telnyx.publicKeyPrefix.
prefix
string
required
The prefix of the API key.
​
telnyx.
applicationSid
string
required
Your Telnyx Application SID.
​
telnyx.
callCreationAllowedAgentIds
string<uuid>[]
List of agents for whom calls may be directly created by this telephony provider to facilitate incoming calls. May not be set if callCreationAllowAllAgents is true.
Maximum array length:
100
​
telnyx.
callCreationAllowAllAgents
boolean
default:
false
If true, calls may be directly created by this telephony provider for all agents. If false, only agents listed in callCreationAllowedAgentIds are allowed.
​
telnyx.
requestContextMapping
object
Maps (dot separated) request fields to (dot separated) context fields for incoming call creation.
Show
child attributes
​
telnyx.requestContextMapping.
{key}
string
​
plivo
object
Your Plivo configuration.
Show
child attributes
​
plivo.
authId
string
required
Your Plivo Auth ID.
​
plivo.
authTokenPrefix
object
required
The prefix of your Plivo Auth Token.
Show
child attributes
​
plivo.authTokenPrefix.
prefix
string
required
The prefix of the API key.
​
plivo.
callCreationAllowedAgentIds
string<uuid>[]
List of agents for whom calls may be directly created by this telephony provider to facilitate incoming calls. May not be set if callCreationAllowAllAgents is true.
Maximum array length:
100
​
plivo.
callCreationAllowAllAgents
boolean
default:
false
If true, calls may be directly created by this telephony provider for all agents. If false, only agents listed in callCreationAllowedAgentIds are allowed.
​
plivo.
requestContextMapping
object
Maps (dot separated) request fields to (dot separated) context fields for incoming call creation.
Show
child attributes
​
plivo.requestContextMapping.
{key}
string
Previous
List Agents
Returns details for all agents
Next
⌘
I
discord
github
x
Powered by Mintlify
```
