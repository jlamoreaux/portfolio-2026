# Skill: Health Check

## Description

Check the operational status of jlmx.dev and its CMS connection.

## Usage

```http
GET /api/health HTTP/1.1
Host: jlmx.dev
Accept: application/json
```

## Response

```json
{
  "status": "healthy" | "degraded",
  "message": "string",
  "cms": true | false,
  "timestamp": "ISO 8601"
}
```

| Status | Meaning |
|--------|---------|
| `healthy` | Site and CMS are fully operational |
| `degraded` | Site is up but the CMS is unavailable |
