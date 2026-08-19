# DNS-AID: DNS-based agent discovery

[DNS for AI Discovery](https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/)
lets an agent bootstrap from a domain name alone — one DNS query instead of an
HTTP fetch of `/.well-known/...`. Entry points live under the `_agents`
underscore label and are published as [RFC 9460](https://www.rfc-editor.org/rfc/rfc9460)
`SVCB` records.

**These records are not created by deploying this repository.** They live in the
Cloudflare DNS zone for `jlmx.dev` and have to be published once, out of band.

## Records to publish

Generated from `scripts/publish-dns-aid.ts`, which is the source of truth:

```dns
; DNS-AID well-known entry point. Resolves to the ARD capability catalog,
; which links every other discovery document.
_index._agents.jlmx.dev. 3600 IN SVCB 1 jlmx.dev. alpn="h2,http/1.1" port=443 mandatory=alpn,port key65001="cap=https://jlmx.dev/.well-known/ai-catalog.json"
```

Reading the record:

| Field | Value | Meaning |
|-------|-------|---------|
| Owner | `_index._agents.jlmx.dev.` | The `_index` service label under the `_agents` namespace — the well-known entry point scanners look for. |
| Priority | `1` | ServiceMode (`0` would be AliasMode). |
| TargetName | `jlmx.dev.` | The host that answers. |
| `alpn` | `h2,http/1.1` | Application protocols the endpoint speaks. |
| `port` | `443` | Service port. |
| `mandatory` | `alpn,port` | A client that cannot honour these params must not use the record. |
| `key65001` | `cap=…ai-catalog.json` | Capability descriptor locator. The draft's `cap` SvcParamKey is still provisional, so it is written in the numeric `keyNNNNN` form until IANA registers a mnemonic. |

### Records deliberately not published

`_mcp._agents` and `_a2a._agents` are left out until the matching services
exist. This domain currently exposes MCP tools in-page via WebMCP rather than
over a streamable HTTP endpoint, and runs no A2A agent; advertising either
would point agents at something that does not answer. Templates are in
`scripts/publish-dns-aid.ts`.

## Publishing

```bash
# 1. Preview (default). Prints the zone lines, changes nothing.
pnpm dns-aid

# 2. Publish to Cloudflare. Idempotent — re-run after editing RECORDS.
export CLOUDFLARE_API_TOKEN=…   # token with Zone:DNS:Edit on jlmx.dev
pnpm dns-aid:apply
```

Optional environment: `CLOUDFLARE_ZONE_NAME` (defaults to `jlmx.dev`) and
`CLOUDFLARE_ZONE_ID` (skips the zone lookup).

If you would rather click through the dashboard: Cloudflare → **DNS** →
**Add record** → type **SVCB**, name `_index._agents`, priority `1`, target
`jlmx.dev`, value `alpn="h2,http/1.1" port=443 mandatory=alpn,port key65001="cap=https://jlmx.dev/.well-known/ai-catalog.json"`.

## DNSSEC

DNS-AID answers should be authenticated, so the zone must be signed. On
Cloudflare: **DNS** → **Settings** → **DNSSEC** → **Enable DNSSEC**, then add
the DS record Cloudflare shows to the registrar for `jlmx.dev`. Signing is not
complete until the registrar publishes that DS record — until then validating
resolvers return unsigned (`ad`-less) answers.

## Verifying

```bash
# Record is present
dig +short _index._agents.jlmx.dev SVCB

# Answer is DNSSEC-authenticated: look for the "ad" flag
dig +dnssec _index._agents.jlmx.dev SVCB | grep -E 'flags:|SVCB'

# Zone is signed end to end
dig +short jlmx.dev DS @1.1.1.1
```

Scanners typically resolve over DoH; `https://cloudflare-dns.com/dns-query?name=_index._agents.jlmx.dev&type=SVCB`
with `Accept: application/dns-json` shows what they see.
