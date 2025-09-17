import { notFound } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Eye, User, Calendar, ArrowLeft, Share2 } from "lucide-react"
import { BlogCard } from "@/components/blog-card"
import { blogService, BlogPost } from "@/lib/blog-service"
import { usersService } from "@/lib/firestore-service"
import type { Metadata } from "next"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await blogService.getPostBySlug(params.slug)

    if (!post || post.status !== 'published') {
      return {
        title: "Blog Post Not Found",
        description: "The requested blog post could not be found."
      }
    }

    const title = post.seo?.metaTitle || post.title
    const description = post.seo?.metaDescription || post.excerpt
    const keywords = post.seo?.keywords || post.tags
    const url = `/blog/${params.slug}`

    return {
      title: `${title} | Free PromptBase Blog`,
      description,
      keywords: [...keywords, "AI blog", "prompt engineering", "AI tips", "ChatGPT", "content creation"],
      alternates: {
        canonical: url
      },
      openGraph: {
        title,
        description,
        url,
        type: "article",
        siteName: "Free PromptBase",
        images: post.featuredImage ? [
          {
            url: post.featuredImage,
            width: 1200,
            height: 630,
            alt: post.title
          }
        ] : [
          {
            url: "/og-image.png",
            width: 1200,
            height: 630,
            alt: post.title
          }
        ]
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [post.featuredImage || "/og-image.png"]
      },
      other: {
        "article:author": "Free PromptBase",
        "article:section": post.category,
        "article:tag": post.tags.join(", "),
        "article:published_time": post.publishedAt && typeof post.publishedAt === 'object' && 'toDate' in post.publishedAt
          ? post.publishedAt.toDate().toISOString()
          : (post.createdAt && typeof post.createdAt === 'object' && 'toDate' in post.createdAt
            ? post.createdAt.toDate().toISOString()
            : new Date().toISOString()),
        "article:modified_time": post.updatedAt && typeof post.updatedAt === 'object' && 'toDate' in post.updatedAt
          ? post.updatedAt.toDate().toISOString()
          : undefined
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Blog Post | Free PromptBase",
      description: "Discover insights on AI, prompt engineering, and content creation."
    }
  }
}

