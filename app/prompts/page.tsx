"use client"

import { useState, useEffect } from "react"
import { PromptCard } from "@/components/prompt-card"
import { StructuredData } from "@/components/structured-data"
import { promptsService, FirestorePrompt } from "@/lib/firestore-service"
import { getCategories } from "@/lib/migrate-categories"
import { Category } from "@/lib/category-service"
import { CategoryFilter } from "@/components/category-filter"
import Link from "next/link"

export default function PromptsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [prompts, setPrompts] = useState<FirestorePrompt[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dbCategories, approvedPrompts] = await Promise.all([
          getCategories(),
          promptsService.getApprovedPrompts(selectedCategory)
        ])

        setCategories(dbCategories)

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
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [selectedCategory])

  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "All Free AI Prompts - Complete Collection",
    "description": "Browse our complete collection of free AI prompts for ChatGPT, Claude, Gemini, and all models. Download tested templates for content creation, marketing, SEO, and business growth.",
    "url": `${process.env.NEXT_PUBLIC_SITE_URL}/prompts`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": prompts.length,
      "itemListElement": prompts.map((prompt, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${process.env.NEXT_PUBLIC_SITE_URL}/prompts/${prompt.slug}`
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
          "name": "All Prompts",
          "item": `${process.env.NEXT_PUBLIC_SITE_URL}/prompts`
        }
      ]
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <StructuredData isHomepage={false} />

      <div className="px-3 md:px-4 py-8 md:py-16 max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12">
          <nav className="mb-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link> / <span>All Prompts</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-balance">
            All Free AI Prompts - Complete Collection
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 text-pretty max-w-4xl">
            Browse our complete collection of free AI prompts for ChatGPT, Claude, Gemini, and all models. Download tested templates for content creation, marketing, SEO, and business growth. All prompts are categorized and optimized for specific use cases.
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
            <Link href="/prompt-engineering" className="brutalist-border bg-card p-4 brutalist-shadow hover:bg-muted transition-colors">
              <h3 className="font-bold text-lg mb-2">Learn Prompting</h3>
              <p className="text-sm text-muted-foreground">Master all AI platforms</p>
            </Link>
          </div>

          {categories.length > 0 && (
            <CategoryFilter
              categories={['All', ...categories.map(cat => cat.name)]}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          )}
        </div>

        {loading ? (
          <div className="text-center py-8 md:py-12">
            <div className="brutalist-border bg-card p-6 md:p-8 brutalist-shadow">
              <h3 className="text-xl md:text-2xl font-bold mb-2">LOADING PROMPTS...</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Please wait while we fetch all prompts.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-muted-foreground">
              Showing {prompts.length} prompt{prompts.length !== 1 ? 's' : ''}
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

            {prompts.length > 0 && (
              <div className="mt-12 md:mt-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Popular Prompt Categories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.slice(0, 6).map((category) => (
                    <Link
                      key={category.id}
                      href={`/?category=${encodeURIComponent(category.name)}`}
                      className="brutalist-border bg-card p-6 brutalist-shadow hover:bg-muted transition-colors"
                    >
                      <h3 className="font-bold text-lg mb-3">{category.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {category.description || `Browse ${category.name.toLowerCase()} prompts for your specific needs.`}
                      </p>
                      <span className="text-accent hover:text-accent/80 font-medium text-sm">
                        View {category.name} Prompts →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}