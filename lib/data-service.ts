import { client } from "./sanity"
import { fallbackProjects, fallbackBlogPosts, fallbackUsesItems, fallbackCategories, fallbackSiteSettings, fallbackSocialLinks } from "./fallback-data"
import type { Project, BlogPost, UsesItem, Category, SiteSettings, SanitySocialLink } from "./types"

// Sanitize error messages to prevent token/secret leakage
function sanitizeError(error: unknown): string {
  if (!(error instanceof Error)) return 'Unknown error'

  let message = error.message
  // Remove anything that looks like a token (long alphanumeric strings)
  message = message.replace(/[a-zA-Z0-9]{40,}/g, '[REDACTED]')
  // Remove URLs with tokens in query params
  message = message.replace(/token=[^&\s]+/gi, 'token=[REDACTED]')
  // Remove Bearer tokens
  message = message.replace(/Bearer\s+[a-zA-Z0-9._-]+/gi, 'Bearer [REDACTED]')

  return message
}

interface PortfolioData {
  projects: Project[]
  blogPosts: BlogPost[]
  usesItems: UsesItem[]
  categories: Category[]
  siteSettings: SiteSettings | null
  socialLinks: SanitySocialLink[]
  isUsingFallback: boolean
  errors: string[]
}

export async function getPortfolioData(): Promise<PortfolioData> {
  const errors: string[] = []
  let isUsingFallback = false

  try {
    // Try to fetch data from Sanity
    const [projects, blogPosts, usesItems, categories, siteSettings, socialLinks] = await Promise.all([
      getProjectsFromSanity(),
      getBlogPostsFromSanity(),
      getUsesItemsFromSanity(),
      getCategoriesFromSanity(),
      getSiteSettingsFromSanity(),
      getSocialLinksFromSanity(),
    ])

    // Check if we got any data from Sanity
    if (projects.length === 0 && blogPosts.length === 0 && usesItems.length === 0 && categories.length === 0) {
      console.log("No content found in Sanity, using fallback data")
      isUsingFallback = true
      errors.push("No content found in Sanity CMS - using demo data")

      return {
        projects: fallbackProjects,
        blogPosts: fallbackBlogPosts,
        usesItems: fallbackUsesItems,
        categories: fallbackCategories,
        siteSettings: fallbackSiteSettings,
        socialLinks: fallbackSocialLinks,
        isUsingFallback: true,
        errors,
      }
    }

    console.log(`Loaded from Sanity: ${projects.length} projects, ${blogPosts.length} posts, ${usesItems.length} uses items, ${categories.length} categories`)

    return {
      projects,
      blogPosts,
      usesItems,
      categories,
      siteSettings: siteSettings || fallbackSiteSettings,
      socialLinks: socialLinks.length > 0 ? socialLinks : fallbackSocialLinks,
      isUsingFallback: false,
      errors: [],
    }
  } catch (error) {
    console.error("Failed to fetch from Sanity:", sanitizeError(error))
    isUsingFallback = true
    errors.push(`Sanity CMS connection failed: ${sanitizeError(error)}`)

    return {
      projects: fallbackProjects,
      blogPosts: fallbackBlogPosts,
      usesItems: fallbackUsesItems,
      categories: fallbackCategories,
      siteSettings: fallbackSiteSettings,
      socialLinks: fallbackSocialLinks,
      isUsingFallback: true,
      errors,
    }
  }
}

// Individual data fetchers with fallbacks
export async function getProjectsWithFallback(): Promise<{ data: Project[]; isUsingFallback: boolean }> {
  return {
    data: fallbackProjects,
    isUsingFallback: true,
  }
}

export async function getBlogPostsWithFallback(): Promise<{ data: BlogPost[]; isUsingFallback: boolean }> {
  return {
    data: fallbackBlogPosts,
    isUsingFallback: true,
  }
}

export async function getUsesItemsWithFallback(): Promise<{ data: UsesItem[]; isUsingFallback: boolean }> {
  return {
    data: fallbackUsesItems,
    isUsingFallback: true,
  }
}

// Sanity query functions
const projectsQuery = `
  *[_type == "project"] | order(coalesce(order, 999) asc, publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    longDescription,
    "image": image.asset->url,
    technologies,
    "category": category->{_id, title, "slug": slug.current},
    liveUrl,
    githubUrl,
    featured,
    order,
    publishedAt
  }
`

