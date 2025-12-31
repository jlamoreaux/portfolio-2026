import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// Sanitize error messages to prevent token/secret leakage
function sanitizeError(error: unknown): string {
  if (!(error instanceof Error)) return 'Unknown error'
  let message = error.message
  message = message.replace(/[a-zA-Z0-9]{40,}/g, '[REDACTED]')
  message = message.replace(/token=[^&\s]+/gi, 'token=[REDACTED]')
  message = message.replace(/Bearer\s+[a-zA-Z0-9._-]+/gi, 'Bearer [REDACTED]')
  return message
}

// Validate environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_PROJECT_TOKEN;

if (!projectId || !dataset) {
  console.warn("⚠️ Sanity configuration missing. Using fallback data.");
}

// Read-only client for public use
export const client = createClient({
  projectId: projectId || "fallback",
  dataset: dataset || "production",
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
  // Add timeout and retry configuration
  timeout: 10000, // 10 seconds
  retryDelay: (attemptNumber) => Math.min(attemptNumber * 1000, 10000), // Max 10 seconds
});

// Write-enabled client for mutations (server-side only)
export const writeClient = createClient({
  projectId: projectId || "fallback",
  dataset: dataset || "production",
  apiVersion: "2024-01-01",
  useCdn: false, // Disable CDN for mutations
  token: token, // Use the write token
  timeout: 10000,
  retryDelay: (attemptNumber) => Math.min(attemptNumber * 1000, 10000),
});

const builder = imageUrlBuilder(client);

// Chainable stub for when Sanity is not configured
const createStub = (): any => {
  const stub: any = {
    url: () => "/placeholder.svg",
  };
  const methods = ['width', 'height', 'fit', 'crop', 'auto', 'format', 'quality'];
  methods.forEach(method => {
    stub[method] = () => stub;
  });
  return stub;
};

export function urlFor(source: SanityImageSource) {
  try {
    if (!source || !projectId) {
      return createStub();
    }
    return builder.image(source);
  } catch (error) {
    console.warn("Error building image URL:", sanitizeError(error));
    return createStub();
  }
}

// Enhanced fetch function with error handling
async function safeFetch<T>(query: string, params?: any): Promise<T[]> {
  if (!projectId || !dataset) {
    console.warn("Sanity not configured, returning empty array");
    return [];
  }

  try {
    const result = await client.fetch<T[]>(query, params);
    return result || [];
  } catch (error) {
    console.error("Sanity fetch error:", sanitizeError(error));
    return [];
  }
}

// GROQ queries
export const projectsQuery = `
  *[_type == "project"] | order(order asc, publishedAt desc) {
    _id,
    title,
    slug,
    description,
    longDescription,
    image,
    technologies,
    category->{
      title,
      slug
    },
    liveUrl,
    githubUrl,
    featured,
    publishedAt
  }
`;

export const blogPostsQuery = `
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    image,
    categories[]->{
      title,
      slug
    },
    readingTime,
    featured,
    publishedAt
  }
`;

export const usesItemsQuery = `
  *[_type == "usesItem"] | order(category asc, order asc) {
    _id,
    name,
    description,
    reasoning,
    image,
    category,
    url,
    price
  }
`;

export const categoriesQuery = `
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    color
  }
`;

export const siteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    name,
    title,
    email,
    location,
    company,
    role,
    previousRole,
    avatar,
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
`;

export const socialLinksQuery = `
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
`;

// Safe fetch functions
export const fetchProjects = () => safeFetch(projectsQuery);
export const fetchBlogPosts = () => safeFetch(blogPostsQuery);
export const fetchUsesItems = () => safeFetch(usesItemsQuery);
export const fetchCategories = () => safeFetch(categoriesQuery);

// Fetch site settings (returns single object or null)
export async function fetchSiteSettings() {
  if (!projectId || !dataset) {
    console.warn("Sanity not configured, returning null for site settings");
    return null;
  }
  try {
    return await client.fetch(siteSettingsQuery);
  } catch (error) {
    console.error("Error fetching site settings:", sanitizeError(error));
    return null;
  }
}

// Fetch social links
export async function fetchSocialLinks() {
  return safeFetch(socialLinksQuery);
}

// Individual queries with error handling
export const projectBySlugQuery = `
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    longDescription,
    image,
    technologies,
    category->{
      title,
      slug
    },
    liveUrl,
    githubUrl,
    publishedAt
  }
`;

export const blogPostBySlugQuery = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
    image,
    categories[]->{
      title,
      slug
    },
    readingTime,
    publishedAt,
    seo
  }
`;

export async function fetchProjectBySlug(slug: string) {
  try {
    if (!projectId || !dataset) return null;
    return await client.fetch(projectBySlugQuery, { slug });
  } catch (error) {
    console.error("Error fetching project by slug:", sanitizeError(error));
    return null;
  }
}

export async function fetchBlogPostBySlug(slug: string) {
  try {
    if (!projectId || !dataset) return null;
    return await client.fetch(blogPostBySlugQuery, { slug });
  } catch (error) {
    console.error("Error fetching blog post by slug:", sanitizeError(error));
    return null;
  }
}
