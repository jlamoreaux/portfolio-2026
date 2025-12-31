"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Monitor, Code, Wrench, Coffee, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getImageUrl } from "@/lib/image-utils"
import { getSections } from "@/lib/config"
import type { UsesItem } from "@/lib/types"

interface UsesSectionProps {
  initialUsesItems: UsesItem[]
  isStandalonePage?: boolean
}

export function UsesSection({ initialUsesItems, isStandalonePage = false }: UsesSectionProps) {
  const usesData = initialUsesItems
  const sections = getSections()

  const categories = [
    { name: "Hardware", icon: Monitor, color: "bg-blue-500" },
    { name: "Software", icon: Code, color: "bg-amber-500" },
    { name: "Development Tools", icon: Wrench, color: "bg-orange-600" },
    { name: "Office Setup", icon: Coffee, color: "bg-orange-400" },
  ]

  return (
    <section className={`py-20 ${isStandalonePage ? "" : "bg-muted/30"}`}>
      <div className="container mx-auto px-4">
        {/* Back button for standalone page */}
        {isStandalonePage && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Button variant="ghost" asChild className="group">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
            </Button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className={`${isStandalonePage ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"} font-bold mb-4`}>
            {sections.uses.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            {isStandalonePage
              ? "A comprehensive look at the tools, hardware, and software that power my development workflow and daily productivity."
              : sections.uses.description}
          </p>
          <p className="text-sm text-muted-foreground">Last updated: {sections.uses.lastUpdated}</p>
        </motion.div>

        {categories.map((category, categoryIndex) => {
          const categoryItems = usesData.filter((item) => item.category === category.name)
          const Icon = category.icon

          if (categoryItems.length === 0) return null

          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
              viewport={{ once: true }}
              className="mb-16 last:mb-0"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className={`p-2 rounded-lg ${category.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">{category.name}</h2>
                <Badge variant="outline" className="ml-auto">
                  {categoryItems.length} item{categoryItems.length !== 1 ? "s" : ""}
                </Badge>
              </div>

              <div
                className={`grid grid-cols-1 ${isStandalonePage ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2"} gap-6`}
              >
                {categoryItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardHeader className="pb-4">
                        <div className="flex items-start gap-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={getImageUrl(item.image, 64, 64) || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-lg leading-tight">{item.name}</CardTitle>
                              {item.price && (
                                <Badge variant="outline" className="text-xs whitespace-nowrap">
                                  {item.price}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          <span className="font-medium text-foreground">Why I use this:</span> {item.reasoning}
                        </p>
                        <Button variant="ghost" size="sm" className="p-0 h-auto" asChild>
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            Learn More
                            <ExternalLink className="ml-2 h-3 w-3" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
