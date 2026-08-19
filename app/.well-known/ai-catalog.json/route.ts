import { NextResponse } from "next/server"
import { SITE_URL, siteHost } from "@/lib/site-url"

/**
 * ARD (Agentic Resource Discovery) capability manifest.
 *
 * Every entry describes a resource this site actually serves; the
 * representativeQueries exist so registries can build semantic embeddings
 * without fetching each resource first.
 */
export function GET() {
  const siteUrl = SITE_URL
  const host = siteHost(siteUrl)
  const urn = (namespace: string, name: string) => `urn:air:${host}:${namespace}:${name}`

  const catalog = {
    specVersion: "1.0",
    host: {
      displayName: "Jordan Lamoreaux — Software Engineer",
      identifier: `did:web:${host}`,
      description:
        "Personal portfolio and blog covering full-stack web development, developer tooling, and AI-assisted engineering.",
      url: siteUrl,
    },
    entries: [
      {
        identifier: urn("catalog", "agent-skills-index"),
        displayName: "Agent Skills Index",
        description:
          "Agent Skills Discovery v0.2.0 index listing every skill file this site publishes, each with a sha256 digest.",
        type: "application/json",
        url: `${siteUrl}/.well-known/agent-skills/index.json`,
        representativeQueries: [
          "what skills does this site publish for agents",
          "list the agent skill files for jlmx.dev",
          "where is the agent skills discovery index",
        ],
      },
      {
        identifier: urn("api", "openapi"),
        displayName: "Public API (OpenAPI 3.1)",
        description:
          "OpenAPI description of the public, unauthenticated HTTP API: health status and Markdown content retrieval.",
        type: "application/openapi+json",
        url: `${siteUrl}/openapi.json`,
        representativeQueries: [
          "what HTTP endpoints does jlmx.dev expose",
          "openapi schema for this portfolio api",
          "how do I call the markdown endpoint programmatically",
        ],
      },
      {
        identifier: urn("server", "mcp"),
        displayName: "MCP Server Card",
        description:
          "Model Context Protocol server card describing the resources this site exposes to MCP clients.",
        type: "application/mcp-server-card+json",
        url: `${siteUrl}/.well-known/mcp/server-card.json`,
        representativeQueries: [
          "does jlmx.dev have an mcp server",
          "mcp resources for this portfolio",
          "model context protocol endpoint for jlmx.dev",
        ],
      },
      {
        identifier: urn("content", "portfolio-home"),
        displayName: "Portfolio Homepage (Markdown)",
        description:
          "Bio, featured work, and recent writing, served as clean Markdown for LLM consumption.",
        type: "text/markdown",
        url: `${siteUrl}/api/markdown?path=%2F`,
        representativeQueries: [
          "who is Jordan Lamoreaux",
          "what does this software engineer work on",
          "summarize this developer's background",
        ],
      },
      {
        identifier: urn("content", "projects"),
        displayName: "Projects (Markdown)",
        description:
          "Full project portfolio with descriptions, tech stacks, and links, served as Markdown.",
        type: "text/markdown",
        url: `${siteUrl}/api/markdown?path=%2Fprojects`,
        representativeQueries: [
          "what projects has Jordan Lamoreaux built",
          "show me this engineer's side projects",
          "what tech stack does this developer use",
        ],
      },
      {
        identifier: urn("content", "blog"),
        displayName: "Blog Index (Markdown)",
        description:
          "All published blog posts with excerpts and publication dates, served as Markdown.",
        type: "text/markdown",
        url: `${siteUrl}/api/markdown?path=%2Fblog`,
        representativeQueries: [
          "what has this developer written about",
          "latest blog posts from jlmx.dev",
          "articles about web development and AI tooling",
        ],
      },
      {
        identifier: urn("content", "uses"),
        displayName: "Uses / Toolchain (Markdown)",
        description: "Hardware, editor, and daily-driver tooling this developer uses.",
        type: "text/markdown",
        url: `${siteUrl}/api/markdown?path=%2Fuses`,
        representativeQueries: [
          "what editor and tools does this developer use",
          "jlmx.dev uses page",
          "what is this engineer's hardware setup",
        ],
      },
      {
        identifier: urn("api", "health"),
        displayName: "Health Check",
        description:
          "Operational status of the site and its CMS. Always returns HTTP 200; read the status field.",
        type: "application/json",
        url: `${siteUrl}/api/health`,
        representativeQueries: [
          "is jlmx.dev up",
          "check the health of this site",
          "is the cms behind this portfolio available",
        ],
      },
      {
        identifier: urn("doc", "auth"),
        displayName: "Agent Authentication Policy",
        description:
          "auth.md describing how agents authenticate against this site: no registration and no credentials are required.",
        type: "text/markdown",
        url: `${siteUrl}/auth.md`,
        representativeQueries: [
          "do I need an api key for jlmx.dev",
          "how do agents authenticate with this site",
          "is registration required to use this api",
        ],
      },
      {
        identifier: urn("catalog", "api-catalog"),
        displayName: "RFC 9727 API Catalog",
        description: "Linkset pointing at this site's service documentation, status, and sitemap.",
        type: "application/linkset+json",
        url: `${siteUrl}/.well-known/api-catalog`,
        representativeQueries: [
          "api catalog for jlmx.dev",
          "linkset of services on this domain",
        ],
      },
    ],
  }

  return NextResponse.json(catalog, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
