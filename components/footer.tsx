"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Mail, Github, Linkedin, Heart, Youtube, Instagram, Facebook, MessageCircle, Globe, Twitch } from "lucide-react"
import { getSocialLinks, getSiteConfig, type SiteConfig, type SocialLink } from "@/lib/config"

// Custom X (Twitter) icon
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mail,
  X: XIcon,
  Github,
  Linkedin,
  Youtube,
  Instagram,
  Facebook,
  MessageCircle,
  Globe,
  Twitch,
}

interface FooterProps {
  siteConfig?: SiteConfig
  socialLinks?: SocialLink[]
}

export function Footer({ siteConfig: propConfig, socialLinks: propLinks }: FooterProps) {
  const socialLinks = propLinks || getSocialLinks()
  const siteConfig = propConfig || getSiteConfig()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="bg-muted/50 border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center space-y-8">
          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center space-x-6"
          >
            {socialLinks.map((link) => {
              const Icon = iconMap[link.icon]
              if (!Icon) return null
              return (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-full bg-background hover:bg-muted transition-all duration-300 ${link.color}`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{link.name}</span>
                </motion.a>
              )
            })}
          </motion.div>

          {/* Back to Top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button variant="ghost" onClick={scrollToTop} className="text-muted-foreground hover:text-foreground">
              Back to Top ↑
            </Button>
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center space-y-2"
          >
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              {siteConfig.footer.builtWith.replace("❤️", "")}
              <Heart className="h-4 w-4 text-red-500" />
              {siteConfig.footer.builtWith.split("❤️")[1]}
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {siteConfig.footer.copyright}
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
