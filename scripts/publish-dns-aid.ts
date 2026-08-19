/**
 * Publish DNS-AID (DNS for AI Discovery) SVCB records to Cloudflare DNS.
 *
 * DNS lives outside this repository, so deploying the site does not create
 * these records. Run this script once against the zone; it is idempotent and
 * safe to re-run after editing RECORDS.
 *
 *   pnpm dlx tsx scripts/publish-dns-aid.ts                # dry run, prints the plan
 *   pnpm dlx tsx scripts/publish-dns-aid.ts --zone-file    # emit BIND zone lines
 *   pnpm dlx tsx scripts/publish-dns-aid.ts --apply        # create/update in Cloudflare
 *
 * Environment:
 *   CLOUDFLARE_API_TOKEN  API token with Zone:DNS:Edit on the zone (required for --apply)
 *   CLOUDFLARE_ZONE_NAME  Zone to write to. Defaults to jlmx.dev.
 *   CLOUDFLARE_ZONE_ID    Optional; skips the zone lookup when set.
 *
 * Spec: draft-mozleywilliams-dnsop-dnsaid, RFC 9460 (SVCB).
 */

const ZONE_NAME = process.env.CLOUDFLARE_ZONE_NAME || "jlmx.dev"
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN
const API_BASE = "https://api.cloudflare.com/client/v4"
const TTL = 3600

type SvcbRecord = {
  /** Name relative to the zone apex. */
  name: string
  /** 0 = AliasMode, >=1 = ServiceMode. DNS-AID entry points use ServiceMode. */
  priority: number
  /** SVCB TargetName. "." means "the owner name's own service endpoint". */
  target: string
  /** SvcParams, in presentation format. */
  params: string
  comment: string
}

/**
 * Marker written into the Cloudflare record comment. apply() only ever updates
 * a record carrying this marker, so it cannot overwrite an SVCB record that
 * something else manages at the same owner name.
 */
const MANAGED_BY = "managed-by=publish-dns-aid"

/**
 * key65280 carries the capability descriptor locator (`cap=`).
 *
 * The DNS-AID draft defers numeric SvcParamKey assignment to IANA, so `cap`
 * has no registered codepoint. 65280-65534 is the RFC 9460 Private Use range;
 * anything below it (the draft's illustrative key65001 included) is Unassigned
 * and could be allocated to an unrelated parameter, which would make this
 * record mean something else entirely.
 *
 * It is deliberately absent from `mandatory`: cap is advisory here, and a
 * client that does not recognise the key should still use the record rather
 * than discard the whole RR.
 */
const RECORDS: SvcbRecord[] = [
  {
    name: `_index._agents.${ZONE_NAME}`,
    priority: 1,
    target: `${ZONE_NAME}.`,
    params: [
      'alpn="h2,http/1.1"',
      "port=443",
      "mandatory=alpn,port",
      `key65280="cap=https://${ZONE_NAME}/.well-known/ai-catalog.json"`,
    ].join(" "),
    comment:
      "DNS-AID well-known entry point. Resolves to the ARD capability catalog, which links every other discovery document.",
  },
]

/**
 * Templates for services this domain does not run yet. Uncommenting a record
 * before the service answers would advertise an endpoint that cannot be
 * reached, so they stay disabled until then.
 *
 *   _mcp._agents   — enable once a streamable HTTP MCP endpoint is live.
 *                    Today MCP is exposed in-page via WebMCP only.
 *   _a2a._agents   — enable once an A2A agent is served from this domain.
 */

function toZoneFileLines(records: SvcbRecord[]): string {
  return records
    .map(
      (record) =>
        `; ${record.comment}\n${record.name}. ${TTL} IN SVCB ${record.priority} ${record.target} ${record.params}`,
    )
    .join("\n\n")
}

type CfResponse<T> = {
  success: boolean
  errors: Array<{ code: number; message: string }>
  result: T
}

async function cf<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  })

  const body = (await response.json()) as CfResponse<T>
  if (!response.ok || !body.success) {
    const detail = body.errors?.map((e) => `${e.code} ${e.message}`).join("; ") || response.statusText
    throw new Error(`Cloudflare API ${init?.method || "GET"} ${path} failed: ${detail}`)
  }
  return body.result
}

async function resolveZoneId(): Promise<string> {
  if (process.env.CLOUDFLARE_ZONE_ID) return process.env.CLOUDFLARE_ZONE_ID

  const zones = await cf<Array<{ id: string; name: string }>>(
    `/zones?name=${encodeURIComponent(ZONE_NAME)}`,
  )
  const zone = zones.find((z) => z.name === ZONE_NAME)
  if (!zone) throw new Error(`Zone ${ZONE_NAME} not found for this API token`)
  return zone.id
}

async function apply(): Promise<void> {
  if (!API_TOKEN) {
    throw new Error("CLOUDFLARE_API_TOKEN is required for --apply")
  }

  const zoneId = await resolveZoneId()

  for (const record of RECORDS) {
    const payload = {
      type: "SVCB",
      name: record.name,
      ttl: TTL,
      comment: `${record.comment} [${MANAGED_BY}]`,
      data: { priority: record.priority, target: record.target, value: record.params },
    }

    // An SVCB RRset may legitimately hold several ServiceMode records at one
    // owner name (RFC 9460), so the first result is not necessarily ours.
    // Only a record we previously wrote carries the marker.
    const existing = await cf<Array<{ id: string; name: string; comment?: string | null }>>(
      `/zones/${zoneId}/dns_records?type=SVCB&name=${encodeURIComponent(record.name)}`,
    )
    const managed = existing.filter((r) => r.comment?.includes(MANAGED_BY))
    const unmanaged = existing.length - managed.length

    if (managed.length > 1) {
      throw new Error(
        `${record.name}: ${managed.length} records carry ${MANAGED_BY}. ` +
          `Refusing to guess which to update; remove the duplicates first.`,
      )
    }

    if (managed.length === 1) {
      await cf(`/zones/${zoneId}/dns_records/${managed[0].id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      })
      console.log(`updated  ${record.name}`)
    } else {
      await cf(`/zones/${zoneId}/dns_records`, {
        method: "POST",
        body: JSON.stringify(payload),
      })
      console.log(`created  ${record.name}`)
    }

    if (unmanaged > 0) {
      console.log(
        `         (left ${unmanaged} unmanaged SVCB record(s) at ${record.name} untouched)`,
      )
    }
  }

  console.log(
    `\nDone. Verify with:\n  dig +short _index._agents.${ZONE_NAME} SVCB\n` +
      `Then confirm DNSSEC is active on the zone so validating resolvers get authenticated answers.`,
  )
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)

  if (args.includes("--zone-file")) {
    console.log(toZoneFileLines(RECORDS))
    return
  }

  if (args.includes("--apply")) {
    await apply()
    return
  }

  console.log(`Dry run for zone ${ZONE_NAME}. Re-run with --apply to publish.\n`)
  console.log(toZoneFileLines(RECORDS))
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
