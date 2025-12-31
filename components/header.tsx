"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getNavigationItems, getSiteConfig, type SiteConfig } from "@/lib/config"

interface HeaderProps {
  siteConfig?: SiteConfig
}

export function Header({ siteConfig: propConfig }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const { theme, setTheme } = useTheme()
  const { scrollY } = useScroll()
  const router = useRouter()
  const pathname = usePathname()

  const navigation = getNavigationItems()
  const siteConfig = propConfig || getSiteConfig()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  useEffect(() => {
    // Only track sections on homepage
    if (pathname !== "/") return

    const handleScroll = () => {
      const hashNavigation = navigation.filter((nav) => nav.href.startsWith("#"))
      const sections = hashNavigation.map((nav) => nav.href.slice(1))
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [navigation, pathname])

  const handleNavigation = (href: string) => {
    if (href.startsWith("#")) {
      // Hash link - scroll to section on current page or navigate to home first
      if (pathname === "/") {
        const element = document.querySelector(href)
        element?.scrollIntoView({ behavior: "smooth" })
      } else {
        router.push(`/${href}`)
      }
    } else {
      // Regular link - navigate to page
      router.push(href)
    }
  }

  const isActiveLink = (href: string) => {
    if (href.startsWith("#")) {
      return pathname === "/" && activeSection === href.slice(1)
    }
    return pathname === href
  }

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
      animate={{
        height: isScrolled ? "4rem" : "5rem",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.webp"
            alt={siteConfig.personal.name}
            width={120}
            height={40}
            className="h-8 w-auto dark:invert-0 invert"
            priority
          />
          <span className="text-xl font-bold">{siteConfig.personal.name}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              title={item.description}
            >
              {item.name}
              {isActiveLink(item.href) && (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeSection"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className="text-left text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
