import { NextResponse } from "next/server"

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jlmx.dev"

  const catalog = {
    linkset: [
      {
        anchor: siteUrl,
        "service-doc": [{ href: `${siteUrl}/api/health`, type: "application/json" }],
        status: [{ href: `${siteUrl}/api/health`, type: "application/json" }],
        sitemap: [{ href: `${siteUrl}/sitemap.xml`, type: "application/xml" }],
      },
    ],
  }

  return NextResponse.json(catalog, {
    headers: {
      "Content-Type": "application/linkset+json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
