# Agent discovery on jlmx.dev

What this site publishes for autonomous agents, and what it deliberately does not.

## Published

| Document | Path | Spec |
|----------|------|------|
| ARD capability catalog | `/.well-known/ai-catalog.json` | [Agentic Resource Discovery](https://agenticresourcediscovery.org/) |
| Agent Skills index | `/.well-known/agent-skills/index.json` | [Agent Skills Discovery RFC v0.2.0](https://github.com/cloudflare/agent-skills-discovery-rfc) |
| Agent skill files | `/.well-known/agent-skills/{portfolio,health,discovery}.md` | as above |
| OpenAPI description | `/openapi.json` | [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) |
| Agent auth policy | `/auth.md` | [auth.md](https://github.com/workos/auth.md) |
| API catalog linkset | `/.well-known/api-catalog` | [RFC 9727](https://www.rfc-editor.org/rfc/rfc9727) |
| MCP server card | `/.well-known/mcp/server-card.json` | Model Context Protocol |
| LLM site summary | `/llms.txt` | [llmstxt.org](https://llmstxt.org) |
| DNS entry point | `_index._agents.jlmx.dev` `SVCB` | [DNS-AID](https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/), [RFC 9460](https://www.rfc-editor.org/rfc/rfc9460) — see [dns-aid.md](./dns-aid.md) |

Every HTML response also carries an RFC 8288 `Link` header pointing at these,
so a single `HEAD` request bootstraps discovery. The header is built in
`lib/discovery-links.ts` (mirrored literally in `next.config.mjs`, which cannot
import TypeScript).

### Keeping skill digests honest

`lib/agent-skills.ts` is the single source of truth for skill bodies. The index
route hashes exactly the string the `[file]` route serves, so a published
`sha256:` digest cannot drift from the downloadable file. Skill markdown is no
longer stored in `public/` — reading it back with `fs` at request time was what
made the index return 500 on Cloudflare Workers, which have no filesystem.

## Deliberately not published

These scanner checks fail by design. Each would require advertising a service
this domain does not run; an agent that believed the advertisement would enter
a flow that cannot complete.

| Not published | Why |
|---------------|-----|
| `/.well-known/openid-configuration` | No OpenID Provider. An `issuer` and `authorization_endpoint` would have nothing behind them. |
| `/.well-known/oauth-authorization-server` | No OAuth authorization server, so no real `token_endpoint` or `jwks_uri` to advertise. |
| `/.well-known/oauth-protected-resource` | Nothing on this origin is protected; there is no resource to describe and no `authorization_servers` to list. |
| x402 payment middleware | No wallet, no facilitator, nothing sold. Returning HTTP 402 would ask agents to pay for content that is free. |
| MPP `x-payment-info` extensions | `/openapi.json` is published, but no operation is payable, so no operation carries payment metadata. |
| `/.well-known/ucp` | No commerce services, capabilities, or endpoints exist to declare. |
| `/.well-known/acp.json` | No agentic-commerce API; `api_base_url` would point at routes that do not exist. |

`/auth.md` states all of this in machine-readable prose: no credentials, no
registration, nothing for sale, and any 402 from this origin is illegitimate.
That is the honest answer to "how do I authenticate and pay here?".

If protected APIs or paid endpoints are added later, publish the matching
metadata at that point and update `/auth.md` and the ARD catalog together.

## Known gap

`/.well-known/mcp/server-card.json` advertises `transport.endpoint`
`https://jlmx.dev/api/mcp`, but no such route exists — MCP tools are currently
exposed in-page through WebMCP (`components/webmcp-provider.tsx`). Either
implement a streamable HTTP MCP endpoint or correct the card. The DNS-AID
`_mcp._agents` record is held back for the same reason.
