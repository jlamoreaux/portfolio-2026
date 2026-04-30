import { NextRequest, NextResponse } from "next/server"
import { getPortfolioData, getBlogPostBySlug } from "@/lib/data-service"
import { transformSiteSettings } from "@/lib/config"

const BLOG_SLUG_RE = /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/

function isValidPath(path: string): boolean {
  const exact = ["/", "/blog", "/projects", "/uses"]
  return exact.includes(path) || BLOG_SLUG_RE.test(path)
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const rawPath = searchParams.get("path") || "/"

  if (!isValidPath(rawPath)) {
    return new NextResponse("Not found", { status: 404 })
  }

  const path = rawPath
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jlmx.dev"

  try {
    const { projects, blogPosts, siteSettings } = await getPortfolioData()
    const config = transformSiteSettings(siteSettings)
    let markdown = ""

    if (path === "/" || path === "") {
      markdown = `# ${config.personal.name} — ${config.personal.title}

${config.hero.description}

**Location:** ${config.personal.location || "Remote"}
**Email:** ${config.personal.email || ""}

## Projects

${projects
  .slice(0, 6)
  .map((p) => {
    const slug = typeof p.slug === "string" ? p.slug : p.slug.current
    return `### [${p.title}](${siteUrl}/projects#${slug})

${p.description}

**Technologies:** ${Array.isArray(p.technologies) ? p.technologies.join(", ") : ""}${p.liveUrl ? `  \n**Live:** ${p.liveUrl}` : ""}${p.githubUrl ? `  \n**GitHub:** ${p.githubUrl}` : ""}`
  })
  .join("\n\n")}

## Recent Blog Posts

${blogPosts
  .slice(0, 5)
  .map((post) => {
    const slug = typeof post.slug === "string" ? post.slug : post.slug.current
    return `### [${post.title}](${siteUrl}/blog/${slug})

${post.excerpt || ""}

*${new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · ${post.readingTime} min read*`
  })
  .join("\n\n")}

---

[View all projects](${siteUrl}/projects) · [Read the blog](${siteUrl}/blog) · [Uses](${siteUrl}/uses)
`
    } else if (path === "/blog") {
      markdown = `# Blog — ${config.personal.name}

${blogPosts
  .map((post) => {
    const slug = typeof post.slug === "string" ? post.slug : post.slug.current
    return `## [${post.title}](${siteUrl}/blog/${slug})

${post.excerpt || ""}

*${new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · ${post.readingTime} min read*`
  })
  .join("\n\n")}
`
    } else if (path === "/projects") {
      markdown = `# Projects — ${config.personal.name}

${projects
  .map((p) => {
    const slug = typeof p.slug === "string" ? p.slug : p.slug.current
    return `## ${p.title}

${p.longDescription || p.description}

**Technologies:** ${Array.isArray(p.technologies) ? p.technologies.join(", ") : ""}${p.liveUrl ? `  \n**Live:** ${p.liveUrl}` : ""}${p.githubUrl ? `  \n**GitHub:** ${p.githubUrl}` : ""}`
  })
  .join("\n\n")}
`
    } else if (path.startsWith("/blog/")) {
      const slug = path.replace("/blog/", "")
      const post = await getBlogPostBySlug(slug)

      if (!post) {
        return new NextResponse("Not found", { status: 404 })
      }

      markdown = `# ${post.title}

*${new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · ${post.readingTime} min read*

${post.excerpt || ""}

---

*Full content available at [${siteUrl}/blog/${slug}](${siteUrl}/blog/${slug})*
`
    } else {
      markdown = `# ${config.personal.name} — Portfolio

Visit [${siteUrl}](${siteUrl}) to view the full portfolio.
`
    }

    return new NextResponse(markdown, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "Vary": "Accept",
      },
    })
  } catch {
    return new NextResponse("# Error\n\nFailed to load content.", {
      status: 500,
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    })
  }
}
