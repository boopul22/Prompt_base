"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PromptCard } from "@/components/prompt-card"
import { CategoryFilter } from "@/components/category-filter"
import { HeroSection } from "@/components/hero-section"
import { StructuredData } from "@/components/structured-data"
import { promptsService, FirestorePrompt } from "@/lib/firestore-service"
import { migrateMockDataToFirestore } from "@/lib/migrate-data"
import { getCategories } from "@/lib/migrate-categories"
import { Category } from "@/lib/category-service"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [prompts, setPrompts] = useState<FirestorePrompt[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories and prompts in parallel
        const [dbCategories, approvedPrompts] = await Promise.all([
          getCategories(),
          promptsService.getApprovedPrompts(selectedCategory)
        ])

        console.log('Loaded categories:', dbCategories.length)
        console.log('Loaded prompts:', approvedPrompts.length, 'Category:', selectedCategory)
        
        setCategories(dbCategories)
        setPrompts(approvedPrompts)
        
        // Only migrate prompts if no prompts exist
        if (approvedPrompts.length === 0) {
          console.log('No prompts found, running migration...')
          await migrateMockDataToFirestore()
          // Reload prompts after migration
          const migratedPrompts = await promptsService.getApprovedPrompts(selectedCategory)
          setPrompts(migratedPrompts)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [selectedCategory])

  return (
    <main className="min-h-screen bg-background">
      <StructuredData isHomepage={true} />
      <HeroSection />

      <section id="categories" className="px-3 md:px-4 py-8 md:py-12 max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <nav className="mb-4 text-sm text-muted-foreground">
            <span className="text-foreground">Home</span>
          </nav>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-balance">FREE AI PROMPTS FOR CONTENT CREATION</h2>
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
            <Link href="/prompt-engineering" className="brutalist-border bg-card p-4 brutalist-shadow hover:bg-muted transition-colors">
              <h3 className="font-bold text-lg mb-2">Learn Prompting</h3>
              <p className="text-sm text-muted-foreground">Master all AI platforms</p>
            </Link>
          </div>

          <CategoryFilter
            categories={['All', ...categories.map(cat => cat.name)]}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
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
