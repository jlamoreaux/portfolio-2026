import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jlmx.dev"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
