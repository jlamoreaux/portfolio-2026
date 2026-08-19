import { NextResponse } from "next/server"
import { AGENT_SKILLS, skillDigest, skillUrl } from "@/lib/agent-skills"
import { SITE_URL } from "@/lib/site-url"

/**
 * Agent Skills Discovery index (RFC v0.2.0).
 *
 * Skill bodies come from lib/agent-skills.ts rather than the filesystem: the
 * Cloudflare Workers runtime has no fs, so reading public/ at request time
 * threw and this endpoint returned 500. Hashing the same string the sibling
 * route serves also keeps each digest correct by construction.
 */
export async function GET() {
  const siteUrl = SITE_URL

  const skills = await Promise.all(
    AGENT_SKILLS.map(async (skill) => ({
      name: skill.name,
      type: "skill-md" as const,
      description: skill.description,
      url: skillUrl(skill, siteUrl),
      digest: await skillDigest(skill.render(siteUrl)),
    })),
  )

  return NextResponse.json(
    {
      $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
      skills,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    },
  )
}
