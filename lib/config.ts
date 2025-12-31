import navigationData from "@/data/navigation.json"
import socialLinksData from "@/data/social-links.json"
import siteConfigData from "@/data/site-config.json"
import sectionsData from "@/data/sections.json"
import type { SiteSettings, SanitySocialLink } from "./types"

// Type definitions
export interface NavigationItem {
  name: string
  href: string
  description: string
}

export interface SocialLink {
  name: string
  icon: string
  href: string
  handle: string
  description: string
  color: string
  primary: boolean
}

export interface SiteConfig {
  personal: {
    name: string
    title: string
    email: string
    location: string
    company: string
    role: string
    previousRole: string
    avatar: string
  }
  hero: {
    title: {
      line1: string
      line2: string
    }
    description: string
    cta: {
      primary: {
        text: string
        href: string
      }
      secondary: {
        text: string
        href: string
      }
    }
    technologies: string[]
  }
  contact: {
    availability: {
      status: string
      message: string
    }
    responseTime: string
    bestTopics: string[]
    cta: {
      title: string
      description: string
    }
  }
  footer: {
    copyright: string
    builtWith: string
  }
}

export interface SectionConfig {
  work: {
    title: string
    description: string
    filterLabel: string
  }
  blog: {
    title: string
    description: string
    viewAllText: string
  }
  uses: {
    title: string
    description: string
    lastUpdated: string
    categories: Array<{
      name: string
      icon: string
      color: string
    }>
  }
  contact: {
    title: string
    description: string
  }
}

// Export the data with proper typing
export const navigation: { main: NavigationItem[] } = navigationData
export const socialLinks: { links: SocialLink[] } = socialLinksData
export const siteConfig: SiteConfig = siteConfigData
export const sections: SectionConfig = sectionsData

// Helper functions
export const getNavigationItems = () => navigation.main
export const getSocialLinks = () => socialLinks.links
export const getPrimarySocialLinks = () => socialLinks.links.filter((link) => link.primary)
export const getSiteConfig = () => siteConfig
export const getSections = () => sections

// Icon mapping helper (since we can't import React components in JSON)
export const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, string> = {
    Mail: "Mail",
    Twitter: "Twitter",
    Github: "Github",
    Linkedin: "Linkedin",
    Monitor: "Monitor",
    Code: "Code",
    Wrench: "Wrench",
    Coffee: "Coffee",
    Youtube: "Youtube",
    Instagram: "Instagram",
    Facebook: "Facebook",
    Twitch: "Twitch",
    MessageCircle: "MessageCircle",
    Globe: "Globe",
  }
  return iconMap[iconName] || "HelpCircle"
}

// Transform CMS site settings to SiteConfig format
export function transformSiteSettings(settings: SiteSettings | null): SiteConfig {
  if (!settings) {
    return siteConfig
  }

  return {
    personal: {
      name: settings.name || siteConfig.personal.name,
      title: settings.title || siteConfig.personal.title,
      email: settings.email || siteConfig.personal.email,
      location: settings.location || siteConfig.personal.location,
      company: settings.company || siteConfig.personal.company,
      role: settings.role || siteConfig.personal.role,
      previousRole: settings.previousRole || siteConfig.personal.previousRole,
      avatar: typeof settings.avatar === "string"
        ? settings.avatar
        : settings.avatar
          ? "/placeholder.svg"
          : siteConfig.personal.avatar,
    },
    hero: {
      title: {
        line1: settings.heroTitleLine1 || siteConfig.hero.title.line1,
        line2: settings.heroTitleLine2 || siteConfig.hero.title.line2,
      },
      description: settings.heroDescription || siteConfig.hero.description,
      cta: {
        primary: {
          text: settings.heroPrimaryCta || siteConfig.hero.cta.primary.text,
          href: settings.heroPrimaryCtaHref || siteConfig.hero.cta.primary.href,
        },
        secondary: {
          text: settings.heroSecondaryCta || siteConfig.hero.cta.secondary.text,
          href: settings.heroSecondaryCtaHref || siteConfig.hero.cta.secondary.href,
        },
      },
      technologies: settings.technologies || siteConfig.hero.technologies,
    },
    contact: {
      availability: {
        status: settings.availabilityStatus || siteConfig.contact.availability.status,
        message: settings.availabilityMessage || siteConfig.contact.availability.message,
      },
      responseTime: settings.responseTime || siteConfig.contact.responseTime,
      bestTopics: settings.bestTopics || siteConfig.contact.bestTopics,
      cta: {
        title: settings.contactCtaTitle || siteConfig.contact.cta.title,
        description: settings.contactCtaDescription || siteConfig.contact.cta.description,
      },
    },
    footer: {
      copyright: settings.copyrightText || siteConfig.footer.copyright,
      builtWith: settings.builtWithText || siteConfig.footer.builtWith,
    },
  }
}

// Transform CMS social links to SocialLink format
export function transformSocialLinks(links: SanitySocialLink[] | null): SocialLink[] {
  if (!links || links.length === 0) {
    return socialLinks.links
  }

  return links.map((link) => ({
    name: link.name,
    icon: link.icon,
    href: link.href,
    handle: link.handle || "",
    description: link.description || "",
    color: link.color || "hover:text-blue-500",
    primary: link.primary,
  }))
}
