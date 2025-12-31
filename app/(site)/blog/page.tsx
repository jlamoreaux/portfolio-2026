import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { getPortfolioData } from "@/lib/data-service"
import { transformSiteSettings, transformSocialLinks } from "@/lib/config"
import { getImageUrl } from "@/lib/image-utils"

export default async function BlogPage() {
  const { blogPosts, siteSettings, socialLinks } = await getPortfolioData()
  const siteConfig = transformSiteSettings(siteSettings)
  const socialLinksConfig = transformSocialLinks(socialLinks)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Link href="/#blog">
            <Button variant="ghost" className="mb-8 -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Thoughts, tutorials, and insights on software development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => {
              const postSlug = typeof post.slug === 'string' ? post.slug : post.slug.current
              return (
                <Card key={post._id} className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
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
                    <Link href={`/blog/${postSlug}`}>
                      <h2 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {post.categories.map((category) => (
                        <Badge key={category._id} variant="secondary" className="text-xs">
                          {category.title}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <Footer siteConfig={siteConfig} socialLinks={socialLinksConfig} />
    </>
  )
}

export const metadata = {
  title: "Blog - Jordan Lamoreaux",
  description: "Thoughts, tutorials, and insights on software development",
}

export const revalidate = 3600
