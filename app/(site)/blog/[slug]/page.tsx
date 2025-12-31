import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { BlogImage } from "@/components/blog-image"
import { getBlogPostBySlug, getAllBlogSlugs, getPortfolioData } from "@/lib/data-service"
import { transformSiteSettings, transformSocialLinks } from "@/lib/config"
import { PortableText, PortableTextComponents } from "@portabletext/react"
import { urlFor } from "@/lib/sanity"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null

      const imageUrl = urlFor(value).width(800).url()
      const alt = value.alt || ""

      return <BlogImage src={imageUrl} alt={alt} />
    },
  },
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const { siteSettings, socialLinks } = await getPortfolioData()
  const siteConfig = transformSiteSettings(siteSettings)
  const socialLinksConfig = transformSocialLinks(socialLinks)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const postSlug = typeof post.slug === 'string' ? post.slug : post.slug.current

  // Handle featured image - use urlFor for Sanity image objects with crop/hotspot
  const getFeaturedImageUrl = () => {
    if (!post.image) return null
    if (typeof post.image === 'string') return post.image
    if (post.image.asset) {
      return urlFor(post.image)
        .width(1200)
        .height(600)
        .fit('crop')
        .url()
    }
    return null
  }
  const featuredImageUrl = getFeaturedImageUrl()

  return (
    <>
      <article className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/#blog">
            <Button variant="ghost" className="mb-8 -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>

          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category) => (
                <Badge key={category._id} variant="secondary">
                  {category.title}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {formatDate(post.publishedAt)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {post.readingTime} min read
              </div>
            </div>
          </header>

          {featuredImageUrl && (
            <div className="relative w-full aspect-[2/1] mb-12 rounded-lg overflow-hidden">
              <Image
                src={featuredImageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:mb-4 prose-p:leading-relaxed max-w-none">
            {post.content ? (
              <PortableText value={post.content} components={portableTextComponents} />
            ) : (
              <p className="text-muted-foreground italic">
                Full content coming soon...
              </p>
            )}
          </div>
        </div>
      </article>

      <Footer siteConfig={siteConfig} socialLinks={socialLinksConfig} />
    </>
  )
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jlmx.dev"

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  const title = post.seo?.metaTitle || post.title
  const description = post.seo?.metaDescription || post.excerpt

  // Get OG image from featured image
  const getOgImageUrl = () => {
    if (!post.image) return `${siteUrl}/og-image.png`
    if (typeof post.image === 'string') return post.image
    if (post.image.asset) {
      return urlFor(post.image)
        .width(1200)
        .height(630)
        .fit('crop')
        .auto('format')
        .url()
    }
    return `${siteUrl}/og-image.png`
  }
  const ogImageUrl = getOgImageUrl()

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      url: `${siteUrl}/blog/${slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export const revalidate = 3600
