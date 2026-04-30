"use client"

import { useEffect } from "react"

declare global {
  interface Navigator {
    modelContext?: {
      provideContext: (options: {
        tools: Array<{
          name: string
          description: string
          inputSchema: Record<string, unknown>
          execute: (input: Record<string, unknown>) => Promise<unknown>
        }>
      }) => void
    }
  }
}

export function WebMCPProvider() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.modelContext) return

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jlmx.dev"

    try {
      navigator.modelContext.provideContext({
        tools: [
          {
            name: "get_portfolio_page",
            description:
              "Fetch any page of this portfolio as Markdown. Supported paths: /, /blog, /blog/{slug}, /projects, /uses.",
            inputSchema: {
              type: "object",
              properties: {
                path: {
                  type: "string",
                  description: "Page path to fetch (e.g. '/', '/blog', '/projects')",
                  default: "/",
                },
              },
            },
            execute: async ({ path = "/" }: Record<string, unknown>) => {
              const response = await fetch(
                `${siteUrl}/api/markdown?path=${encodeURIComponent(String(path))}`,
              )
              if (!response.ok) throw new Error(`HTTP ${response.status}`)
              return response.text()
            },
          },
          {
            name: "check_site_health",
            description: "Check the operational status of jlmx.dev and its CMS connection.",
            inputSchema: {
              type: "object",
              properties: {},
            },
            execute: async () => {
              const response = await fetch(`${siteUrl}/api/health`)
              if (!response.ok) throw new Error(`HTTP ${response.status}`)
              return response.json()
            },
          },
        ],
      })
    } catch {
      // WebMCP is experimental; silently ignore if unsupported
    }
  }, [])

  return null
}
