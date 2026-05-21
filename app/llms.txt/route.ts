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
        return `- [${p.title}](${url}): ${oneLine(p.description)}`
      })
      .join("\n")

    const blogList = blogPosts
      .map((post) => `- [${post.title}](${markdownUrl(`/blog/${slugOf(post.slug)}`)}): ${oneLine(post.excerpt)}`)
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
- [API catalog](${siteUrl}/.well-known/api-catalog): RFC 9727 service catalog
- [MCP server card](${siteUrl}/.well-known/mcp/server-card.json): Model Context Protocol server card
- [Agent skills index](${siteUrl}/.well-known/agent-skills/index.json): Available agent skills
`

    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    })
  } catch {
    return new NextResponse("# Error\n\nFailed to generate llms.txt.\n", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }
}
