"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Linkedin } from "lucide-react"
import { getSiteConfig, getSections, getSocialLinks, type SiteConfig } from "@/lib/config"

interface ContactSectionProps {
  siteConfig?: SiteConfig
}

export function ContactSection({ siteConfig: propConfig }: ContactSectionProps) {
  const siteConfig = propConfig || getSiteConfig()
  const sections = getSections()
  const socialLinks = getSocialLinks()

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{sections.contact.title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{sections.contact.description}</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            {/* Response Time & Availability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Card className="bg-gradient-to-br from-primary/5 to-accent/5 dark:from-transparent dark:to-transparent dark:border-primary/20">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div
                      className={`w-3 h-3 rounded-full animate-pulse ${
                        siteConfig.contact.availability.status === "available" ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    />
                    <span className="font-semibold">
                      {siteConfig.contact.availability.status === "available"
                        ? "Currently Available"
                        : "Limited Availability"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{siteConfig.contact.availability.message}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <h4 className="font-semibold mb-3">Response Time</h4>
                  <p className="text-sm text-muted-foreground">{siteConfig.contact.responseTime}</p>
                </CardContent>
              </Card>
            </div>

            {/* Best For */}
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4 text-center">Best Topics for Discussion</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  {siteConfig.contact.bestTopics.map((topic, index) => (
                    <div key={topic} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${index % 2 === 0 ? "bg-primary" : "bg-accent"}`} />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-primary/10 to-accent/10 dark:from-transparent dark:to-transparent dark:border dark:border-primary/30 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-4">{siteConfig.contact.cta.title}</h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">{siteConfig.contact.cta.description}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <a href={`mailto:${siteConfig.personal.email}`}>
                    <Mail className="mr-2 h-5 w-5" />
                    Send Email
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a
                    href={socialLinks.find((link) => link.name === "LinkedIn")?.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="mr-2 h-5 w-5" />
                    Connect on LinkedIn
                  </a>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
