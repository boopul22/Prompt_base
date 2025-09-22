"use client"

import { useState } from "react"
import { CategoryFilter } from "@/components/category-filter"
import { PromptCard } from "@/components/prompt-card"
import { Pagination } from "@/components/pagination"
import Link from "next/link"

interface HomePageClientProps {
  initialPrompts: any[]
  initialCategories: any[]
  initialSelectedCategory: string
  initialPagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
    hasMore: boolean
  }
}

export function HomePageClient({
  initialPrompts,
  initialCategories,
  initialSelectedCategory,
  initialPagination
}: HomePageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialSelectedCategory)
  const [prompts, setPrompts] = useState(initialPrompts)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState(initialPagination)

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category)
    setLoading(true)

    try {
      // Fetch new prompts for the selected category (reset to page 1)
      const response = await fetch(`/api/prompts?category=${category}&page=1`)
      if (response.ok) {
        const data = await response.json()
        setPrompts(data.prompts)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error loading prompts for category:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = async (page: number) => {
    setLoading(true)

    try {
      const response = await fetch(`/api/prompts?category=${selectedCategory}&page=${page}`)
      if (response.ok) {
        const data = await response.json()
        setPrompts(data.prompts)
        setPagination(data.pagination)

        // Scroll to top of prompts section
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (error) {
      console.error('Error loading prompts for page:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
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

        {initialCategories.length > 0 && (
          <CategoryFilter
            categories={['All', ...initialCategories.map(cat => cat.name)]}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        )}

        {initialCategories.length === 0 && (
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
            Showing {(pagination.currentPage - 1) * pagination.pageSize + 1}-{Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems} prompt{pagination.totalItems !== 1 ? 's' : ''}
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
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

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}

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
                      {prompt.tags.slice(0, 3).map((tag: string) => (
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
    </>
  )
}