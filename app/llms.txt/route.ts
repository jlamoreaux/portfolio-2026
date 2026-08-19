import { NextResponse } from "next/server"
import { getPortfolioData } from "@/lib/data-service"
import { transformSiteSettings } from "@/lib/config"

/** Collapse whitespace so a description stays on a single markdown list line. */
function oneLine(text: string | undefined): string {
  return (text || "").replace(/\s+/g, " ").trim()
}

function slugOf(slug: string | { current: string }): string {
  return typeof slug === "string" ? slug : slug.current
}

/** Backslash-escape characters that would break markdown link syntax. */
function escapeMarkdownText(text: string): string {
  return text.replace(/[\\[\]()]/g, "\\$&")
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jlmx.dev"
  const markdownUrl = (path: string) => `${siteUrl}/api/markdown?path=${encodeURIComponent(path)}`

  try {
    const { projects, blogPosts, siteSettings } = await getPortfolioData()
    const config = transformSiteSettings(siteSettings)
    const { name, title, company } = config.personal

    const summary = oneLine(`${title}${company ? ` at ${company}` : ""}. ${config.hero.description}`)

    const projectList = projects
      .map((p) => {
        const url = p.liveUrl || p.githubUrl || `${siteUrl}/projects`
        return `- [${escapeMarkdownText(p.title)}](${url}): ${escapeMarkdownText(oneLine(p.description))}`
      })
      .join("\n")

    const blogList = blogPosts
      .map(
        (post) =>
          `- [${escapeMarkdownText(post.title)}](${markdownUrl(`/blog/${slugOf(post.slug)}`)}): ${escapeMarkdownText(oneLine(post.excerpt))}`,
      )
      .join("\n")

    const body = `# ${name}

> ${summary}

This file helps AI agents and LLMs navigate ${siteUrl}. Each link below returns clean markdown or structured data.

## Pages

- [Home](${markdownUrl("/")}): Overview, featured work, and recent writing
- [Projects](${markdownUrl("/projects")}): Full project list with technologies and links
- [Blog](${markdownUrl("/blog")}): All blog posts
- [Uses](${markdownUrl("/uses")}): Tools, gear, and software

## Projects

${projectList}

## Blog posts

${blogList}

## Discovery

- [Sitemap](${siteUrl}/sitemap.xml): All indexable URLs
- [Capability catalog](${siteUrl}/.well-known/ai-catalog.json): ARD manifest of every resource on this domain
- [OpenAPI](${siteUrl}/openapi.json): Machine-readable description of the public API
- [API catalog](${siteUrl}/.well-known/api-catalog): RFC 9727 service catalog
- [MCP server card](${siteUrl}/.well-known/mcp/server-card.json): Model Context Protocol server card
- [Agent skills index](${siteUrl}/.well-known/agent-skills/index.json): Available agent skills
- [auth.md](${siteUrl}/auth.md): Agent authentication policy. No registration or credentials are required.
`

    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("Failed to generate llms.txt:", error)
    return new NextResponse("# Error\n\nFailed to generate llms.txt.\n", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }
}