const blogPostsQuery = `
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    content,
    image {
      asset,
      hotspot,
      crop,
      alt
    },
    "categories": categories[]->{_id, title, "slug": slug.current},
    readingTime,
    featured,
    publishedAt,
    seo
  }
`

const usesItemsQuery = `
  *[_type == "usesItem"] | order(category asc, order asc) {
    _id,
    name,
    description,
    reasoning,
    "image": image.asset->url,
    category,
    url,
    price,
    order
  }
`

const categoriesQuery = `
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    color
  }
`

async function getProjectsFromSanity(): Promise<Project[]> {
  try {
    const projects = await client.fetch(projectsQuery)
    return projects || []
  } catch (error) {
    console.error('Error fetching projects from Sanity:', sanitizeError(error))
    return []
  }
}

async function getBlogPostsFromSanity(): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch(blogPostsQuery)
    return posts || []
  } catch (error) {
    console.error('Error fetching blog posts from Sanity:', sanitizeError(error))
    return []
  }
}

async function getUsesItemsFromSanity(): Promise<UsesItem[]> {
  try {
    const items = await client.fetch(usesItemsQuery)
    return items || []
  } catch (error) {
    console.error('Error fetching uses items from Sanity:', sanitizeError(error))
    return []
  }
}

async function getCategoriesFromSanity(): Promise<Category[]> {
  try {
    const categories = await client.fetch(categoriesQuery)
    return categories || []
  } catch (error) {
    console.error('Error fetching categories from Sanity:', sanitizeError(error))
    return []
  }
}

const siteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    name,
    title,
    email,
    location,
    company,
    role,
    previousRole,
    "avatar": avatar.asset->url,
    heroTitleLine1,
    heroTitleLine2,
    heroDescription,
    heroPrimaryCta,
    heroPrimaryCtaHref,
    heroSecondaryCta,
    heroSecondaryCtaHref,
    technologies,
    availabilityStatus,
    availabilityMessage,
    responseTime,
    bestTopics,
    contactCtaTitle,
    contactCtaDescription,
    copyrightText,
    builtWithText
  }
`

const socialLinksQuery = `
  *[_type == "socialLink"] | order(order asc) {
    _id,
    name,
    icon,
    href,
    handle,
    description,
    color,
    primary
  }
`

async function getSiteSettingsFromSanity(): Promise<SiteSettings | null> {
  try {
    const settings = await client.fetch(siteSettingsQuery)
    return settings || null
  } catch (error) {
    console.error('Error fetching site settings from Sanity:', sanitizeError(error))
    return null
  }
}

async function getSocialLinksFromSanity(): Promise<SanitySocialLink[]> {
  try {
    const links = await client.fetch(socialLinksQuery)
    return links || []
  } catch (error) {
    console.error('Error fetching social links from Sanity:', sanitizeError(error))
    return []
  }
}

// Single blog post query
const blogPostBySlugQuery = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    content,
    image {
      asset,
      hotspot,
      crop,
      alt
    },
    "categories": categories[]->{_id, title, "slug": slug.current},
    readingTime,
    featured,
    publishedAt,
    seo
  }
`

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const post = await client.fetch(blogPostBySlugQuery, { slug })
    if (post) return post

    // Check fallback data
    const fallbackPost = fallbackBlogPosts.find(p => {
      const postSlug = typeof p.slug === 'string' ? p.slug : p.slug.current
      return postSlug === slug
    })
    return fallbackPost || null
  } catch (error) {
    console.error('Error fetching blog post by slug:', sanitizeError(error))
    // Try fallback
    const fallbackPost = fallbackBlogPosts.find(p => {
      const postSlug = typeof p.slug === 'string' ? p.slug : p.slug.current
      return postSlug === slug
    })
    return fallbackPost || null
  }
}

export async function getAllBlogSlugs(): Promise<string[]> {
  try {
    const posts = await client.fetch<{ slug: string }[]>(`*[_type == "blogPost"]{ "slug": slug.current }`)
    if (posts && posts.length > 0) {
      return posts.map(p => p.slug)
    }
    // Return fallback slugs
    return fallbackBlogPosts.map(p => typeof p.slug === 'string' ? p.slug : p.slug.current)
  } catch (error) {
    console.error('Error fetching blog slugs:', sanitizeError(error))
    return fallbackBlogPosts.map(p => typeof p.slug === 'string' ? p.slug : p.slug.current)
  }
}
