import type { MetadataRoute } from "next"
import { getAllBlogSlugs } from "@/lib/data-service"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jlmx.dev"
  const blogSlugs = await getAllBlogSlugs()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/uses`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${siteUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticRoutes, ...blogRoutes]
}
