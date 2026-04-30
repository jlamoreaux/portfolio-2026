# Skill: Get Portfolio Content as Markdown

## Description

Fetch any page of jlmx.dev as clean Markdown by sending an HTTP request with
`Accept: text/markdown`. The server performs content negotiation and returns
the page's content in Markdown format suitable for LLM consumption.

## Usage

```http
GET / HTTP/1.1
Host: jlmx.dev
Accept: text/markdown
```

### Supported paths

| Path | Description |
|------|-------------|
| `/` | Homepage — bio, featured projects, recent posts |
| `/blog` | All blog posts with excerpts |
| `/blog/{slug}` | Single blog post |
| `/projects` | All projects with full descriptions |
| `/uses` | Tools and gear used daily |

### Response

- **Content-Type:** `text/markdown; charset=utf-8`
- **Cache-Control:** `public, max-age=3600, stale-while-revalidate=86400`
- **Vary:** `Accept`

## Direct endpoint

Alternatively, use `/api/markdown?path={path}` directly:

```
GET /api/markdown?path=/blog/my-post-slug
```
