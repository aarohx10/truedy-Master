# Get Account

**URL:** https://docs.ultravox.ai/api-reference/accounts/accounts-me-get

## Description
Returns account details for a single account

## Endpoint
```
GET 
```

## Request

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/accounts/me\--header'X-API-Key: <api-key>'
```

### cURL Example
```bash
curl--requestGET\--urlhttps://api.ultravox.ai/api/accounts/me\--header'X-API-Key: <api-key>'
```

## Response

### Response Schema

```json
{"name":"<string>","billingUrl":"<string>","freeTimeUsed":"<string>","freeTimeRemaining":"<string>","hasActiveSubscription":true,"subscriptionTier":"<string>","subscriptionCadence":"<string>","subscriptionExpiration":"2023-11-07T05:31:56Z","subscriptionScheduledUpdate":"2023-11-07T05:31:56Z","subscriptionRenewal":"2023-11-07T05:31:56Z","activeCalls":123,"allowedConcurrentCalls":123,"allowedVoices":123,"allowedCorpora":123}
```

```json
{"name":"<string>","billingUrl":"<string>","freeTimeUsed":"<string>","freeTimeRemaining":"<string>","hasActiveSubscription":true,"subscriptionTier":"<string>","subscriptionCadence":"<string>","subscriptionExpiration":"2023-11-07T05:31:56Z","subscriptionScheduledUpdate":"2023-11-07T05:31:56Z","subscriptionRenewal":"2023-11-07T05:31:56Z","activeCalls":123,"allowedConcurrentCalls":123,"allowedVoices":123,"allowedCorpora":123}
```

## Full Content

```
Accounts
Get Account
Returns account details for a single account
GET
/
api
/
accounts
/
me
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
https://api.ultravox.ai/api/accounts/me
\
--header
'X-API-Key: <api-key>'
200
Copy
Ask AI
{
"name"
:
"<string>"
,
"billingUrl"
:
"<string>"
,
"freeTimeUsed"
:
"<string>"
,
"freeTimeRemaining"
:
"<string>"
,
"hasActiveSubscription"
:
true
,
"subscriptionTier"
:
"<string>"
,
"subscriptionCadence"
:
"<string>"
,
"subscriptionExpiration"
:
"2023-11-07T05:31:56Z"
,
"subscriptionScheduledUpdate"
:
"2023-11-07T05:31:56Z"
,
"subscriptionRenewal"
:
"2023-11-07T05:31:56Z"
,
"activeCalls"
:
123
,
"allowedConcurrentCalls"
:
123
,
"allowedVoices"
:
123
,
"allowedCorpora"
:
123
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
name
string
required
​
billingUrl
string
required
​
freeTimeUsed
string
required
How much free time has been used by previous (or ongoing) calls.
​
freeTimeRemaining
string
required
How much free call time this account has remaining. (This could increase if an existing call ends without using its maximum duration or an unjoined call times out.)
​
hasActiveSubscription
boolean
required
Whether the account has an active subscription.
​
subscriptionTier
string | null
required
The current subscription tier for this account.
​
subscriptionCadence
string | null
required
How often the subscription is billed for this account.
​
subscriptionExpiration
string<date-time> | null
required
The expiration date of the current subscription for this account, if any. This is the point at which access will end unless credit remains.
​
subscriptionScheduledUpdate
string<date-time> | null
required
The point in the future where this account's subscription is scheduled to change.
​
subscriptionRenewal
string<date-time> | null
required
When this account's subscription renews, if applicable.
​
activeCalls
integer
required
The number of active calls for this account.
​
allowedConcurrentCalls
integer | null
required
The maximum number of concurrent calls allowed for this account.
​
allowedVoices
integer | null
required
The maximum number of custom voices allowed for this account.
​
allowedCorpora
integer | null
required
The maximum number of corpora allowed for this account.
Previous
Get Call Usage
Returns aggregated and per-day call usage data
Next
⌘
I
discord
github
x
Powered by Mintlify
```
