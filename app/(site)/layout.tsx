import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { ScrollProgress } from "@/components/scroll-progress"
import { CursorTrail } from "@/components/cursor-trail"
import { ClientErrorMonitoring } from "@/components/client-error-monitoring"
import { getPortfolioData } from "@/lib/data-service"
import { transformSiteSettings } from "@/lib/config"

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { siteSettings } = await getPortfolioData()
  const siteConfig = transformSiteSettings(siteSettings)

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ClientErrorMonitoring />
      <ScrollProgress />
      <CursorTrail />
      <Header siteConfig={siteConfig} />
      <main className="relative">{children}</main>
    </ThemeProvider>
  )
}
