import { NextResponse } from "next/server"
import { AGENT_SKILLS, getSkillByFile } from "@/lib/agent-skills"
import { SITE_URL } from "@/lib/site-url"

/**
 * Serves the skill bodies listed in /.well-known/agent-skills/index.json.
 * Rendering from the same module the index hashes guarantees the published
 * digest always matches the bytes an agent downloads.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params
  const skill = getSkillByFile(file)

  if (!skill) {
    return new NextResponse("Not found", { status: 404 })
  }

  return new NextResponse(skill.render(SITE_URL), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  })
}

export function generateStaticParams() {
  return AGENT_SKILLS.map((skill) => ({ file: skill.file }))
}
