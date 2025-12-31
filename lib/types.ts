export interface SanityImage {
  _type: "image"
  asset: {
    _ref: string
    _type: "reference"
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export interface Category {
  _id: string
  title: string
  slug: string | { current: string }
  description?: string
  color?: string
}

export interface Project {
  _id: string
  title: string
  slug: string | { current: string }
  description: string
  longDescription: string
  image: SanityImage
  technologies: string[]
  category: Category
  liveUrl: string
  githubUrl: string
  featured: boolean
  publishedAt: string
}

export interface BlogPost {
  _id: string
  title: string
  slug: string | { current: string }
  excerpt: string
  content?: any[] // Rich text content
  image: SanityImage
  categories: Category[]
  readingTime: number
  featured: boolean
  publishedAt: string
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

export interface UsesItem {
  _id: string
  name: string
  description: string
  reasoning: string
  image: SanityImage
  category: string
  url: string
  price?: string
}

export interface SiteSettings {
  name: string
  title: string
  email: string
  location?: string
  company?: string
  role?: string
  previousRole?: string
  avatar?: SanityImage | string
  heroTitleLine1: string
  heroTitleLine2: string
  heroDescription: string
  heroPrimaryCta?: string
  heroPrimaryCtaHref?: string
  heroSecondaryCta?: string
  heroSecondaryCtaHref?: string
  technologies?: string[]
  availabilityStatus?: "available" | "limited" | "unavailable"
  availabilityMessage?: string
  responseTime?: string
  bestTopics?: string[]
  contactCtaTitle?: string
  contactCtaDescription?: string
  copyrightText?: string
  builtWithText?: string
}

export interface SanitySocialLink {
  _id: string
  name: string
  icon: string
  href: string
  handle?: string
  description?: string
  color?: string
  primary: boolean
}
