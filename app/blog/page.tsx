"use client"

import { useState, useEffect } from "react"
import { BlogCard } from "@/components/blog-card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"
import Link from "next/link"
import { BlogPost, blogService, BlogCategory, blogCategoriesService } from "@/lib/blog-service"
import { usersService } from "@/lib/firestore-service"

export default function BlogPage() {
  const [posts, setPosts] = useState<(BlogPost & { createdAt: string, updatedAt?: string, publishedAt?: string })[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [authors, setAuthors] = useState<Record<string, { displayName?: string, avatar?: string }>>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTag, setSelectedTag] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Get unique tags from all posts
  const allTags = [...new Set(posts.flatMap(post => post.tags))].sort()

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    // Get tag from URL if present
    const urlParams = new URLSearchParams(window.location.search)
    const tagParam = urlParams.get('tag')
    if (tagParam) {
      setSelectedTag(tagParam)
    }
  }, [])

  const loadInitialData = async () => {
    try {
      const [publishedPosts, blogCategories] = await Promise.all([
        blogService.getPublishedPosts(),
        blogCategoriesService.getAllCategories()
      ])

      // Serialize timestamps for client components
      const serializedPosts = publishedPosts.map(post => ({
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
      setCategories(blogCategories)

      // Load author details
      const authorIds = [...new Set(publishedPosts.map(post => post.author))]
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
      console.error('Error loading blog data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter posts based on search term, category, and tag
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory

    const matchesTag = selectedTag === '' || post.tags.includes(selectedTag)

    return matchesSearch && matchesCategory && matchesTag
  })

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedTag('')
    // Remove tag from URL
    window.history.replaceState({}, '', '/blog')
  }

  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Free PromptBase Blog - AI & Prompt Engineering Insights",
    "description": "Stay updated with the latest insights on AI, prompt engineering, and content creation. Learn from experts and discover new techniques for better AI interactions.",
    "url": `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
    "author": {
      "@type": "Organization",
      "name": "Free PromptBase"
    },
    "blogPost": filteredPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "url": `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
      "datePublished": post.publishedAt || post.createdAt,
      "dateModified": post.updatedAt || post.publishedAt || post.createdAt
    }))
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
          <nav className="mb-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link> / <span>Blog</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-balance">
            AI & Prompt Engineering Blog
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 text-pretty max-w-4xl">
            Stay updated with the latest insights on AI, prompt engineering, and content creation. Learn from experts and discover new techniques for better AI interactions with ChatGPT, Claude, Gemini, and other AI models.
          </p>

          {/* Search and Filters */}
          <div className="brutalist-border bg-card p-4 md:p-6 brutalist-shadow mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search blog posts..."
                  className="brutalist-border pl-10"
                />
              </div>

              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="brutalist-border"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {(selectedCategory !== 'all' || selectedTag !== '') && (
                  <Badge variant="secondary" className="ml-2 brutalist-border">
                    {[
                      selectedCategory !== 'all' ? 'category' : '',
                      selectedTag !== '' ? 'tag' : ''
                    ].filter(Boolean).length}
                  </Badge>
                )}
              </Button>

              {(searchTerm || selectedCategory !== 'all' || selectedTag !== '') && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="brutalist-border"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategory === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory('all')}
                      className="brutalist-border"
                    >
                      All Categories
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.slug ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category.slug)}
                        className="brutalist-border"
                      >
                        {category.name}
                        <Badge variant="secondary" className="ml-2 brutalist-border">
                          {category.postCount}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>

                {allTags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={selectedTag === '' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTag('')}
                        className="brutalist-border"
                      >
                        All Tags
                      </Button>
                      {allTags.slice(0, 10).map((tag) => (
                        <Button
                          key={tag}
                          variant={selectedTag === tag ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedTag(tag)}
                          className="brutalist-border"
                        >
                          #{tag}
                        </Button>
                      ))}
                    </div>
                    {allTags.length > 10 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        And {allTags.length - 10} more tags...
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Filters Display */}
          {(selectedCategory !== 'all' || selectedTag !== '') && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm font-medium">Active filters:</span>
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="brutalist-border">
                  Category: {categories.find(c => c.slug === selectedCategory)?.name}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedTag !== '' && (
                <Badge variant="secondary" className="brutalist-border">
                  Tag: {selectedTag}
                  <button
                    onClick={() => setSelectedTag('')}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Results count */}
          <div className="text-sm text-muted-foreground mb-6">
            {loading ? 'Loading...' : `${filteredPosts.length} post${filteredPosts.length !== 1 ? 's' : ''} found`}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 md:py-12">
            <div className="brutalist-border bg-card p-6 md:p-8 brutalist-shadow">
              <h3 className="text-xl md:text-2xl font-bold mb-2">LOADING BLOG POSTS...</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Please wait while we fetch the latest posts.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  author={authors[post.author]}
                />
              ))}
            </div>

            {filteredPosts.length === 0 && !loading && (
              <div className="text-center py-8 md:py-12">
                <div className="brutalist-border bg-card p-6 md:p-8 brutalist-shadow">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">NO POSTS FOUND</h3>
                  <p className="text-muted-foreground text-sm md:text-base mb-4">
                    {searchTerm || selectedCategory !== 'all' || selectedTag !== ''
                      ? 'Try adjusting your search criteria or filters.'
                      : 'Check back later for new blog posts and insights.'
                    }
                  </p>
                  {(searchTerm || selectedCategory !== 'all' || selectedTag !== '') && (
                    <Button
                      onClick={clearFilters}
                      className="brutalist-border bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Newsletter Signup Section */}
        {!loading && filteredPosts.length > 0 && (
          <div className="mt-16 md:mt-20">
            <div className="brutalist-border bg-accent/10 p-6 md:p-8 brutalist-shadow">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Stay Updated with AI Insights
                </h2>
                <p className="text-muted-foreground mb-6">
                  Get the latest blog posts about AI, prompt engineering, and content creation delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    placeholder="Enter your email"
                    className="brutalist-border"
                  />
                  <Button className="brutalist-border bg-accent text-accent-foreground hover:bg-accent/90">
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  No spam. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}