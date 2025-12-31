"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getImageUrl } from "@/lib/image-utils"
import { getSections } from "@/lib/config"
import type { BlogPost, Category } from "@/lib/types"

interface BlogSectionProps {
  initialPosts: BlogPost[]
  initialCategories: Category[]
}

export function BlogSection({ initialPosts, initialCategories }: BlogSectionProps) {
  const [posts] = useState<BlogPost[]>(initialPosts)
  const [selectedCategory, setSelectedCategory] = useState("All")

  const sections = getSections()
  const categoriesWithPosts = initialCategories.filter((cat) =>
    initialPosts.some((post) => post.categories.some((postCat) => postCat.title === cat.title))
  )
  const allCategories = ["All", ...Array.from(new Set(categoriesWithPosts.map((cat) => cat.title)))]

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.categories.some((cat) => cat.title === selectedCategory))

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{sections.blog.title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{sections.blog.description}</p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {allCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" layout>
          <AnimatePresence>
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post._id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  layout: { duration: 0.3 },
                }}
              >
                <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={getImageUrl(post.image, 400, 200) || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.publishedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readingTime} min read
                      </div>
                    </div>
                    <Link href={`/blog/${typeof post.slug === 'string' ? post.slug : post.slug.current}`}>
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.categories.map((category) => (
                        <Badge key={category._id} variant="secondary" className="text-xs">
                          {category.title}
                        </Badge>
                      ))}
                    </div>
                    <Link href={`/blog/${typeof post.slug === 'string' ? post.slug : post.slug.current}`}>
                      <Button variant="ghost" className="group/btn p-0 h-auto font-medium">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/blog">
            <Button size="lg" variant="outline">
              {sections.blog.viewAllText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
