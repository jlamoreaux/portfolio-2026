import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

async function sha256hex(content: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(content)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jlmx.dev"

  // Read the actual published markdown files to ensure hash integrity
  const publicDir = join(process.cwd(), "public", ".well-known", "agent-skills")
  const [portfolioContent, healthContent] = await Promise.all([
    readFile(join(publicDir, "portfolio.md"), "utf-8"),
    readFile(join(publicDir, "health.md"), "utf-8"),
  ])

  const [portfolioHash, healthHash] = await Promise.all([
    sha256hex(portfolioContent),
    sha256hex(healthContent),
  ])

  const index = {
    $schema: "https://agentskills.io/schema/v0.2.0/index.json",
    skills: [
      {
        name: "get-portfolio-markdown",
        type: "skill-file",
        description:
          "Fetch any page of this portfolio as clean Markdown via Accept: text/markdown content negotiation.",
        url: `${siteUrl}/.well-known/agent-skills/portfolio.md`,
        sha256: portfolioHash,
      },
      {
        name: "health-check",
        type: "skill-file",
        description: "Check site and CMS operational status via GET /api/health.",
        url: `${siteUrl}/.well-known/agent-skills/health.md`,
        sha256: healthHash,
      },
    ],
  }

  return NextResponse.json(index, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
