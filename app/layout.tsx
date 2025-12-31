import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ErrorBoundary } from "@/components/error-boundary"
import { getPortfolioData } from "@/lib/data-service"
import { transformSiteSettings } from "@/lib/config"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export async function generateMetadata(): Promise<Metadata> {
  const { siteSettings } = await getPortfolioData()
  const config = transformSiteSettings(siteSettings)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jlmx.dev"

  return {
    title: `${config.personal.name} - ${config.personal.title}`,
    description: config.hero.description,
    keywords: ["Software Developer", "Web Developer", "React", "Next.js", "TypeScript", "Full-Stack"],
    authors: [{ name: config.personal.name }],
    creator: config.personal.name,
    metadataBase: new URL(siteUrl),
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
      apple: "/favicon.png",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      title: `${config.personal.name} - ${config.personal.title}`,
      description: config.hero.description,
      siteName: `${config.personal.name} Portfolio`,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${config.personal.name} - ${config.personal.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.personal.name} - ${config.personal.title}`,
      description: config.hero.description,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
