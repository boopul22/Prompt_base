"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PromptCard } from "@/components/prompt-card"
import { CategoryFilter } from "@/components/category-filter"
import { HeroSection } from "@/components/hero-section"
import { StructuredData } from "@/components/structured-data"
import { LoadMoreButton } from "@/components/load-more-button"
import { promptsService, FirestorePrompt } from "@/lib/firestore-service"

interface SerializedPrompt extends Omit<FirestorePrompt, 'createdAt' | 'updatedAt'> {
  createdAt: string
  updatedAt?: string
}
import { getCategories } from "@/lib/migrate-categories"
import { Category } from "@/lib/category-service"

const PROMPTS_PER_PAGE = 9

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [prompts, setPrompts] = useState<SerializedPrompt[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    // Reset pagination when category changes
    setCurrentPage(0)
    setPrompts([])
    setHasMore(true)
    loadInitialData()
  }, [selectedCategory])

  const loadInitialData = async () => {
    try {
      setLoading(true)

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Loading timeout')), 10000)
      )

      // Load categories
      const categoriesPromise = getCategories().catch(error => {
        console.error('Categories loading failed:', error)
        return []
      })

      const dbCategories = await Promise.race([categoriesPromise, timeoutPromise]) as Category[]

      // Load initial batch of prompts with timeout
      const promptsPromise = promptsService.getApprovedPrompts(selectedCategory, PROMPTS_PER_PAGE, 0).catch(error => {
        console.error('Prompts loading failed:', error)
        return []
      })

      const approvedPrompts = await Promise.race([promptsPromise, timeoutPromise]) as FirestorePrompt[]

      setCategories(dbCategories)

      // Serialize timestamps before setting state
      const serializedPrompts = approvedPrompts.map(prompt => ({
        ...prompt,
        createdAt: prompt.createdAt && typeof prompt.createdAt === 'object' && 'toDate' in prompt.createdAt
          ? prompt.createdAt.toDate().toISOString()
          : prompt.createdAt || new Date().toISOString(),
        updatedAt: prompt.updatedAt && typeof prompt.updatedAt === 'object' && 'toDate' in prompt.updatedAt
          ? prompt.updatedAt.toDate().toISOString()
          : prompt.updatedAt
      }))

      setPrompts(serializedPrompts)

      // Check if there are more prompts to load
      if (approvedPrompts.length < PROMPTS_PER_PAGE) {
        setHasMore(false)
      }

    } catch (error) {
      console.error('Error loading data:', error)
      setCategories([])
      setPrompts([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  const loadMorePrompts = async () => {
    if (loadingMore || !hasMore) return

    try {
      setLoadingMore(true)

      const nextPage = currentPage + 1
      const offset = nextPage * PROMPTS_PER_PAGE

      const newPrompts = await promptsService.getApprovedPrompts(selectedCategory, PROMPTS_PER_PAGE, offset)

      // Serialize timestamps
      const serializedNewPrompts = newPrompts.map(prompt => ({
        ...prompt,
        createdAt: prompt.createdAt && typeof prompt.createdAt === 'object' && 'toDate' in prompt.createdAt
          ? prompt.createdAt.toDate().toISOString()
          : prompt.createdAt || new Date().toISOString(),
        updatedAt: prompt.updatedAt && typeof prompt.updatedAt === 'object' && 'toDate' in prompt.updatedAt
          ? prompt.updatedAt.toDate().toISOString()
          : prompt.updatedAt
      }))

      setPrompts(prev => [...prev, ...serializedNewPrompts])
      setCurrentPage(nextPage)

      // Check if there are more prompts to load
      if (newPrompts.length < PROMPTS_PER_PAGE) {
        setHasMore(false)
      }

    } catch (error) {
      console.error('Error loading more prompts:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <StructuredData isHomepage={true} />
      <HeroSection />

      <section className="px-3 md:px-4 py-8 md:py-12 max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <nav className="mb-4 text-sm text-muted-foreground">
            <span className="text-foreground">Home</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-balance">FREE AI PROMPTS FOR CONTENT CREATION</h1>
          <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 text-pretty">
            Browse our free collection of AI prompts for ChatGPT, Claude, Gemini, and all models. Download tested marketing templates, and prompt engineering guides for SEO, social media, and business growth.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Link href="/chatgpt-prompts" className="brutalist-border bg-card p-4 brutalist-shadow hover:bg-muted transition-colors">
              <h3 className="font-bold text-lg mb-2">ChatGPT Prompts</h3>
              <p className="text-sm text-muted-foreground">OpenAI GPT-4 and GPT-3.5 templates</p>
            </Link>
            <Link href="/marketing" className="brutalist-border bg-card p-4 brutalist-shadow hover:bg-muted transition-colors">
              <h3 className="font-bold text-lg mb-2">Marketing</h3>
              <p className="text-sm text-muted-foreground">Content creation and social media</p>
            </Link>
            <Link href="/seo-prompts" className="brutalist-border bg-card p-4 brutalist-shadow hover:bg-muted transition-colors">
              <h3 className="font-bold text-lg mb-2">SEO Prompts</h3>
              <p className="text-sm text-muted-foreground">Search engine optimization</p>
            </Link>
            <Link href="/prompts" className="brutalist-border bg-card p-4 brutalist-shadow hover:bg-muted transition-colors">
              <h3 className="font-bold text-lg mb-2">All Prompts</h3>
              <p className="text-sm text-muted-foreground">Browse complete collection</p>
            </Link>
          </div>

          {categories.length > 0 && (
            <CategoryFilter
              categories={['All', ...categories.map(cat => cat.name)]}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          )}

          {categories.length === 0 && !loading && (
            <div className="brutalist-border bg-muted p-6 text-center brutalist-shadow-sm mb-6">
              <h3 className="text-lg font-bold mb-2">NO CATEGORIES AVAILABLE</h3>
              <p className="text-sm text-muted-foreground">
                Categories are being set up. Check back soon for organized prompt collections.
              </p>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8 md:py-12">
            <div className="brutalist-border bg-card p-6 md:p-8 brutalist-shadow">
              <h3 className="text-xl md:text-2xl font-bold mb-2">LOADING PROMPTS...</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Please wait while we fetch the latest prompts.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-muted-foreground">
              Showing {prompts.length} prompt{prompts.length !== 1 ? 's' : ''}
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
              {!loading && hasMore && " (scroll down or click Load More for more)"}
              {!loading && !hasMore && prompts.length > 0 && " (showing all available prompts)"}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {prompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>

            {prompts.length === 0 && (
              <div className="text-center py-8 md:py-12">
                <div className="brutalist-border bg-card p-6 md:p-8 brutalist-shadow">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">NO PROMPTS FOUND</h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Try selecting a different category or check back later for new prompts.
                  </p>
                </div>
              </div>
            )}

            <LoadMoreButton
              onLoadMore={loadMorePrompts}
              loading={loadingMore}
              hasMore={hasMore}
            />

            {prompts.length > 0 && (
              <div className="mt-12 md:mt-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Popular Prompts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {prompts.slice(0, 4).map((prompt) => (
                    <Link
                      key={prompt.id}
                      href={`/prompts/${prompt.slug}`}
                      className="brutalist-border bg-card p-6 brutalist-shadow hover:bg-muted transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="bg-accent/10 text-accent px-2 py-1 text-xs font-medium">
                          {prompt.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-3">{prompt.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {prompt.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {prompt.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="bg-muted px-2 py-1 text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-accent hover:text-accent/80 font-medium text-sm">
                        View Prompt →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <section className="px-3 md:px-4 py-8 md:py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center">
            Learn Prompt Engineering
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8 md:mb-12 text-center max-w-4xl mx-auto">
            Master the art of creating effective AI prompts with our comprehensive guides and tutorials. Start getting better results from ChatGPT, Claude, Gemini, and all AI platforms.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="brutalist-border bg-card p-6 brutalist-shadow">
              <h3 className="font-bold text-lg mb-3">Beginner's Guide</h3>
              <p className="text-muted-foreground mb-4">Learn the fundamentals of prompt writing and AI interaction basics.</p>
              <Link href="/prompt-engineering" className="text-accent hover:text-accent/80 font-medium">
                Start Learning →
              </Link>
            </div>
            <div className="brutalist-border bg-card p-6 brutalist-shadow">
              <h3 className="font-bold text-lg mb-3">Advanced Techniques</h3>
              <p className="text-muted-foreground mb-4">Discover sophisticated prompting strategies for complex AI tasks.</p>
              <Link href="/prompt-engineering" className="text-accent hover:text-accent/80 font-medium">
                Advanced Methods →
              </Link>
            </div>
            <div className="brutalist-border bg-card p-6 brutalist-shadow">
              <h3 className="font-bold text-lg mb-3">Best Practices</h3>
              <p className="text-muted-foreground mb-4">Follow proven methods and industry standards for prompt engineering.</p>
              <Link href="/prompt-engineering" className="text-accent hover:text-accent/80 font-medium">
                View Guidelines →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
