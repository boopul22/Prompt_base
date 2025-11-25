"use client"

import { useState, useEffect } from "react"
import { BlogCard } from "@/components/blog-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { BlogPost, blogService, BlogCategory, blogCategoriesService } from "@/lib/blog-service"
import { usersService } from "@/lib/firestore-service"

export default function BlogCategoryPage() {
  const params = useParams()
  const categorySlug = params.slug as string

  const [posts, setPosts] = useState<(BlogPost & { createdAt: string, updatedAt?: string, publishedAt?: string })[]>([])
  const [category, setCategory] = useState<BlogCategory | null>(null)
  const [authors, setAuthors] = useState<Record<string, { displayName?: string, avatar?: string }>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategoryData()
  }, [categorySlug])

  const loadCategoryData = async () => {
    try {
      const [categoryData, categoryPosts] = await Promise.all([
        blogCategoriesService.getCategoryBySlug(categorySlug),
        blogService.getPublishedPosts(categorySlug)
      ])

      if (!categoryData) {
        // Handle category not found
        setLoading(false)
        return
      }

      setCategory(categoryData)

      // Serialize timestamps for client components
      const serializedPosts = categoryPosts.map(post => ({
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
      }))

      setPosts(serializedPosts)

      // Load author details
      const authorIds = [...new Set(categoryPosts.map(post => post.author))]
      const authorDetails: Record<string, { displayName?: string, avatar?: string }> = {}

      await Promise.all(
        authorIds.map(async (authorId) => {
          try {
            const author = await usersService.getUserById(authorId)
            if (author) {
              authorDetails[authorId] = {
                displayName: author.displayName,
                avatar: author.avatar
              }
            }
          } catch (error) {
            console.error(`Error loading author ${authorId}:`, error)
          }
        })
      )

      setAuthors(authorDetails)
    } catch (error) {
      console.error('Error loading category data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="px-3 md:px-4 py-8 md:py-16 max-w-7xl mx-auto">
          <div className="text-center py-8 md:py-12">
            <div className="brutalist-border bg-card p-6 md:p-8 brutalist-shadow">
              <h3 className="text-xl md:text-2xl font-bold mb-2">LOADING...</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Loading blog posts...
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!category) {
    return (
      <main className="min-h-screen bg-background">
        <div className="px-3 md:px-4 py-8 md:py-16 max-w-7xl mx-auto">
          <div className="text-center py-8 md:py-12">
            <div className="brutalist-border bg-card p-6 md:p-8 brutalist-shadow">
              <h3 className="text-xl md:text-2xl font-bold mb-2">CATEGORY NOT FOUND</h3>
              <p className="text-muted-foreground text-sm md:text-base mb-4">
                The requested blog category could not be found.
              </p>
              <Button asChild className="brutalist-border bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.name} Blog Posts | Free PromptBase`,
    "description": category.description || `Browse ${category.name} blog posts on AI, prompt engineering, and content creation.`,
    "url": `${process.env.NEXT_PUBLIC_SITE_URL}/blog/category/${categorySlug}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": posts.length,
      "itemListElement": posts.map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": process.env.NEXT_PUBLIC_SITE_URL
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": `${process.env.NEXT_PUBLIC_SITE_URL}/blog`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": category.name,
          "item": `${process.env.NEXT_PUBLIC_SITE_URL}/blog/category/${categorySlug}`
        }
      ]
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categorySchema)
        }}
      />

      <div className="px-3 md:px-4 py-8 md:py-16 max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12">
          {/* Back Navigation */}
          <div className="mb-6">
            <Button asChild variant="outline" className="brutalist-border">
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>

          {/* Breadcrumb */}
          <nav className="mb-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link> / <Link href="/blog" className="hover:text-foreground">Blog</Link> / <span>{category.name}</span>
          </nav>

          {/* Category Header */}
          <div className="brutalist-border bg-card p-6 md:p-8 brutalist-shadow mb-6">
            <div className="flex items-center gap-3 mb-4">
              {category.color && (
                <div
                  className="w-6 h-6 rounded-full brutalist-border"
                  style={{ backgroundColor: category.color }}
                />
              )}
              <Badge
                variant="secondary"
                className="brutalist-border bg-accent text-accent-foreground font-bold"
              >
                {category.name.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="brutalist-border">
                {posts.length} post{posts.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-balance">
              {category.name} Blog Posts
            </h1>

            {category.description && (
              <p className="text-base md:text-lg text-muted-foreground text-pretty max-w-4xl">
                {category.description}
              </p>
            )}
          </div>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                author={authors[post.author]}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 md:py-12">
            <div className="brutalist-border bg-card p-6 md:p-8 brutalist-shadow">
              <h3 className="text-xl md:text-2xl font-bold mb-2">NO POSTS IN THIS CATEGORY</h3>
              <p className="text-muted-foreground text-sm md:text-base mb-4">
                There are no published blog posts in the {category.name} category yet.
              </p>
              <Button asChild className="brutalist-border bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/blog">
                  Browse All Posts
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Call to Action */}
        {posts.length > 0 && (
          <div className="mt-16 md:mt-20">
            <div className="brutalist-border bg-accent/10 p-6 md:p-8 brutalist-shadow text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Discover More AI Content
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Explore our complete collection of free AI prompts and resources to enhance your content creation workflow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="brutalist-border bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/">
                    Browse Free Prompts
                  </Link>
                </Button>
                <Button asChild variant="outline" className="brutalist-border">
                  <Link href="/blog">
                    View All Blog Posts
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}