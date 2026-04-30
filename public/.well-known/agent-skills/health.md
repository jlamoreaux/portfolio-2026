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
  "status": "healthy" | "degraded" | "warning",
  "message": "string",
  "sanity": true | false,
  "timestamp": "ISO 8601"
}
```

| Status | Meaning |
|--------|---------|
| `healthy` | Site and CMS are fully operational |
| `degraded` | Site is up but CMS is unavailable; showing cached content |
| `warning` | Sanity CMS not configured |
