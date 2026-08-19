import { NextResponse } from "next/server"
import { SITE_URL, siteHost } from "@/lib/site-url"

/**
 * OpenAPI 3.1 description of the public HTTP surface.
 *
 * Everything here is unauthenticated and free, so there are no security
 * schemes and no payment annotations on any operation.
 */
export function GET() {
  const siteUrl = SITE_URL
  const host = siteHost(siteUrl)

  const doc = {
    openapi: "3.1.0",
    info: {
      title: `${host} public API`,
      version: "1.0.0",
      summary: "Read this portfolio's content and status as structured data.",
      description:
        "Public, unauthenticated endpoints for agents. No registration, credentials, or payment are required; see /auth.md.",
      contact: { name: "Jordan Lamoreaux", email: "jordan@jlamoreaux.com", url: siteUrl },
      license: { name: "All rights reserved", identifier: "LicenseRef-Proprietary" },
    },
    servers: [{ url: siteUrl, description: "Production" }],
    tags: [
      { name: "content", description: "Portfolio content as Markdown" },
      { name: "status", description: "Operational status" },
      { name: "discovery", description: "Machine-readable discovery documents" },
    ],
    paths: {
      "/api/health": {
        get: {
          tags: ["status"],
          operationId: "getHealth",
          summary: "Site and CMS operational status",
          description:
            "Always responds 200 so a CMS outage does not make the site look down. Read the `status` field rather than the HTTP status code.",
          responses: {
            "200": {
              description: "Current status.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Health" },
                  examples: {
                    healthy: {
                      value: {
                        status: "healthy",
                        message: "All systems operational",
                        sanity: true,
                        timestamp: "2026-08-19T00:00:00.000Z",
                      },
                    },
                    degraded: {
                      value: {
                        status: "degraded",
                        message: "Sanity CMS unavailable - using cached content",
                        sanity: false,
                        timestamp: "2026-08-19T00:00:00.000Z",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/markdown": {
        get: {
          tags: ["content"],
          operationId: "getMarkdown",
          summary: "Fetch a page as clean Markdown",
          description:
            "Returns the rendered Markdown for a site page. The same content is available from the page URL itself by sending `Accept: text/markdown`.",
          parameters: [
            {
              name: "path",
              in: "query",
              required: false,
              description: "Site path to render. Defaults to `/`.",
              schema: {
                type: "string",
                default: "/",
                pattern: "^(/|/blog|/projects|/uses|/blog/[a-z0-9]+(-[a-z0-9]+)*)$",
                examples: ["/", "/blog", "/projects", "/uses", "/blog/my-post-slug"],
              },
            },
          ],
          responses: {
            "200": {
              description: "Markdown rendering of the requested page.",
              content: { "text/markdown": { schema: { type: "string" } } },
            },
            "404": {
              description: "Unknown path, or no blog post with that slug.",
              content: { "text/plain": { schema: { type: "string" } } },
            },
            "500": {
              description: "Content could not be loaded.",
              content: { "text/markdown": { schema: { type: "string" } } },
            },
          },
        },
      },
      "/auth.md": {
        get: {
          tags: ["discovery"],
          operationId: "getAuthPolicy",
          summary: "Agent authentication policy (auth.md)",
          responses: {
            "200": {
              description: "Authentication and usage policy for agents.",
              content: { "text/markdown": { schema: { type: "string" } } },
            },
          },
        },
      },
      "/.well-known/ai-catalog.json": {
        get: {
          tags: ["discovery"],
          operationId: "getArdCatalog",
          summary: "ARD capability manifest",
          responses: {
            "200": {
              description: "Agentic Resource Discovery manifest.",
              content: { "application/json": { schema: { type: "object" } } },
            },
          },
        },
      },
      "/.well-known/agent-skills/index.json": {
        get: {
          tags: ["discovery"],
          operationId: "getAgentSkillsIndex",
          summary: "Agent Skills Discovery index",
          responses: {
            "200": {
              description: "Skill index with a sha256 digest per skill file.",
              content: { "application/json": { schema: { type: "object" } } },
            },
          },
        },
      },
      "/.well-known/mcp/server-card.json": {
        get: {
          tags: ["discovery"],
          operationId: "getMcpServerCard",
          summary: "MCP server card",
          responses: {
            "200": {
              description: "Model Context Protocol server card.",
              content: { "application/json": { schema: { type: "object" } } },
            },
          },
        },
      },
      "/.well-known/api-catalog": {
        get: {
          tags: ["discovery"],
          operationId: "getApiCatalog",
          summary: "RFC 9727 API catalog linkset",
          responses: {
            "200": {
              description: "Linkset of service documentation, status, and sitemap.",
              content: { "application/linkset+json": { schema: { type: "object" } } },
            },
          },
        },
      },
      "/llms.txt": {
        get: {
          tags: ["discovery"],
          operationId: "getLlmsTxt",
          summary: "LLM-oriented site summary",
          responses: {
            "200": {
              description: "Plain-text site summary for language models.",
              content: { "text/plain": { schema: { type: "string" } } },
            },
          },
        },
      },
    },
    components: {
      securitySchemes: {},
      schemas: {
        Health: {
          type: "object",
          required: ["status", "message", "sanity", "timestamp"],
          properties: {
            status: {
              type: "string",
              enum: ["healthy", "degraded", "warning"],
              description:
                "`healthy`: site and CMS operational. `degraded`: CMS unavailable, cached content served. `warning`: CMS not configured.",
            },
            message: { type: "string" },
            sanity: { type: "boolean", description: "Whether the CMS responded." },
            timestamp: { type: "string", format: "date-time" },
            error: { type: "string", description: "Present only when status is `degraded`." },
          },
        },
      },
    },
    security: [],
  }

  return NextResponse.json(doc, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
