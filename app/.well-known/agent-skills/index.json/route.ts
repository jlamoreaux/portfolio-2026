import { NextResponse } from "next/server"

async function sha256hex(content: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(content)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

const PORTFOLIO_SKILL = `# Skill: Get Portfolio Content as Markdown

## Description

Fetch any page of jlmx.dev as clean Markdown by sending an HTTP request with
\`Accept: text/markdown\`. The server performs content negotiation and returns
the page's content in Markdown format suitable for LLM consumption.

## Usage

\`\`\`http
GET / HTTP/1.1
Host: jlmx.dev
Accept: text/markdown
\`\`\`

### Supported paths

| Path | Description |
|------|-------------|
| \`/\` | Homepage — bio, featured projects, recent posts |
| \`/blog\` | All blog posts with excerpts |
| \`/blog/{slug}\` | Single blog post |
| \`/projects\` | All projects with full descriptions |
| \`/uses\` | Tools and gear used daily |

### Response

- **Content-Type:** \`text/markdown; charset=utf-8\`
- **Cache-Control:** \`public, max-age=3600, stale-while-revalidate=86400\`
- **Vary:** \`Accept\`

## Direct endpoint

Alternatively, use \`/api/markdown?path={path}\` directly:

\`\`\`
GET /api/markdown?path=/blog/my-post-slug
\`\`\`
`

const HEALTH_SKILL = `# Skill: Health Check

## Description

Check the operational status of jlmx.dev and its CMS connection.

## Usage

\`\`\`http
GET /api/health HTTP/1.1
Host: jlmx.dev
Accept: application/json
\`\`\`

## Response

\`\`\`json
{
  "status": "healthy" | "degraded" | "warning",
  "message": "string",
  "sanity": true | false,
  "timestamp": "ISO 8601"
}
\`\`\`

| Status | Meaning |
|--------|---------|
| \`healthy\` | Site and CMS are fully operational |
| \`degraded\` | Site is up but CMS is unavailable; showing cached content |
| \`warning\` | Sanity CMS not configured |
`

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jlmx.dev"

  const [portfolioHash, healthHash] = await Promise.all([
    sha256hex(PORTFOLIO_SKILL),
    sha256hex(HEALTH_SKILL),
  ])

  const index = {
    $schema: "https://agentskills.io/schema/v0.2.0/index.json",
    skills: [
      {
        name: "get-portfolio-markdown",
        type: "skill-file",
        description:
          "Fetch any page of this portfolio as clean Markdown via Accept: text/markdown content negotiation.",
        url: `${siteUrl}/.well-known/agent-skills/portfolio.md`,
        sha256: portfolioHash,
      },
      {
        name: "health-check",
        type: "skill-file",
        description: "Check site and CMS operational status via GET /api/health.",
        url: `${siteUrl}/.well-known/agent-skills/health.md`,
        sha256: healthHash,
      },
    ],
  }

  return NextResponse.json(index, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
