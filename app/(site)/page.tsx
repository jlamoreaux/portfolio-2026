import { HeroSection } from "@/components/hero-section"
import { ProjectPreview } from "@/components/project-preview"
import { BlogSection } from "@/components/blog-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { KonamiTerminal } from "@/components/konami-terminal"
import { StatusBanner } from "@/components/status-banner"
import { ErrorBoundary } from "@/components/error-boundary"
import { getPortfolioData } from "@/lib/data-service"
import { transformSiteSettings, transformSocialLinks } from "@/lib/config"

export default async function Home() {
  const { projects, blogPosts, categories, siteSettings, socialLinks, isUsingFallback, errors } = await getPortfolioData()

  const siteConfig = transformSiteSettings(siteSettings)
  const socialLinksConfig = transformSocialLinks(socialLinks)

  return (
    <>
      <StatusBanner isUsingFallback={isUsingFallback} errors={errors} />

      <ErrorBoundary>
        <HeroSection siteConfig={siteConfig} />
      </ErrorBoundary>

      <ErrorBoundary
        fallback={
          <div className="py-20 text-center">
            <p className="text-muted-foreground">Projects preview temporarily unavailable</p>
          </div>
        }
      >
        <ProjectPreview initialProjects={projects.slice(0, 3)} />
      </ErrorBoundary>

      <ErrorBoundary
        fallback={
          <div className="py-20 text-center">
            <p className="text-muted-foreground">Blog section temporarily unavailable</p>
          </div>
        }
      >
        <BlogSection initialPosts={blogPosts} initialCategories={categories} />
      </ErrorBoundary>

      <ErrorBoundary>
        <ContactSection siteConfig={siteConfig} />
      </ErrorBoundary>

      <Footer siteConfig={siteConfig} socialLinks={socialLinksConfig} />
      <KonamiTerminal />
    </>
  )
}

// Enable ISR with error handling
export const revalidate = 3600

// Add metadata
export async function generateMetadata() {
  try {
    const { siteSettings, isUsingFallback } = await getPortfolioData()
    const siteConfig = transformSiteSettings(siteSettings)

    return {
      title: `${siteConfig.personal.name} - ${siteConfig.personal.title}`,
      description:
        siteConfig.hero.description +
        (isUsingFallback ? " (Cached Content)" : ""),
    }
  } catch (error) {
    return {
      title: "Software Developer Portfolio",
      description: "Portfolio showcasing innovative software development projects and technical expertise",
    }
  }
}
