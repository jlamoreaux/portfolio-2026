/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['cdn.sanity.io'],
    unoptimized: true,
  },
  experimental: {
    taint: true,
  },
  async headers() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jlmx.dev"
    return [
      {
        // RFC 8288 Link headers on all HTML pages for agent discovery
        source: "/:path*",
        headers: [
          {
            key: "Link",
            // Keep in sync with lib/discovery-links.ts; next.config cannot import TS.
            value: [
              `<${siteUrl}/.well-known/ai-catalog.json>; rel="https://agenticresourcediscovery.org/rel/catalog"`,
              `<${siteUrl}/.well-known/api-catalog>; rel="api-catalog"`,
              `<${siteUrl}/openapi.json>; rel="service-desc"; type="application/openapi+json"`,
              `<${siteUrl}/auth.md>; rel="https://workos.com/rel/auth-md"; type="text/markdown"`,
              `<${siteUrl}/sitemap.xml>; rel="sitemap"`,
              `<${siteUrl}/.well-known/agent-skills/index.json>; rel="https://agentskills.io/rel/skills-index"`,
              `<${siteUrl}/.well-known/mcp/server-card.json>; rel="https://modelcontextprotocol.io/rel/server-card"`,
            ].join(", "),
          },
        ],
      },
    ]
  },
}

export default nextConfig
