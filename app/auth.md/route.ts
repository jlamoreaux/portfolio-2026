import { NextResponse } from "next/server"
import { SITE_URL, siteHost } from "@/lib/site-url"

/**
 * auth.md — agent authentication and registration policy.
 *
 * This site runs no authorization server and exposes no protected resources,
 * so it uses the self-contained form of auth.md rather than pointing at OAuth
 * metadata. Advertising an issuer or a registration endpoint that does not
 * exist would send agents into a flow that cannot complete.
 */
export function GET() {
  const siteUrl = SITE_URL
  const host = siteHost(siteUrl)

  const body = `# auth.md

Agent authentication policy for **${host}**, last reviewed 2026-08-19.

## Summary

**No authentication is required.** ${host} exposes no protected resources. Every
endpoint listed in the ARD catalog at ${siteUrl}/.well-known/ai-catalog.json is
public, unauthenticated, and free to call. There is nothing to register for and
no credential to obtain.

## Intended audience

Autonomous agents, crawlers, and LLM tools that want to read this site's
content or check its status — for example to answer questions about this
developer's work, to index the blog, or to fetch a page as Markdown.

## Registration and provisioning

None. There is no registration endpoint, no client provisioning flow, and no
API key issuance. Because there is no authorization server:

- \`/.well-known/oauth-authorization-server\` is intentionally **not** published.
- \`/.well-known/openid-configuration\` is intentionally **not** published.
- \`/.well-known/oauth-protected-resource\` is intentionally **not** published.

If protected endpoints are added later, this file will name the issuer and
resource metadata documents, and those \`.well-known\` documents will appear.

## Supported authentication methods

| Method | Status |
|--------|--------|
| Anonymous (no credential) | Supported — this is the only method |
| OAuth 2.0 / OIDC bearer tokens | Not applicable; no protected resources |
| API keys | Not issued |
| mTLS | Not supported |

Do not send \`Authorization\` headers. They are ignored, never logged, and
confer no additional access.

## Credential usage

Not applicable. Send requests unauthenticated:

\`\`\`http
GET /api/health HTTP/1.1
Host: ${host}
Accept: application/json
\`\`\`

## Identification

Identify yourself with a descriptive \`User-Agent\` containing a contact URL or
address. This is a courtesy, not an access requirement, and no request is
rejected for omitting it.

\`\`\`
User-Agent: YourAgent/1.0 (+https://example.com/bot)
\`\`\`

## Usage expectations

- Prefer the Markdown representations over scraping HTML: send
  \`Accept: text/markdown\`, or call ${siteUrl}/api/markdown?path=/blog.
- Honour \`Cache-Control\` and \`ETag\`; content changes at most a few times a week.
- Keep to a courteous request rate (roughly 1 request/second sustained). There
  is no published quota, but abusive traffic may be rate limited at the edge,
  which surfaces as HTTP 429.
- ${siteUrl}/robots.txt applies to crawling; \`/studio/\` is disallowed.

## Payments

This site sells nothing and accepts no payments. No x402, MPP, UCP, or ACP
endpoints are published, and any HTTP 402 response from this origin is not
legitimate.

## Contact

Questions, or need an authenticated integration? Email jordan@jlamoreaux.com or
open an issue at https://github.com/jlamoreaux.
`

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