// Blog Post Client Component
function BlogPostClient({
  post,
  author,
  relatedPosts
}: {
  post: BlogPost & { createdAt: string, updatedAt?: string, publishedAt?: string }
  author: { displayName?: string, avatar?: string } | null
  relatedPosts: (BlogPost & { createdAt: string, updatedAt?: string, publishedAt?: string })[]
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const displayDate = post.publishedAt || post.createdAt

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-3 md:px-4 py-6 md:py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button asChild variant="outline" className="brutalist-border">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <article className="brutalist-border bg-card brutalist-shadow overflow-hidden mb-8">
          {post.featuredImage && (
            <div className="aspect-video relative overflow-hidden">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
              <Badge
                variant="secondary"
                className="brutalist-border bg-accent text-accent-foreground font-bold"
              >
                {post.category.toUpperCase()}
              </Badge>

              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={displayDate}>
                  {formatDate(displayDate)}
                </time>
              </div>

              {post.readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime} min read</span>
                </div>
              )}

              {post.views && post.views > 0 && (
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views} views</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg md:text-xl text-muted-foreground mb-6 text-pretty">
                {post.excerpt}
              </p>
            )}

            {/* Author and Share */}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-3">
                {author?.avatar && (
                  <img
                    src={author.avatar}
                    alt={author.displayName || 'Author'}
                    className="w-10 h-10 rounded-full brutalist-border"
                  />
                )}
                {!author?.avatar && (
                  <div className="w-10 h-10 rounded-full brutalist-border bg-muted flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <p className="font-medium">
                    {author?.displayName || 'Anonymous'}
                  </p>
                  <p className="text-sm text-muted-foreground">Author</p>
                </div>
              </div>

              <Button variant="outline" className="brutalist-border">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </article>

        {/* Article Content */}
        <div className="brutalist-border bg-card p-6 md:p-8 brutalist-shadow mb-8">
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-accent prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:border prose-pre:border-border"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="brutalist-border bg-card p-6 brutalist-shadow mb-8">
            <h3 className="font-bold text-lg mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="text-sm bg-muted text-muted-foreground px-3 py-1.5 brutalist-border hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="brutalist-border bg-card p-6 md:p-8 brutalist-shadow">
            <h3 className="font-bold text-2xl mb-6">Related Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard
                  key={relatedPost.id}
                  post={relatedPost}
                  author={author}
                />
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 brutalist-border bg-accent/10 p-6 md:p-8 brutalist-shadow text-center">
          <h3 className="text-2xl font-bold mb-4">Discover More AI Insights</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Explore our collection of free AI prompts and guides to enhance your content creation and productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="brutalist-border bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/">
                Browse Free Prompts
              </Link>
            </Button>
            <Button asChild variant="outline" className="brutalist-border">
              <Link href="/blog">
                Read More Articles
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.featuredImage || `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/og-image.png`,
            "author": {
              "@type": "Person",
              "name": author?.displayName || "Anonymous",
              "image": author?.avatar
            },
            "publisher": {
              "@type": "Organization",
              "name": "Free PromptBase",
              "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/logo.png`
              }
            },
            "datePublished": displayDate,
            "dateModified": post.updatedAt || displayDate,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog/${post.slug}`
            },
            "articleSection": post.category,
            "keywords": post.tags.join(", "),
            "wordCount": post.content.replace(/<[^>]*>/g, '').split(/\s+/).length,
            "timeRequired": post.readTime ? `PT${post.readTime}M` : undefined
          })
        }}
      />
    </main>
  )
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const post = await blogService.getPostBySlug(params.slug)

    if (!post || post.status !== 'published') {
      notFound()
    }

    // Increment views
    if (post.id) {
      blogService.incrementViews(post.id).catch(error => {
        console.error('Error incrementing views:', error)
      })
    }

    // Get author details
    let author = null
    if (post.author) {
      const rawAuthor = await usersService.getUserById(post.author)
      if (rawAuthor) {
        author = {
          displayName: rawAuthor.displayName,
          avatar: rawAuthor.avatar
        }
      }
    }

    // Get related posts
    const allRelatedPosts = await blogService.getRelatedPosts(post.id!, post.category, 3)

    // Serialize the post data to avoid timestamp serialization issues
    const serializedPost = {
      ...post,
      createdAt: post.createdAt && typeof post.createdAt === 'object' && 'toDate' in post.createdAt
        ? post.createdAt.toDate().toISOString()
        : post.createdAt || new Date().toISOString(),
      updatedAt: post.updatedAt && typeof post.updatedAt === 'object' && 'toDate' in post.updatedAt
        ? post.updatedAt.toDate().toISOString()
        : post.updatedAt,
      publishedAt: post.publishedAt && typeof post.publishedAt === 'object' && 'toDate' in post.publishedAt
        ? post.publishedAt.toDate().toISOString()
        : post.publishedAt
    }

    // Serialize related posts
    const serializedRelatedPosts = allRelatedPosts.map(p => ({
      ...p,
      createdAt: p.createdAt && typeof p.createdAt === 'object' && 'toDate' in p.createdAt
        ? p.createdAt.toDate().toISOString()
        : p.createdAt || new Date().toISOString(),
      updatedAt: p.updatedAt && typeof p.updatedAt === 'object' && 'toDate' in p.updatedAt
        ? p.updatedAt.toDate().toISOString()
        : p.updatedAt,
      publishedAt: p.publishedAt && typeof p.publishedAt === 'object' && 'toDate' in p.publishedAt
        ? p.publishedAt.toDate().toISOString()
        : p.publishedAt
    }))

    return (
      <BlogPostClient
        post={serializedPost}
        author={author}
        relatedPosts={serializedRelatedPosts}
      />
    )
  } catch (error) {
    console.error('Error loading blog post:', error)
    notFound()
  }
}