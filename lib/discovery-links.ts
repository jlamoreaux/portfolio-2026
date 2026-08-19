import { SITE_URL } from "@/lib/site-url"

/**
 * RFC 8288 Link header advertising every machine-readable discovery document.
 * A HEAD request against any page is enough for an agent to bootstrap.
 */
export function discoveryLinkHeader(siteUrl: string = SITE_URL): string {
  return [
    `<${siteUrl}/.well-known/ai-catalog.json>; rel="https://agenticresourcediscovery.org/rel/catalog"`,
    `<${siteUrl}/.well-known/api-catalog>; rel="api-catalog"`,
    `<${siteUrl}/openapi.json>; rel="service-desc"; type="application/openapi+json"`,
    `<${siteUrl}/auth.md>; rel="https://workos.com/rel/auth-md"; type="text/markdown"`,
    `<${siteUrl}/sitemap.xml>; rel="sitemap"`,
    `<${siteUrl}/.well-known/agent-skills/index.json>; rel="https://agentskills.io/rel/skills-index"`,
    `<${siteUrl}/.well-known/mcp/server-card.json>; rel="https://modelcontextprotocol.io/rel/server-card"`,
  ].join(", ")
}
