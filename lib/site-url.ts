/**
 * Canonical origin for absolute URLs in agent discovery documents.
 *
 * Discovery documents (ARD, agent skills, OpenAPI, OAuth-style metadata) are
 * fetched out of band by agents, so every URL they contain must be absolute
 * and must match the origin the document was served from.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jlmx.dev"

/** Bare hostname, used for URN namespaces and DID identifiers. */
export function siteHost(siteUrl: string = SITE_URL): string {
  try {
    return new URL(siteUrl).host
  } catch {
    return "jlmx.dev"
  }
}
