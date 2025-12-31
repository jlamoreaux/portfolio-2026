import { ProjectShowcase } from "@/components/project-showcase"
import { StatusBanner } from "@/components/status-banner"
import { ErrorBoundary } from "@/components/error-boundary"
import { getPortfolioData } from "@/lib/data-service"
import { getSections } from "@/lib/config"
import type { Metadata } from "next"

export default async function ProjectsPage() {
  const { projects, categories, isUsingFallback, errors } = await getPortfolioData()
  const sections = getSections()

  return (
    <>
      <StatusBanner isUsingFallback={isUsingFallback} errors={errors} />

      <div className="pt-20">
        <ErrorBoundary
          fallback={
            <div className="py-20 text-center">
              <p className="text-muted-foreground">Projects section temporarily unavailable</p>
            </div>
          }
        >
          <ProjectShowcase initialProjects={projects} initialCategories={categories} isStandalonePage={true} />
        </ErrorBoundary>
      </div>
    </>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const { siteSettings } = await getPortfolioData()
  const sections = getSections()
  const name = siteSettings?.name || "Portfolio"

  return {
    title: `${sections.work.title} - ${name}`,
    description: sections.work.description,
    openGraph: {
      title: `${sections.work.title} - ${name}`,
      description: sections.work.description,
    },
  }
}

export const revalidate = 3600
