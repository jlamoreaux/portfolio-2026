import { SITE_URL } from "@/lib/site-url"

export type AgentSkill = {
  /** Lowercase alphanumeric + hyphens, per Agent Skills Discovery RFC v0.2.0. */
  name: string
  /** File name served under /.well-known/agent-skills/. */
  file: string
  description: string
  /** Markdown body. Rendered from siteUrl so the served file and its digest agree. */
  render: (siteUrl: string) => string
}

export const AGENT_SKILLS: AgentSkill[] = [
  {
    name: "get-portfolio-markdown",
    file: "portfolio.md",
    description:
      "Fetch any page of this portfolio as clean Markdown via Accept: text/markdown content negotiation.",
    render: (siteUrl) => `# Skill: Get Portfolio Content as Markdown

## Description

Fetch any page of ${host(siteUrl)} as clean Markdown by sending an HTTP request with
\`Accept: text/markdown\`. The server performs content negotiation and returns
the page's content in Markdown format suitable for LLM consumption.

## Usage

\`\`\`http
GET / HTTP/1.1
Host: ${host(siteUrl)}
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
- **Vary:** \`Accept\`

## Direct endpoint

Alternatively, use \`/api/markdown?path={path}\` directly:

\`\`\`
GET ${siteUrl}/api/markdown?path=/blog/my-post-slug
\`\`\`

## Authentication

None. Every endpoint listed here is public and unauthenticated. See ${siteUrl}/auth.md.
`,
  },
  {
    name: "health-check",
    file: "health.md",
    description: "Check site and CMS operational status via GET /api/health.",
    render: (siteUrl) => `# Skill: Health Check

## Description

Check the operational status of ${host(siteUrl)} and its CMS connection.

## Usage

\`\`\`http
GET /api/health HTTP/1.1
Host: ${host(siteUrl)}
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

The endpoint always responds \`200\` so that a CMS outage does not make the site
look down; read the \`status\` field rather than the HTTP status code.

## Authentication

None. See ${siteUrl}/auth.md.
`,
  },
  {
    name: "discover-capabilities",
    file: "discovery.md",
    description:
      "Enumerate every machine-readable discovery document this site publishes: ARD catalog, OpenAPI, MCP server card, skills index, llms.txt and auth.md.",
    render: (siteUrl) => `# Skill: Discover This Site's Agent Capabilities

## Description

${host(siteUrl)} publishes its capabilities as machine-readable documents. Start at the
ARD catalog; it links to everything else.

## Entry points

| Document | URL | Media type |
|----------|-----|------------|
| ARD capability catalog | \`${siteUrl}/.well-known/ai-catalog.json\` | \`application/json\` |
| OpenAPI description | \`${siteUrl}/openapi.json\` | \`application/openapi+json\` |
| MCP server card | \`${siteUrl}/.well-known/mcp/server-card.json\` | \`application/json\` |

The MCP card describes in-page WebMCP tools, not a remote MCP endpoint. Every
capability it names is also reachable as an ordinary HTTPS request, so no MCP
client is required.
| Agent skills index | \`${siteUrl}/.well-known/agent-skills/index.json\` | \`application/json\` |
| RFC 9727 API catalog | \`${siteUrl}/.well-known/api-catalog\` | \`application/linkset+json\` |
| Agent auth policy | \`${siteUrl}/auth.md\` | \`text/markdown\` |
| LLM site summary | \`${siteUrl}/llms.txt\` | \`text/plain\` |
| Sitemap | \`${siteUrl}/sitemap.xml\` | \`application/xml\` |

Every HTML response also advertises these via RFC 8288 \`Link\` headers, so a
\`HEAD\` request against any page is enough to bootstrap discovery.

## DNS

Discovery entry points are also published as DNS-AID \`SVCB\` records under
\`_agents.${host(siteUrl)}\` (\`_index\`, \`_mcp\`). Query
\`_index._agents.${host(siteUrl)}\` with type \`SVCB\` to bootstrap without an HTTP
round trip.

## Authentication

None. See ${siteUrl}/auth.md.
`,
  },
]

function host(siteUrl: string): string {
  try {
    return new URL(siteUrl).host
  } catch {
    return "jlmx.dev"
  }
}

export function getSkillByFile(file: string): AgentSkill | undefined {
  return AGENT_SKILLS.find((skill) => skill.file === file)
}

/**
 * SHA-256 of the exact bytes the skill route serves, formatted as the
 * `sha256:{hex}` digest the Agent Skills Discovery RFC requires.
 *
 * Computed with Web Crypto rather than node:crypto so it runs unchanged on
 * the Cloudflare Workers runtime this site deploys to.
 */
export async function skillDigest(content: string): Promise<string> {
  const bytes = new TextEncoder().encode(content)
  const hash = await crypto.subtle.digest("SHA-256", bytes)
  const hex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
  return `sha256:${hex}`
}

export function skillUrl(skill: AgentSkill, siteUrl: string = SITE_URL): string {
  return `${siteUrl}/.well-known/agent-skills/${skill.file}`
}
