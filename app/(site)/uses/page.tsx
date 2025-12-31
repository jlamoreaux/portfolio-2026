import { UsesSection } from "@/components/uses-section"
import { StatusBanner } from "@/components/status-banner"
import { ErrorBoundary } from "@/components/error-boundary"
import { getPortfolioData } from "@/lib/data-service"
import { getSections } from "@/lib/config"
import type { Metadata } from "next"

export default async function UsesPage() {
  const { usesItems, isUsingFallback, errors } = await getPortfolioData()
  const sections = getSections()

  return (
    <>
      <StatusBanner isUsingFallback={isUsingFallback} errors={errors} />

      <div className="pt-20">
        <ErrorBoundary
          fallback={
            <div className="py-20 text-center">
              <p className="text-muted-foreground">Uses section temporarily unavailable</p>
            </div>
          }
        >
          <UsesSection initialUsesItems={usesItems} isStandalonePage={true} />
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
    title: `${sections.uses.title} - ${name}`,
    description: sections.uses.description,
    openGraph: {
      title: `${sections.uses.title} - ${name}`,
      description: sections.uses.description,
    },
  }
}

export const revalidate = 3600
