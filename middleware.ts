import { NextRequest, NextResponse } from "next/server"

const MARKDOWN_PATHS = ["/", "/blog", "/projects", "/uses"]
const BLOG_POST_RE = /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/i

/**
 * Parse Accept header and check if a media type is acceptable (q > 0).
 */
function isAcceptingMedia(acceptHeader: string, mediaType: string): boolean {
  if (!acceptHeader) return false

  const types = acceptHeader.split(",").map((t) => t.trim().toLowerCase())

  let mediaTypeQ: number | null = null
  let wildcardQ = 0.0

  for (const type of types) {
    const [media, ...params] = type.split(";").map((p) => p.trim())

    let q = 1.0
    for (const param of params) {
      if (param.startsWith("q=")) {
        const qValue = parseFloat(param.substring(2))
        if (!Number.isNaN(qValue)) {
          q = qValue
        }
      }
    }

    if (media === mediaType) {
      mediaTypeQ = q
    }

    if (media === "*/*") {
      wildcardQ = q
    } else if (media.includes("*")) {
      const [mainType] = mediaType.split("/")
      const [acceptMainType] = media.split("/")
      if (acceptMainType === mainType || media === `${mainType}/*`) {
        if (mediaTypeQ === null) {
          mediaTypeQ = q
        }
      }
    }
  }

  if (mediaTypeQ !== null) {
    return mediaTypeQ > 0
  }

  return wildcardQ > 0
}

function isMarkdownPath(pathname: string) {
  return MARKDOWN_PATHS.includes(pathname) || BLOG_POST_RE.test(pathname)
}

function getDiscoveryLinkHeader(siteUrl: string) {
  return [
    `<${siteUrl}/.well-known/api-catalog>; rel="api-catalog"`,
    `<${siteUrl}/sitemap.xml>; rel="sitemap"`,
    `<${siteUrl}/.well-known/agent-skills/index.json>; rel="https://agentskills.io/rel/skills-index"`,
    `<${siteUrl}/.well-known/mcp/server-card.json>; rel="https://modelcontextprotocol.io/rel/server-card"`,
  ].join(", ")
}

function getAgentMarkdown(pathname: string, siteUrl: string) {
  const apiUrl = `${siteUrl}/api/markdown?path=${encodeURIComponent(pathname)}`

  if (pathname === "/") {
    return `# Jordan Lamoreaux — Software Engineer

I'm a builder focused on enjoyable, accessible web experiences, internal tooling, and collaborative software development. Currently at Cloudflare.

## Agent Access

- Full markdown for this page: ${apiUrl}
- Projects markdown: ${siteUrl}/api/markdown?path=%2Fprojects
- Blog markdown: ${siteUrl}/api/markdown?path=%2Fblog
- Uses markdown: ${siteUrl}/api/markdown?path=%2Fuses
- Sitemap: ${siteUrl}/sitemap.xml
- API catalog: ${siteUrl}/.well-known/api-catalog
- MCP server card: ${siteUrl}/.well-known/mcp/server-card.json
- Agent skills index: ${siteUrl}/.well-known/agent-skills/index.json

## Featured Work

- Stratum: open source GitHub alternative for an agentic coding world.
- MyISO: photographer marketplace and social platform.
- AppTrack: job application tracking with AI career coaching.
- AI-rtic Phone: AI image telephone game.

## Contact

- Email: jordan@jlamoreaux.com
- GitHub: https://github.com/jlamoreaux
- LinkedIn: https://linkedin.com/jlamoreaux
`
  }

  return `# Jordan Lamoreaux — ${pathname}

Full markdown for this page is available at:

${apiUrl}

Additional agent discovery:

- Homepage: ${siteUrl}/
- Sitemap: ${siteUrl}/sitemap.xml
- API catalog: ${siteUrl}/.well-known/api-catalog
- MCP server card: ${siteUrl}/.well-known/mcp/server-card.json
- Agent skills index: ${siteUrl}/.well-known/agent-skills/index.json
`
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin
  const acceptsMarkdown = isAcceptingMedia(request.headers.get("accept") || "", "text/markdown")

  if (!acceptsMarkdown || !isMarkdownPath(pathname)) {
    const response = NextResponse.next()
    response.headers.set("Link", getDiscoveryLinkHeader(siteUrl))
    return response
  }

  const markdown = getAgentMarkdown(pathname, siteUrl)

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Location": `/api/markdown?path=${encodeURIComponent(pathname)}`,
      "Cache-Control": "private, no-store, max-age=0",
      "CDN-Cache-Control": "no-store",
      "Cloudflare-CDN-Cache-Control": "no-store",
      "Link": getDiscoveryLinkHeader(siteUrl),
      "Vary": "Accept",
    },
  })
}

export const config = {
  matcher: ["/", "/blog", "/blog/:path*", "/projects", "/uses"],
}
